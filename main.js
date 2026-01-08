// main.js - Orchestrateur principal avec système de niveaux

class TimeManager {
    constructor(updateTimer, gameOver) {
        this.timer = 0;
        this.timerInterval = null;
        this.updateTimer = updateTimer;
        this.gameOver = gameOver;
    }
    
    startTimer(duration) {
        this.timer = duration;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimer(this.timer);
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.gameOver('Temps écoulé !');
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}

class PointsManager {
    constructor(updateUI) {
        this.score = 0;
        this.collectedCrystals = 0;
        this.falls = 0;
        this.updateUI = updateUI;
    }
    
    addCrystal(points = 10) {
        this.collectedCrystals++;
        this.score += points;
        this.updateUI();
        this.showFeedback('💎 +10 pts', 'crystal');
    }
    
    addFall(penalty = 20) {
        this.falls++;
        this.score = Math.max(0, this.score - penalty);
        this.updateUI();
        this.showFeedback('💥 -20 pts', 'damage');
    }
    
    addLevelBonus(levelBonus, crystalBonus, timeBonus) {
        this.score += levelBonus + crystalBonus + timeBonus;
        this.updateUI();
    }
    
    reset() {
        this.collectedCrystals = 0;
        this.falls = 0;
        this.updateUI();
    }
    
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: ${type === 'crystal' ? '#00ffff' : '#ff0000'};
            text-shadow: 0 0 20px ${type === 'crystal' ? '#00ffff' : '#ff0000'};
            pointer-events: none;
            z-index: 9999;
            animation: feedbackPulse 0.8s ease-out;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 800);
    }
}

// ========== CONFIGURATION THREE.JS ==========
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1e);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 50, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lumières
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ========== VARIABLES ==========
let gameState = 'menu';
let currentDifficulty = 'beginner';

const mazeGroup = new THREE.Group();
scene.add(mazeGroup);

// 🆕 LEVEL LOADER
const levelLoader = new LevelLoader();

// 🆕 SYSTÈME DE DÉBLOCAGE
const unlockedDifficulties = {
    beginner: true,
    intermediate: false,
    expert: false
};

let timeManager;
let pointsManager;
let platformManager;
let enemyManager;
let crystalManager;
let physicsEngine;
let ball = null;
let ballLight = null;

// ========== CONTRÔLES ==========
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

renderer.domElement.addEventListener('mousedown', (e) => {
    if (e.button === 0 && gameState === 'playing') {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging || gameState !== 'playing') return;
    
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    const newTiltX = physicsEngine.tilt.x - deltaY * 0.001;
    const newTiltZ = physicsEngine.tilt.z + deltaX * 0.001;
    
    physicsEngine.setTilt(newTiltX, newTiltZ);
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
});

// ========== UI ==========
function updateTimerUI(timer) {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').className = timer <= 10 ? 'timer timer-warning' : 'timer';
}

function updateUI() {
    document.getElementById('level').textContent = currentDifficulty === 'beginner' ? 'Débutant' : currentDifficulty;
    document.getElementById('score').textContent = pointsManager.score;
    document.getElementById('crystals').textContent = pointsManager.collectedCrystals;
    document.getElementById('falls').textContent = pointsManager.falls;
}

// ========== BILLE ==========
function createBall() {
    if (ball) {
        mazeGroup.remove(ball);
        if (ballLight) scene.remove(ballLight);
    }
    
    const ballGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.8
    });
    ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(-15, 0.5, -15);
    ball.castShadow = true;
    mazeGroup.add(ball);
    
    ballLight = new THREE.PointLight(0xffff00, 1.5, 12);
    ballLight.position.copy(ball.position);
    scene.add(ballLight);
    
    return ball;
}

// ========== GAME LOGIC ==========
function startGame(difficulty) {
    console.log('=== DÉMARRAGE DU JEU ===');
    
    currentDifficulty = difficulty;
    
    // 🆕 CHARGER LA CONFIGURATION DU NIVEAU
    const levelConfig = levelLoader.getLevel(difficulty);
    
    if (!levelConfig) {
        console.error('❌ Impossible de charger le niveau !');
        return;
    }
    
    pointsManager = new PointsManager(updateUI);
    timeManager = new TimeManager(updateTimerUI, gameOver);
    platformManager = new PlatformManager(scene, mazeGroup);
    enemyManager = new EnemyManager(scene, mazeGroup);
    crystalManager = new CrystalManager(scene, mazeGroup);
    
    // 🆕 CRÉER LE NIVEAU DEPUIS LA CONFIG
    const { walls, holes, exit } = platformManager.createPlatform(levelConfig);
    const enemies = enemyManager.createEnemies(levelConfig.settings.enemyCount, 1);
    const crystals = crystalManager.createCrystals(levelConfig.settings.crystalCount, 1);
    
    createBall();
    
    physicsEngine = new PhysicsEngine(ball, mazeGroup, walls, holes, enemies, crystals, exit);
    
    physicsEngine.onFall = () => pointsManager.addFall();
    physicsEngine.onCrystalCollected = () => pointsManager.addCrystal();
    physicsEngine.onLevelComplete = () => levelComplete(levelConfig);

    // CALLBACK CHANGEMENT DE PLATEFORME
    physicsEngine.onPlatformChange = (platformLevel) => {
        console.log(`🏯 Changement vers plateforme ${platformLevel}`);
        
        enemyManager.clear();
        crystalManager.clear();
        
        const newEnemies = enemyManager.createEnemies(levelConfig.settings.enemyCount, platformLevel);
        const newCrystals = crystalManager.createCrystals(levelConfig.settings.crystalCount, platformLevel);
        
        physicsEngine.enemies = newEnemies;
        physicsEngine.crystals = newCrystals;
        
        console.log(`✔️ ${newEnemies.length} ennemis et ${newCrystals.length} cristaux recréés`);
    };
    
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    gameState = 'playing';
    updateUI();
    
    // 🆕 UTILISER LE TEMPS DU NIVEAU
    timeManager.startTimer(levelConfig.settings.timeLimit);
    
    console.log('=== JEU DÉMARRÉ ===');
}

function levelComplete(levelConfig) {
    if (gameState !== 'playing') return;
    
    timeManager.stopTimer();
    gameState = 'victory';
    
    const levelBonus = 200;
    const crystalBonus = pointsManager.collectedCrystals * 10;
    const timeBonus = timeManager.timer * 10;
    
    pointsManager.addLevelBonus(levelBonus, crystalBonus, timeBonus);
    
    // 🆕 DÉBLOQUER LE NIVEAU SUIVANT
    unlockNextDifficulty(currentDifficulty);
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('victory').style.display = 'flex';
    document.getElementById('victoryMessage').textContent = `${levelConfig.name} terminé !`;
    document.getElementById('crystalBonus').textContent = `+${crystalBonus} pts`;
    document.getElementById('timeBonus').textContent = `+${timeBonus} pts`;
    document.getElementById('totalScore').textContent = pointsManager.score;
    
    // 🆕 GÉRER LE BOUTON "NIVEAU SUIVANT"
    const nextLevelBtn = document.getElementById('nextLevel');
    const nextDiff = levelLoader.getNextDifficulty(currentDifficulty);
    
    if (nextDiff && unlockedDifficulties[nextDiff]) {
        nextLevelBtn.style.display = 'block';
        nextLevelBtn.onclick = () => {
            returnToMenu();
        };
    } else {
        nextLevelBtn.style.display = 'none';
    }
}

// 🆕 FONCTION DE DÉBLOCAGE
function unlockNextDifficulty(currentDiff) {
    if (currentDiff === 'beginner') {
        unlockedDifficulties.intermediate = true;
        const btnIntermediate = document.getElementById('btn-intermediate');
        if (btnIntermediate) {
            btnIntermediate.disabled = false;
            btnIntermediate.classList.remove('disabled');
            console.log('🔓 Intermédiaire débloqué !');
        }
    } else if (currentDiff === 'intermediate') {
        unlockedDifficulties.expert = true;
        const btnExpert = document.getElementById('btn-expert');
        if (btnExpert) {
            btnExpert.disabled = false;
            btnExpert.classList.remove('disabled');
            console.log('🔓 Expert débloqué !');
        }
    } else if (currentDiff === 'expert') {
        console.log('🏆 Tous les niveaux terminés !');
    }
}

function gameOver(message) {
    timeManager.stopTimer();
    gameState = 'gameover';
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('finalScore').textContent = pointsManager.score;
}

function returnToMenu() {
    if (timeManager) timeManager.stopTimer();
    if (platformManager) platformManager.clear();
    if (enemyManager) enemyManager.clear();
    if (crystalManager) crystalManager.clear();
    
    if (ball) {
        mazeGroup.remove(ball);
        ball = null;
    }
    if (ballLight) {
        scene.remove(ballLight);
        ballLight = null;
    }
    
    camera.position.set(0, 50, 60);
    
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    
    gameState = 'menu';
}

function animate() {
    requestAnimationFrame(animate);
    
    if (gameState === 'playing' && physicsEngine) {
        physicsEngine.update();
        
        if (ballLight && ball) {
            ballLight.position.copy(ball.position);
        }
        
        // CAMÉRA SUIT LA BILLE
        if (ball) {
            let cameraOffset;
            if (ball.position.y < -10) {
                cameraOffset = 25;
            } else {
                cameraOffset = 40;
            }
            const targetCameraY = ball.position.y + cameraOffset;
            const diffY = targetCameraY - camera.position.y;
            if (Math.abs(diffY) > 0.5) {
                camera.position.y += diffY * 0.12;
            }
            
            camera.position.x = 0;
            camera.position.z = 50;
            camera.lookAt(0, camera.position.y - 40, 0);
        }
    }
    
    renderer.render(scene, camera);
}

// ========== ÉVÉNEMENTS ==========
window.addEventListener('DOMContentLoaded', () => {
    // 🔧 GESTION DYNAMIQUE DES BOUTONS DE DIFFICULTÉ
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.dataset.difficulty) {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                // Vérifier si le niveau est débloqué
                if (unlockedDifficulties[difficulty]) {
                    startGame(difficulty);
                } else {
                    console.log(`🔒 ${difficulty} est verrouillé`);
                }
            });
        }
    });

    const nextLevelBtn = document.getElementById('nextLevel');
    const returnMenuBtn = document.getElementById('returnMenu');
    const returnMenuVictoryBtn = document.getElementById('returnMenuVictory');
    const quitGameBtn = document.getElementById('quitGame');
    
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', () => {
        const nextDiff = levelLoader.getNextDifficulty(currentDifficulty);
        if (nextDiff) {
            returnToMenu();
        }
    });
    if (returnMenuBtn) returnMenuBtn.addEventListener('click', returnToMenu);
    if (returnMenuVictoryBtn) returnMenuVictoryBtn.addEventListener('click', returnToMenu);
    if (quitGameBtn) quitGameBtn.addEventListener('click', returnToMenu);
    
    animate();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
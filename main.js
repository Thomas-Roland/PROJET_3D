// main.js - Orchestrateur principal SIMPLIFIÃ‰

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
                this.gameOver('Temps Ã©coulÃ© !');
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
        this.showFeedback('ðŸ’Ž +10 pts', 'crystal');
    }
    
    addFall(penalty = 20) {
        this.falls++;
        this.score = Math.max(0, this.score - penalty);
        this.updateUI();
        this.showFeedback('ðŸ’¥ -20 pts', 'damage');
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
scene.fog = new THREE.Fog(0x0a0a1e, 10, 50);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 20, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// LumiÃ¨res
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ========== VARIABLES ==========
let gameState = 'menu';
let difficulty = 'beginner';
let level = 1;

const mazeGroup = new THREE.Group();
scene.add(mazeGroup);

const difficultySettings = {
    beginner: { time: 180, enemyCount: 2, crystalCount: 3, wallComplexity: 'easy' }
};

let timeManager;
let pointsManager;
let platformManager;
let enemyManager;
let crystalManager;
let physicsEngine;
let ball = null;
let ballLight = null;

// ========== CONTRÃ”LES ==========
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
    // DÃ©sactiver le zoom pendant le jeu
    // La camÃ©ra suit automatiquement la bille
});

// ========== UI ==========
function updateTimerUI(timer) {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').className = timer <= 10 ? 'timer timer-warning' : 'timer';
}

function updateUI() {
    document.getElementById('level').textContent = level;
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
    ball.position.set(-7, 0.5, -7);
    ball.castShadow = true;
    mazeGroup.add(ball); // ✅ CORRECTION ICI
    
    ballLight = new THREE.PointLight(0xffff00, 1.5, 12);
    ballLight.position.copy(ball.position);
    scene.add(ballLight);
    
    return ball;
}

// ========== GAME LOGIC ==========
function startGame(diff) {
    console.log('=== DÃ‰MARRAGE DU JEU ===');
    
    difficulty = diff;
    level = 1;
    
    pointsManager = new PointsManager(updateUI);
    timeManager = new TimeManager(updateTimerUI, gameOver);
    platformManager = new PlatformManager(scene, mazeGroup, difficultySettings);
    enemyManager = new EnemyManager(scene, mazeGroup);
    crystalManager = new CrystalManager(scene, mazeGroup);
    
    const { walls, holes, exit } = platformManager.createPlatform(difficulty);
    const enemies = enemyManager.createEnemies(difficultySettings[difficulty].enemyCount, 1);
    const crystals = crystalManager.createCrystals(difficultySettings[difficulty].crystalCount, 1);
    
    createBall();
    
    physicsEngine = new PhysicsEngine(ball, mazeGroup, walls, holes, enemies, crystals, exit);
    
    physicsEngine.onFall = () => pointsManager.addFall();
physicsEngine.onCrystalCollected = () => pointsManager.addCrystal();
physicsEngine.onLevelComplete = () => levelComplete();

// 🆕 CALLBACK CHANGEMENT DE PLATEFORME
physicsEngine.onPlatformChange = (platformLevel) => {
    console.log(`🎯 Changement vers plateforme ${platformLevel}`);
    
    // Supprimer anciens ennemis/cristaux
    enemyManager.clear();
    crystalManager.clear();
    
    // Recréer sur la nouvelle plateforme
    const newEnemies = enemyManager.createEnemies(difficultySettings[difficulty].enemyCount, platformLevel);
    const newCrystals = crystalManager.createCrystals(difficultySettings[difficulty].crystalCount, platformLevel);
    
    // Mettre à jour le moteur physique
    physicsEngine.enemies = newEnemies;
    physicsEngine.crystals = newCrystals;
    
    console.log(`✅ ${newEnemies.length} ennemis et ${newCrystals.length} cristaux recréés`);
};
    
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    gameState = 'playing';
    updateUI();
    timeManager.startTimer(difficultySettings[difficulty].time);
    
    console.log('=== JEU DÃ‰MARRÃ‰ ===');
}

function levelComplete() {
    if (gameState !== 'playing') return;
    
    timeManager.stopTimer();
    gameState = 'victory';
    
    const levelBonus = 200;
    const crystalBonus = pointsManager.collectedCrystals * 10;
    const timeBonus = timeManager.timer * 10;
    
    pointsManager.addLevelBonus(levelBonus, crystalBonus, timeBonus);
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('victory').style.display = 'flex';
    document.getElementById('victoryMessage').textContent = `Niveau ${level} terminÃ© !`;
    document.getElementById('crystalBonus').textContent = `+${crystalBonus} pts`;
    document.getElementById('timeBonus').textContent = `+${timeBonus} pts`;
    document.getElementById('totalScore').textContent = pointsManager.score;
}

function nextLevel() {
    level++;
    pointsManager.reset();
    
    const { walls, holes, exit } = platformManager.createPlatform(difficulty);
    const enemies = enemyManager.createEnemies(difficultySettings[difficulty].enemyCount, level);
    const crystals = crystalManager.createCrystals(difficultySettings[difficulty].crystalCount, level);
    
    createBall();
    
    physicsEngine = new PhysicsEngine(ball, mazeGroup, walls, holes, enemies, crystals, exit);
    physicsEngine.onFall = () => pointsManager.addFall();
physicsEngine.onCrystalCollected = () => pointsManager.addCrystal();
physicsEngine.onLevelComplete = () => levelComplete();

// 🆕 CALLBACK CHANGEMENT DE PLATEFORME (aussi pour nextLevel)
physicsEngine.onPlatformChange = (platformLevel) => {
    console.log(`🎯 Changement vers plateforme ${platformLevel}`);
    
    enemyManager.clear();
    crystalManager.clear();
    
    const newEnemies = enemyManager.createEnemies(difficultySettings[difficulty].enemyCount, platformLevel);
    const newCrystals = crystalManager.createCrystals(difficultySettings[difficulty].crystalCount, platformLevel);
    
    physicsEngine.enemies = newEnemies;
    physicsEngine.crystals = newCrystals;
    
    console.log(`✅ ${newEnemies.length} ennemis et ${newCrystals.length} cristaux recréés`);
};
    
    camera.position.y = 20;
    
    document.getElementById('victory').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    gameState = 'playing';
    updateUI();
    timeManager.startTimer(difficultySettings[difficulty].time);
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
    
    camera.position.y = 20;
    
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
        
        // ðŸ“¹ CAMÃ‰RA SUIT AUTOMATIQUEMENT LA BILLE
        if (ball) {
            // Position Y : au-dessus de la bille
            const targetCameraY = ball.position.y + 15;
            const diffY = targetCameraY - camera.position.y;
            if (Math.abs(diffY) > 0.5) {
                camera.position.y += diffY * 0.12;
            }
            
            // Position X et Z : VUE DE FACE CENTRÃ‰E
            const targetCameraX = 0;  // Bien au centre
            const targetCameraZ = 25; // Distance fixe
            
            camera.position.x = 0; // Fixe X
            camera.position.z = 25; // Fixe Z
            
            // ðŸ‘ï¸ CAMÃ‰RA REGARDE LE CENTRE EXACT
            camera.lookAt(0, camera.position.y - 15, 0);
        }
    }
    
    renderer.render(scene, camera);
}

// ========== Ã‰VÃ‰NEMENTS ==========
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.dataset.difficulty && !btn.disabled) {
            btn.addEventListener('click', () => startGame(btn.dataset.difficulty));
        }
    });

    const nextLevelBtn = document.getElementById('nextLevel');
    const returnMenuBtn = document.getElementById('returnMenu');
    const returnMenuVictoryBtn = document.getElementById('returnMenuVictory');
    const quitGameBtn = document.getElementById('quitGame');
    
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', nextLevel);
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
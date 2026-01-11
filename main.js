// main.js - Orchestrateur principal optimisé

// ========== CLASSES UTILITAIRES ==========
class TimeManager {
    constructor(updateTimer, gameOver) {
        this.timer = 0;
        this.timerInterval = null;
        this.updateTimer = updateTimer;
        this.gameOver = gameOver;
    }
    
    startTimer(duration) {
        this.timer = duration;
        this.stopTimer(); // Évite les doublons
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimer(this.timer);
            if (this.timer <= 0) {
                this.stopTimer();
                this.gameOver('Temps écoulé !');
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
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

// ========== VARIABLES GLOBALES ==========
let gameState = 'menu';
let currentDifficulty = 'beginner';

const mazeGroup = new THREE.Group();
scene.add(mazeGroup);

const levelLoader = new LevelLoader();

const unlockedDifficulties = {
    beginner: true,
    intermediate: false,
    expert: false
};

let timeManager, pointsManager, platformManager, enemyManager, crystalManager, physicsEngine;
let ball = null;
let ballLight = null;

// Cache des éléments DOM
const DOM = {};

// ========== CONTRÔLES ==========
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const mouseHandlers = {
    down: (e) => {
        if (e.button === 0 && gameState === 'playing') {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    },
    
    move: (e) => {
        if (!isDragging || gameState !== 'playing') return;
        
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        physicsEngine.setTilt(
            physicsEngine.tilt.x - deltaY * 0.001,
            physicsEngine.tilt.z + deltaX * 0.001
        );
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    },
    
    up: () => isDragging = false,
    
    wheel: (e) => e.preventDefault()
};

// ========== UI FUNCTIONS ==========
const UI = {
    updateTimer(timer) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        DOM.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        DOM.timer.className = timer <= 10 ? 'timer timer-warning' : 'timer';
    },
    
    update() {
        const difficultyNames = { beginner: 'Débutant', intermediate: 'Intermédiaire', expert: 'Expert' };
        DOM.level.textContent = difficultyNames[currentDifficulty] || currentDifficulty;
        DOM.score.textContent = pointsManager.score;
        DOM.crystals.textContent = pointsManager.collectedCrystals;
        DOM.falls.textContent = pointsManager.falls;
    },
    
    show(elementId) {
        DOM[elementId]?.style && (DOM[elementId].style.display = elementId.includes('Menu') || elementId.includes('victory') || elementId.includes('gameOver') ? 'flex' : 'block');
    },
    
    hide(elementId) {
        DOM[elementId]?.style && (DOM[elementId].style.display = 'none');
    }
};

// ========== GAME LOGIC ==========
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

function startGame(difficulty) {
    console.log('=== DÉMARRAGE DU JEU ===');
    
    currentDifficulty = difficulty;
    const levelConfig = levelLoader.getLevel(difficulty);
    
    if (!levelConfig) {
        console.error('❌ Impossible de charger le niveau !');
        return;
    }
    
    // Initialisation des managers
    pointsManager = new PointsManager(UI.update);
    timeManager = new TimeManager(UI.updateTimer, gameOver);
    platformManager = new PlatformManager(scene, mazeGroup);
    enemyManager = new EnemyManager(scene, mazeGroup);
    crystalManager = new CrystalManager(scene, mazeGroup);
    
    // Création du niveau
    const { walls, holes, exit } = platformManager.createPlatform(levelConfig);
    const enemies = enemyManager.createEnemies(levelConfig.settings.enemyCount, 1);
    const crystals = crystalManager.createCrystals(levelConfig.settings.crystalCount, 1);
    
    createBall();
    
    // Moteur physique
    physicsEngine = new PhysicsEngine(ball, mazeGroup, walls, holes, enemies, crystals, exit);
    physicsEngine.onFall = () => pointsManager.addFall();
    physicsEngine.onCrystalCollected = () => pointsManager.addCrystal();
    physicsEngine.onLevelComplete = () => levelComplete(levelConfig);
    physicsEngine.onPlatformChange = handlePlatformChange(levelConfig);
    
    // UI
    UI.hide('startMenu');
    UI.show('gameUI');
    
    gameState = 'playing';
    UI.update();
    timeManager.startTimer(levelConfig.settings.timeLimit);
    
    console.log('=== JEU DÉMARRÉ ===');
}

function handlePlatformChange(levelConfig) {
    return (platformLevel) => {
        console.log(`🏯 Changement vers plateforme ${platformLevel}`);
        
        enemyManager.clear();
        crystalManager.clear();
        
        const newEnemies = enemyManager.createEnemies(levelConfig.settings.enemyCount, platformLevel);
        const newCrystals = crystalManager.createCrystals(levelConfig.settings.crystalCount, platformLevel);
        
        physicsEngine.enemies = newEnemies;
        physicsEngine.crystals = newCrystals;
        
        console.log(`✔️ ${newEnemies.length} ennemis et ${newCrystals.length} cristaux recréés`);
    };
}

function levelComplete(levelConfig) {
    if (gameState !== 'playing') return;
    
    timeManager.stopTimer();
    gameState = 'victory';
    
    const levelBonus = 200;
    const crystalBonus = pointsManager.collectedCrystals * 10;
    const timeBonus = timeManager.timer * 10;
    
    pointsManager.addLevelBonus(levelBonus, crystalBonus, timeBonus);
    unlockNextDifficulty(currentDifficulty);
    
    UI.hide('gameUI');
    UI.show('victory');
    DOM.victoryMessage.textContent = `${levelConfig.name} terminé !`;
    DOM.crystalBonus.textContent = `+${crystalBonus} pts`;
    DOM.timeBonus.textContent = `+${timeBonus} pts`;
    DOM.totalScore.textContent = pointsManager.score;
    
    // Gestion du bouton niveau suivant
    const nextDiff = levelLoader.getNextDifficulty(currentDifficulty);
    if (nextDiff && unlockedDifficulties[nextDiff]) {
        DOM.nextLevel.style.display = 'block';
    } else {
        DOM.nextLevel.style.display = 'none';
    }
}

function unlockNextDifficulty(currentDiff) {
    const unlockMap = {
        beginner: { next: 'intermediate', btnId: 'btn-intermediate', label: 'Intermédiaire' },
        intermediate: { next: 'expert', btnId: 'btn-expert', label: 'Expert' }
    };
    
    const unlock = unlockMap[currentDiff];
    if (unlock) {
        unlockedDifficulties[unlock.next] = true;
        const btn = document.getElementById(unlock.btnId);
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('disabled');
            console.log(`🔓 ${unlock.label} débloqué !`);
        }
    } else if (currentDiff === 'expert') {
        console.log('🏆 Tous les niveaux terminés !');
    }
}

function gameOver(message) {
    timeManager.stopTimer();
    gameState = 'gameover';
    
    UI.hide('gameUI');
    UI.show('gameOver');
    DOM.gameOverMessage.textContent = message;
    DOM.finalScore.textContent = pointsManager.score;
}

function returnToMenu() {
    // Nettoyage
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
    
    UI.hide('gameOver');
    UI.hide('victory');
    UI.show('startMenu');
    
    gameState = 'menu';
}

function updateCamera() {
    if (!ball) return;
    
    const cameraOffset = ball.position.y < -10 ? 25 : 40;
    const targetCameraY = ball.position.y + cameraOffset;
    const diffY = targetCameraY - camera.position.y;
    
    if (Math.abs(diffY) > 0.5) {
        camera.position.y += diffY * 0.12;
    }
    
    camera.position.x = 0;
    camera.position.z = 50;
    camera.lookAt(0, camera.position.y - 40, 0);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (gameState === 'playing' && physicsEngine) {
        physicsEngine.update();
        
        if (ballLight && ball) {
            ballLight.position.copy(ball.position);
        }
        
        updateCamera();
    }
    
    renderer.render(scene, camera);
}

// ========== ÉVÉNEMENTS ==========
function initDOMCache() {
    const ids = ['timer', 'level', 'score', 'crystals', 'falls', 'startMenu', 'gameUI', 
                 'victory', 'gameOver', 'victoryMessage', 'crystalBonus', 'timeBonus', 
                 'totalScore', 'gameOverMessage', 'finalScore', 'nextLevel'];
    
    ids.forEach(id => DOM[id] = document.getElementById(id));
}

function initEventListeners() {
    // Contrôles souris
    renderer.domElement.addEventListener('mousedown', mouseHandlers.down);
    renderer.domElement.addEventListener('mousemove', mouseHandlers.move);
    renderer.domElement.addEventListener('mouseup', mouseHandlers.up);
    renderer.domElement.addEventListener('wheel', mouseHandlers.wheel);
    
    // Boutons de difficulté
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.dataset.difficulty) {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                if (unlockedDifficulties[difficulty]) {
                    startGame(difficulty);
                } else {
                    console.log(`🔒 ${difficulty} est verrouillé`);
                }
            });
        }
    });
    
    // Boutons de navigation
    DOM.nextLevel?.addEventListener('click', () => {
        const nextDiff = levelLoader.getNextDifficulty(currentDifficulty);
        if (nextDiff) returnToMenu();
    });
    
    document.getElementById('returnMenu')?.addEventListener('click', returnToMenu);
    document.getElementById('returnMenuVictory')?.addEventListener('click', returnToMenu);
    document.getElementById('quitGame')?.addEventListener('click', returnToMenu);
    
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========== INITIALISATION ==========
window.addEventListener('DOMContentLoaded', () => {
    initDOMCache();
    initEventListeners();
    animate();
});
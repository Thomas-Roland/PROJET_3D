// main.js - Orchestrateur principal du jeu
// Ce fichier coordonne tous les gestionnaires

// Gestionnaires de temps et points
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
    
    addCrystal(points = 50) {
        this.collectedCrystals++;
        this.score += points;
        this.updateUI();
    }
    
    addFall(penalty = 20) {
        this.falls++;
        this.score = Math.max(0, this.score - penalty);
        this.updateUI();
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
}

// Configuration Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1e);
scene.fog = new THREE.Fog(0x0a0a1e, 10, 50);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 15, 15);

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

// Variables de jeu
let gameState = 'menu';
let difficulty = 'beginner';
let level = 1;

// Groupe du labyrinthe
const mazeGroup = new THREE.Group();
scene.add(mazeGroup);

// Paramètres de difficulté
const difficultySettings = {
    beginner: { time: 180, enemyCount: 2, crystalCount: 3, wallComplexity: 'simple', holeCount: 2 },
    intermediate: { time: 120, enemyCount: 4, crystalCount: 5, wallComplexity: 'medium', holeCount: 3 },
    expert: { time: 90, enemyCount: 6, crystalCount: 7, wallComplexity: 'complex', holeCount: 4 }
};

// Gestionnaires
let timeManager;
let pointsManager;
let platformManager;
let enemyManager;
let crystalManager;
let physicsEngine;
let ball = null;
let ballLight = null;

// Contrôles
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
    if (gameState !== 'playing') return;
    camera.position.y = Math.max(10, Math.min(25, camera.position.y + e.deltaY * 0.01));
});

// Fonctions UI
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

// Création de la bille
function createBall() {
    if (ball) {
        mazeGroup.remove(ball);
        if (ballLight) scene.remove(ballLight);
    }
    
    const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00
    });
    ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(-4.5, 3, -4.5);
    ball.castShadow = true;
    mazeGroup.add(ball);
    
    ballLight = new THREE.PointLight(0xffff00, 1, 10);
    ballLight.position.copy(ball.position);
    scene.add(ballLight);
    
    return ball;
}

// Gestion du jeu
function startGame(diff) {
    difficulty = diff;
    level = 1;
    
    // Initialisation des gestionnaires
    pointsManager = new PointsManager(updateUI);
    timeManager = new TimeManager(updateTimerUI, gameOver);
    platformManager = new PlatformManager(scene, mazeGroup, difficultySettings);
    enemyManager = new EnemyManager(scene, mazeGroup);
    crystalManager = new CrystalManager(scene, mazeGroup);
    
    // Création du niveau
    const { walls, holes, exit } = platformManager.createPlatform(difficulty);
    const enemies = enemyManager.createEnemies(difficultySettings[difficulty].enemyCount);
    const crystals = crystalManager.createCrystals(difficultySettings[difficulty].crystalCount);
    
    // Création de la bille
    createBall();
    
    // Initialisation du moteur physique
    physicsEngine = new PhysicsEngine(ball, mazeGroup, walls, holes, enemies, crystals, exit);
    
    // Callbacks du moteur physique
    physicsEngine.onFall = () => pointsManager.addFall();
    physicsEngine.onCrystalCollected = () => pointsManager.addCrystal();
    physicsEngine.onLevelComplete = () => levelComplete();
    
    // Affichage
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    gameState = 'playing';
    updateUI();
    timeManager.startTimer(difficultySettings[difficulty].time);
}

function unlockDifficulties() {
    const btnIntermediate = document.getElementById('btn-intermediate');
    const btnExpert = document.getElementById('btn-expert');
    if (btnIntermediate) btnIntermediate.disabled = false;
    if (btnExpert) btnExpert.disabled = false;
}

function levelComplete() {
    if (gameState !== 'playing') return;
    
    timeManager.stopTimer();
    gameState = 'victory';
    
    const levelBonus = 200;
    const crystalBonus = pointsManager.collectedCrystals * 50;
    const timeBonus = timeManager.timer * 10;
    
    pointsManager.addLevelBonus(levelBonus, crystalBonus, timeBonus);
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('victory').style.display = 'flex';
    document.getElementById('victoryMessage').textContent = `Niveau ${level} terminé !`;
    document.getElementById('crystalBonus').textContent = `+${crystalBonus} pts`;
    document.getElementById('timeBonus').textContent = `+${timeBonus} pts`;
    document.getElementById('totalScore').textContent = pointsManager.score;
    
    if (difficulty === 'beginner' && level === 1) unlockDifficulties();
}

function nextLevel() {
    level++;
    pointsManager.reset();
    
    // Recréation du niveau
    const { walls, holes, exit } = platformManager.createPlatform(difficulty);
    const enemies = enemyManager.createEnemies(difficultySettings[difficulty].enemyCount);
    const crystals = crystalManager.createCrystals(difficultySettings[difficulty].crystalCount);
    
    createBall();
    
    // Réinitialisation du moteur physique
    physicsEngine = new PhysicsEngine(ball, mazeGroup, walls, holes, enemies, crystals, exit);
    physicsEngine.onFall = () => pointsManager.addFall();
    physicsEngine.onCrystalCollected = () => pointsManager.addCrystal();
    physicsEngine.onLevelComplete = () => levelComplete();
    
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
    
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    
    gameState = 'menu';
}

// Boucle principale
function animate() {
    requestAnimationFrame(animate);
    
    if (gameState === 'playing' && physicsEngine) {
        physicsEngine.update();
        
        // Mise à jour de la lumière de la bille
        if (ballLight && ball) {
            ballLight.position.copy(ball.position);
        }
        
        // Caméra suit la bille
        if (ball) {
            camera.lookAt(ball.position);
        }
    }
    
    renderer.render(scene, camera);
}

// Événements - Attendre que le DOM soit chargé
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation du jeu');
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.dataset.difficulty && !btn.disabled) {
            btn.addEventListener('click', () => {
                startGame(btn.dataset.difficulty);
            });
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
    
    console.log('Jeu initialisé avec succès');
    
    // Démarrage de la boucle d'animation
    animate();
});

// Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// Suppression des imports ES6 pour compatibilité navigateur classique
// import { Enemy } from './src/enemies.js';
// import { Crystal } from './src/crystals.js';

// Ajout des classes Enemy et Crystal directement ici pour compatibilité navigateur
class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    update() {}
    render(ctx) {}
}

class Crystal {
    constructor(x, y, value = 1) {
        this.x = x;
        this.y = y;
        this.value = value;
    }
    collect(player) {
        player.score += this.value;
    }
    render(ctx) {}
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
let score = 0;
let timer = 0;
let timerInterval = null;
let collectedCrystals = 0;
let falls = 0;

// Groupe du labyrinthe
const mazeGroup = new THREE.Group();
scene.add(mazeGroup);

// Variables physiques
const tilt = { x: 0, z: 0 };
const maxTilt = 0.3;
let ballVelocity = new THREE.Vector3(0, 0, 0);

// Objets du jeu
let ball = null;
let ballLight = null;
let walls = [];
let crystals = [];
let enemies = [];
let exit = null;
let holes = [];

// Paramètres de difficulté
const difficultySettings = {
    beginner: { time: 180, enemyCount: 2, crystalCount: 3, wallComplexity: 'simple', holeCount: 2 },
    intermediate: { time: 120, enemyCount: 4, crystalCount: 5, wallComplexity: 'medium', holeCount: 3 },
    expert: { time: 90, enemyCount: 6, crystalCount: 7, wallComplexity: 'complex', holeCount: 4 }
};

// Création du labyrinthe
function createMaze() {
    clearMaze();
    
    // Cas spécial pour le niveau débutant : deux plateformes superposées
    if (difficulty === 'beginner') {
        // Plateforme du haut
        const platformTopGeo = new THREE.BoxGeometry(12, 0.5, 12);
        const platformMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3e });
        const platformTop = new THREE.Mesh(platformTopGeo, platformMat);
        platformTop.position.y = 4.5; // plus haut
        platformTop.receiveShadow = true;
        mazeGroup.add(platformTop);

        // Plateforme du bas (encore plus bas)
        const platformBottomGeo = new THREE.BoxGeometry(12, 0.5, 12);
        const platformBottom = new THREE.Mesh(platformBottomGeo, platformMat);
        platformBottom.position.y = -3; // descendue plus bas
        platformBottom.receiveShadow = true;
        mazeGroup.add(platformBottom);

        // Trou dans la plateforme du haut (pour descendre)
        const holeGeo = new THREE.CylinderGeometry(1, 1, 0.6, 24);
        const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x220000 });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.set(0, 4.5, 0); // centre
        mazeGroup.add(hole);
        holes.push(hole);

        // Sortie (zone verte) sur la plateforme du bas, sous le trou
        const exitGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
        const exitMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            emissive: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        exit = new THREE.Mesh(exitGeo, exitMat);
        exit.position.set(0, -2.6, 0); // sous le trou, sur la plateforme du bas
        mazeGroup.add(exit);

        // Bille lumineuse sur la plateforme du haut
        const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const ballMat = new THREE.MeshStandardMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00
        });
        ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(-4.5, 5, -4.5); // sur la plateforme du haut
        ball.castShadow = true;
        mazeGroup.add(ball);

        // Lumière de la bille
        ballLight = new THREE.PointLight(0xffff00, 1, 10);
        ballLight.position.copy(ball.position);
        scene.add(ballLight);

        // Murs extérieurs haut et bas
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x3a3a6e });
        function createWall(x, y, z, width, depth, yPos) {
            const geo = new THREE.BoxGeometry(width, 1, depth);
            const wall = new THREE.Mesh(geo, wallMat);
            wall.position.set(x, yPos, z);
            wall.castShadow = true;
            wall.receiveShadow = true;
            mazeGroup.add(wall);
            walls.push(wall);
        }
        // Haut
        createWall(0, 0.25, -6, 12, 0.3, 4.5);
        createWall(0, 0.25, 6, 12, 0.3, 4.5);
        createWall(-6, 0.25, 0, 0.3, 12, 4.5);
        createWall(6, 0.25, 0, 0.3, 12, 4.5);
        // Bas
        createWall(0, 0.25, -6, 12, 0.3, -3);
        createWall(0, 0.25, 6, 12, 0.3, -3);
        createWall(-6, 0.25, 0, 0.3, 12, -3);
        createWall(6, 0.25, 0, 0.3, 12, -3);

        // Cristaux sur les deux plateformes
        for (let i = 0; i < 2; i++) {
            const x = (Math.random() - 0.5) * 8;
            const z = (Math.random() - 0.5) * 8;
            const y = 5; // plateforme du haut
            const crystal = new Crystal(x, y);
            const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
            const crystalMat = new THREE.MeshStandardMaterial({ color: 0x44ffff, emissive: 0x00ffff });
            const mesh = new THREE.Mesh(crystalGeo, crystalMat);
            mesh.position.set(x, y, z);
            mesh.userData.collected = false;
            mazeGroup.add(mesh);
            crystals.push(mesh);
        }
        // Un cristal sur la plateforme du bas
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        const y = -2; // plateforme du bas
        const crystal = new Crystal(x, y);
        const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
        const crystalMat = new THREE.MeshStandardMaterial({ color: 0x44ffff, emissive: 0x00ffff });
        const mesh = new THREE.Mesh(crystalGeo, crystalMat);
        mesh.position.set(x, y, z);
        mesh.userData.collected = false;
        mazeGroup.add(mesh);
        crystals.push(mesh);

        // Ennemis uniquement sur la plateforme du haut
        for (let i = 0; i < 2; i++) {
            const ex = (Math.random() - 0.5) * 8;
            const ez = (Math.random() - 0.5) * 8;
            const ey = 5;
            const enemy = new Enemy(ex, ey);
            const enemyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
            const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.3 });
            const mesh = new THREE.Mesh(enemyGeo, enemyMat);
            mesh.position.set(ex, ey, ez);
            mesh.castShadow = true;
            mesh.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.08);
            mesh.userData.changeDirectionTimer = Math.random() * 100;
            mazeGroup.add(mesh);
            enemies.push(mesh);
        }
        return;
    }
    
    // Plateforme principale
    const platformGeo = new THREE.BoxGeometry(12, 0.5, 12);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3e });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.receiveShadow = true;
    mazeGroup.add(platform);
    
    // Matériau des murs
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x3a3a6e });
    
    // Fonction pour créer un mur
    function createWall(x, y, z, width, depth) {
        const geo = new THREE.BoxGeometry(width, 1, depth);
        const wall = new THREE.Mesh(geo, wallMat);
        wall.position.set(x, y + 0.5, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        mazeGroup.add(wall);
        walls.push(wall);
    }
    
    // Murs extérieurs
    createWall(0, 0.25, -6, 12, 0.3);
    createWall(0, 0.25, 6, 12, 0.3);
    createWall(-6, 0.25, 0, 0.3, 12);
    createWall(6, 0.25, 0, 0.3, 12);
    
    // Murs internes selon difficulté
    const complexity = difficultySettings[difficulty].wallComplexity;
    
    if (complexity === 'simple') {
        createWall(-3, 0.25, -3, 0.3, 4);
        createWall(3, 0.25, 3, 0.3, 4);
        createWall(0, 0.25, 0, 4, 0.3);
    } else if (complexity === 'medium') {
        createWall(-3, 0.25, -3, 0.3, 6);
        createWall(3, 0.25, 3, 0.3, 6);
        createWall(0, 0.25, -2, 6, 0.3);
        createWall(0, 0.25, 2, 6, 0.3);
        createWall(-2, 0.25, 0, 0.3, 4);
    } else {
        createWall(-3, 0.25, -3, 0.3, 8);
        createWall(3, 0.25, 3, 0.3, 8);
        createWall(-1, 0.25, -2, 6, 0.3);
        createWall(1, 0.25, 2, 6, 0.3);
        createWall(-2, 0.25, 0, 0.3, 6);
        createWall(2, 0.25, 0, 0.3, 6);
    }
    
    // Trous
    const holeCount = difficultySettings[difficulty].holeCount || 2;
    for (let i = 0; i < holeCount; i++) {
        const holeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 16);
        const holeMat = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            emissive: 0x220000
        });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.set(
            (Math.random() - 0.5) * 10,
            0,
            (Math.random() - 0.5) * 10
        );
        mazeGroup.add(hole);
        holes.push(hole);
    }
    
    // Cristaux (utilisation de la classe Crystal)
    const crystalCount = difficultySettings[difficulty].crystalCount;
    for (let i = 0; i < crystalCount; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = 0.8;
        const z = (Math.random() - 0.5) * 10;
        const crystal = new Crystal(x, y);
        // Pour l'affichage, on garde l'objet Three.js
        const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
        const crystalMat = new THREE.MeshStandardMaterial({ 
            color: 0x44ffff,
            emissive: 0x00ffff
        });
        const mesh = new THREE.Mesh(crystalGeo, crystalMat);
        mesh.position.set(x, y, z);
        mesh.userData.collected = false;
        mazeGroup.add(mesh);
        crystals.push(mesh);
    }
    
    // Ennemis (utilisation de la classe Enemy)
    const enemyCount = difficultySettings[difficulty].enemyCount;
    for (let i = 0; i < enemyCount; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = 0.6;
        const z = (Math.random() - 0.5) * 10;
        const enemy = new Enemy(x, y);
        // Pour l'affichage, on garde l'objet Three.js
        const enemyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const enemyMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const mesh = new THREE.Mesh(enemyGeo, enemyMat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            0,
            (Math.random() - 0.5) * 0.05
        );
        mesh.userData.changeDirectionTimer = Math.random() * 100;
        mazeGroup.add(mesh);
        enemies.push(mesh);
    }
    
    // Sortie (zone verte - le seul "trou" où arriver)
    const exitGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
    const exitMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00,
        emissive: 0x00ff00,
        transparent: true,
        opacity: 0.8
    });
    exit = new THREE.Mesh(exitGeo, exitMat);
    exit.position.set(4.5, 0.4, 4.5);
    mazeGroup.add(exit);
    
    // Bille lumineuse
    const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00
    });
    ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(-4.5, 1, -4.5);
    ball.castShadow = true;
    mazeGroup.add(ball);
    
    // Lumière de la bille
    ballLight = new THREE.PointLight(0xffff00, 1, 10);
    ballLight.position.copy(ball.position);
    scene.add(ballLight);
}

function clearMaze() {
    while (mazeGroup.children.length > 0) {
        mazeGroup.remove(mazeGroup.children[0]);
    }
    if (ballLight) {
        scene.remove(ballLight);
        ballLight = null;
    }
    walls = [];
    crystals = [];
    enemies = [];
    holes = [];
    ball = null;
    exit = null;
}

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
    
    tilt.x = Math.max(-maxTilt, Math.min(maxTilt, tilt.x - deltaY * 0.001));
    tilt.z = Math.max(-maxTilt, Math.min(maxTilt, tilt.z + deltaX * 0.001));
    
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

// Physique de la bille
function updatePhysics() {
    if (!ball || gameState !== 'playing') return;

    // Rotation du labyrinthe
    mazeGroup.rotation.x = tilt.x;
    mazeGroup.rotation.z = tilt.z;

    // Gravité plus lente et logique corrigée (haut/bas intuitif)
    const gravity = 0.13;
    ballVelocity.x += Math.sin(tilt.x) * gravity * 0.18; // x = avant/arrière (haut/bas écran)
    ballVelocity.z += Math.sin(tilt.z) * gravity * 0.18; // z = gauche/droite (gauche/droite écran)

    // Friction plus réaliste
    ballVelocity.x *= 0.96;
    ballVelocity.z *= 0.96;

    // Limite la vitesse max
    const maxSpeed = 0.22;
    ballVelocity.x = Math.max(-maxSpeed, Math.min(maxSpeed, ballVelocity.x));
    ballVelocity.z = Math.max(-maxSpeed, Math.min(maxSpeed, ballVelocity.z));

    // Déplacement
    ball.position.x += ballVelocity.x;
    ball.position.z += ballVelocity.z;

    // Gestion de la hauteur pour le niveau débutant
    if (difficulty === 'beginner') {
        // Si la bille est sur la plateforme du haut et passe dans le trou, elle tombe sur la plateforme du bas
        if (ball.position.y > 3 && Math.abs(ball.position.x) < 1 && Math.abs(ball.position.z) < 1) {
            ball.position.y = 1.2; // arrive sur la plateforme du bas
            ballVelocity.y = 0;
        }
        // Empêche de tomber en dehors des plateformes
        if (ball.position.y > 3) {
            if (Math.abs(ball.position.x) > 5.5) ball.position.x = Math.sign(ball.position.x) * 5.5;
            if (Math.abs(ball.position.z) > 5.5) ball.position.z = Math.sign(ball.position.z) * 5.5;
        } else {
            if (Math.abs(ball.position.x) > 5.5) ball.position.x = Math.sign(ball.position.x) * 5.5;
            if (Math.abs(ball.position.z) > 5.5) ball.position.z = Math.sign(ball.position.z) * 5.5;
        }
        // La plateforme du bas reste fixe tant que la bille n'est pas dessus
        mazeGroup.children.forEach(obj => {
            if (obj.position && Math.abs(obj.position.y + 3) < 0.3) {
                if (ball.position.y > -1.5) {
                    obj.rotation.x = 0;
                    obj.rotation.z = 0;
                } else {
                    obj.rotation.x = tilt.x;
                    obj.rotation.z = tilt.z;
                }
            }
        });
        // Collision avec les trous (chute hors trou principal)
        holes.forEach(hole => {
            if (hole.position.y > 3) return; // ignorer le trou du haut
            const dist = ball.position.distanceTo(hole.position);
            if (dist < 0.8) {
                ball.position.set(-4.5, 5, -4.5);
                ballVelocity.set(0, 0, 0);
                falls++;
                score = Math.max(0, score - 20);
                updateUI();
            }
        });
        // Collision avec les ennemis (plateforme du haut uniquement)
        enemies.forEach(enemy => {
            if (enemy.position.y < 3) return;
            const dist = ball.position.distanceTo(enemy.position);
            if (dist < 0.8) {
                ball.position.set(-4.5, 5, -4.5);
                ballVelocity.set(0, 0, 0);
                falls++;
                score = Math.max(0, score - 20);
                updateUI();
            }
        });
        // Atteindre la sortie (plateforme du bas)
        if (exit && ball.position.y < 3) {
            const distToExit = ball.position.distanceTo(exit.position);
            if (distToExit < 1.2) {
                levelComplete();
            }
        }
        // Mise à jour de la lumière
        if (ballLight) {
            ballLight.position.copy(ball.position);
        }
        camera.lookAt(ball.position);
        return;
    }

    // Collision avec les murs
    walls.forEach(wall => {
        const ballBox = new THREE.Box3().setFromObject(ball);
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (ballBox.intersectsBox(wallBox)) {
            // Rebond plus marqué
            ball.position.x -= ballVelocity.x * 1.2;
            ball.position.z -= ballVelocity.z * 1.2;
            ballVelocity.x *= -0.45 - Math.random() * 0.15; // rebond aléatoire
            ballVelocity.z *= -0.45 - Math.random() * 0.15;
        }
    });
    
    // Limites de la plateforme
    if (Math.abs(ball.position.x) > 5.5) {
        ball.position.x = Math.sign(ball.position.x) * 5.5;
        ballVelocity.x *= -0.5;
    }
    if (Math.abs(ball.position.z) > 5.5) {
        ball.position.z = Math.sign(ball.position.z) * 5.5;
        ballVelocity.z *= -0.5;
    }
    
    // Collision avec les trous
    holes.forEach(hole => {
        const dist = ball.position.distanceTo(hole.position);
        if (dist < 0.8) {
            ball.position.set(-4.5, 1, -4.5);
            ballVelocity.set(0, 0, 0);
            falls++;
            score = Math.max(0, score - 20);
            updateUI();
        }
    });
    
    // Collision avec les ennemis
    enemies.forEach(enemy => {
        const dist = ball.position.distanceTo(enemy.position);
        if (dist < 0.8) {
            ball.position.set(-4.5, 1, -4.5);
            ballVelocity.set(0, 0, 0);
            falls++;
            score = Math.max(0, score - 20);
            updateUI();
        }
    });
    
    // Déplacement des ennemis
    enemies.forEach(enemy => {
        // Changement de direction aléatoire
        enemy.userData.changeDirectionTimer--;
        if (enemy.userData.changeDirectionTimer <= 0) {
            // Mouvement plus dynamique
            enemy.userData.velocity.x = (Math.random() - 0.5) * 0.12;
            enemy.userData.velocity.z = (Math.random() - 0.5) * 0.12;
            enemy.userData.changeDirectionTimer = 40 + Math.random() * 80;
        }

        // Déplacement
        enemy.position.x += enemy.userData.velocity.x;
        enemy.position.z += enemy.userData.velocity.z;

        // Limites de la plateforme (haut ou bas selon y)
        let yPlat = enemy.position.y > 3 ? 4.5 : 0;
        if (Math.abs(enemy.position.x) > 5.5) {
            enemy.position.x = Math.sign(enemy.position.x) * 5.5;
            enemy.userData.velocity.x *= -1;
        }
        if (Math.abs(enemy.position.z) > 5.5) {
            enemy.position.z = Math.sign(enemy.position.z) * 5.5;
            enemy.userData.velocity.z *= -1;
        }

        // Collision avec les murs
        walls.forEach(wall => {
            if (Math.abs(wall.position.y - enemy.position.y) > 1) return;
            const enemyBox = new THREE.Box3().setFromObject(enemy);
            const wallBox = new THREE.Box3().setFromObject(wall);
            if (enemyBox.intersectsBox(wallBox)) {
                enemy.position.x -= enemy.userData.velocity.x;
                enemy.position.z -= enemy.userData.velocity.z;
                enemy.userData.velocity.multiplyScalar(-1);
            }
        });

        // Rotation pour effet visuel
        enemy.rotation.y += 0.02;
    });
    
    // Collection des cristaux
    crystals.forEach(crystal => {
        if (!crystal.userData.collected) {
            const dist = ball.position.distanceTo(crystal.position);
            if (dist < 0.8) {
                crystal.userData.collected = true;
                crystal.visible = false;
                collectedCrystals++;
                score += 50;
                updateUI();
            }
        }
    });
    
    // Rotation des cristaux
    crystals.forEach(crystal => {
        if (!crystal.userData.collected) {
            crystal.rotation.y += 0.02;
        }
    });
    
    // Atteindre la sortie
    if (exit) {
        const distToExit = ball.position.distanceTo(exit.position);
        if (distToExit < 1.2) {
            levelComplete();
        }
    }
    
    // Mise à jour de la lumière
    if (ballLight) {
        ballLight.position.copy(ball.position);
    }
    
    // Caméra suit la bille
    camera.lookAt(ball.position);
}

// Gestion du jeu
function startGame(diff) {
    difficulty = diff;
    level = 1;
    score = 0;
    collectedCrystals = 0;
    falls = 0;
    tilt.x = 0;
    tilt.z = 0;
    ballVelocity.set(0, 0, 0);
    
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    gameState = 'playing';
    timer = difficultySettings[difficulty].time;
    
    createMaze();
    updateUI();
    startTimer();
}

// Débloque les difficultés avancées si le niveau débutant a été terminé
function unlockDifficulties() {
    const btnIntermediate = document.getElementById('btn-intermediate');
    const btnExpert = document.getElementById('btn-expert');
    if (btnIntermediate) btnIntermediate.disabled = false;
    if (btnExpert) btnExpert.disabled = false;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timer--;
        updateTimer();
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            gameOver('Temps écoulé !');
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').className = timer <= 10 ? 'timer timer-warning' : 'timer';
}

function updateUI() {
    document.getElementById('level').textContent = level;
    document.getElementById('score').textContent = score;
    document.getElementById('crystals').textContent = collectedCrystals;
    document.getElementById('falls').textContent = falls;
}

function levelComplete() {
    clearInterval(timerInterval);
    gameState = 'victory';
    
    const levelBonus = 200;
    const crystalBonus = collectedCrystals * 50;
    const timeBonus = timer * 10;
    const totalBonus = levelBonus + crystalBonus + timeBonus;
    score += totalBonus;
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('victory').style.display = 'flex';
    document.getElementById('victoryMessage').textContent = `Niveau ${level} terminé !`;
    document.getElementById('crystalBonus').textContent = `+${crystalBonus} pts`;
    document.getElementById('timeBonus').textContent = `+${timeBonus} pts`;
    document.getElementById('totalScore').textContent = score;

    // Si on vient de finir le niveau débutant, débloquer les autres difficultés
    if (difficulty === 'beginner') {
        unlockDifficulties();
    }
}

function nextLevel() {
    level++;
    collectedCrystals = 0;
    falls = 0;
    tilt.x = 0;
    tilt.z = 0;
    ballVelocity.set(0, 0, 0);
    
    document.getElementById('victory').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    gameState = 'playing';
    timer = difficultySettings[difficulty].time;
    
    createMaze();
    updateUI();
    startTimer();
}

function gameOver(message) {
    clearInterval(timerInterval);
    gameState = 'gameover';
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('finalScore').textContent = score;
}

function returnToMenu() {
    clearInterval(timerInterval);
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    gameState = 'menu';
    clearMaze();
}

// Événements
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    if (btn.dataset.difficulty) {
        btn.addEventListener('click', () => startGame(btn.dataset.difficulty));
    }
});

document.getElementById('nextLevel').addEventListener('click', nextLevel);
document.getElementById('returnMenu').addEventListener('click', returnToMenu);
document.getElementById('returnMenuVictory').addEventListener('click', returnToMenu);
document.getElementById('quitGame').addEventListener('click', () => {
    returnToMenu();
});

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    updatePhysics();
    renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// physics.js - Moteur physique du jeu
// Gestion de la gravité, collisions, déplacements

class PhysicsEngine {
    constructor(ball, mazeGroup, walls, holes, enemies, crystals, exit) {
        this.ball = ball;
        this.mazeGroup = mazeGroup;
        this.walls = walls;
        this.holes = holes;
        this.enemies = enemies;
        this.crystals = crystals;
        this.exit = exit;
        
        this.ballVelocity = new THREE.Vector3(0, 0, 0);
        this.tilt = { x: 0, z: 0 };
        this.maxTilt = 0.3;
        this.ballRadius = 0.5;
        
        // Callbacks pour les événements
        this.onFall = null;
        this.onCrystalCollected = null;
        this.onLevelComplete = null;
    }
    
    setTilt(x, z) {
        this.tilt.x = Math.max(-this.maxTilt, Math.min(this.maxTilt, x));
        this.tilt.z = Math.max(-this.maxTilt, Math.min(this.maxTilt, z));
    }
    
    resetBall(x = -7, y = 6, z = -7) {
        this.ball.position.set(x, y, z);
        this.ballVelocity.set(0, 0, 0);
    }
    
    update() {
        if (!this.ball) return;
        
        // Rotation du labyrinthe (inversée pour corriger la direction)
        this.mazeGroup.rotation.x = -this.tilt.x;
        this.mazeGroup.rotation.z = -this.tilt.z;
        
        // Gravité basée sur l'inclinaison (améliorée)
        const gravity = 0.2;
        this.ballVelocity.x += Math.sin(-this.tilt.z) * gravity;
        this.ballVelocity.z += Math.sin(-this.tilt.x) * gravity;
        
        // Friction
        this.ballVelocity.multiplyScalar(0.97);
        
        // Déplacement
        this.ball.position.x += this.ballVelocity.x;
        this.ball.position.z += this.ballVelocity.z;
        
        // Collision avec les murs (avec rebond)
        this.checkWallCollisions();
        
        // Limites de la plateforme (avec rebond)
        this.checkPlatformBounds();
        
        // Collision avec les trous (objectif)
        this.checkHoleCollisions();
        
        // Collision avec les ennemis
        this.checkEnemyCollisions();
        
        // Déplacement des ennemis
        this.updateEnemies();
        
        // Collection des cristaux
        this.checkCrystalCollisions();
        
        // Rotation des cristaux
        this.rotateCrystals();
    }
    
    checkWallCollisions() {
        this.walls.forEach(wall => {
            const ballCenter = this.ball.position;
            const wallCenter = wall.position;
            
            const dx = ballCenter.x - wallCenter.x;
            const dz = ballCenter.z - wallCenter.z;
            
            // Dimensions du mur
            const wallWidth = wall.geometry.parameters.width;
            const wallDepth = wall.geometry.parameters.depth;
            const wallHalfWidth = wallWidth / 2;
            const wallHalfDepth = wallDepth / 2;
            
            // Vérifier si la bille est proche du mur
            const closestX = Math.max(wallCenter.x - wallHalfWidth, Math.min(ballCenter.x, wallCenter.x + wallHalfWidth));
            const closestZ = Math.max(wallCenter.z - wallHalfDepth, Math.min(ballCenter.z, wallCenter.z + wallHalfDepth));
            
            const distanceX = ballCenter.x - closestX;
            const distanceZ = ballCenter.z - closestZ;
            const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ);
            
            // Si collision détectée
            if (distance < this.ballRadius) {
                // Calculer la pénétration
                const penetration = this.ballRadius - distance;
                
                // Déterminer l'axe principal de collision
                if (Math.abs(dx) / wallHalfWidth > Math.abs(dz) / wallHalfDepth) {
                    // Collision horizontale (gauche/droite du mur)
                    const direction = Math.sign(dx);
                    this.ball.position.x = wallCenter.x + direction * (wallHalfWidth + this.ballRadius + 0.1);
                    this.ballVelocity.x *= -0.5; // Rebond très amorti
                    this.ballVelocity.z *= 0.7; // Plus de friction latérale
                } else {
                    // Collision verticale (avant/arrière du mur)
                    const direction = Math.sign(dz);
                    this.ball.position.z = wallCenter.z + direction * (wallHalfDepth + this.ballRadius + 0.1);
                    this.ballVelocity.z *= -0.5; // Rebond très amorti
                    this.ballVelocity.x *= 0.7; // Plus de friction latérale
                }
            }
        });
    }
    
    checkPlatformBounds() {
        const platformLimit = 8.5; // Limite agrandie pour la nouvelle plateforme
        
        if (Math.abs(this.ball.position.x) > platformLimit) {
            this.ball.position.x = Math.sign(this.ball.position.x) * platformLimit;
            this.ballVelocity.x *= -0.7; // Rebond
        }
        if (Math.abs(this.ball.position.z) > platformLimit) {
            this.ball.position.z = Math.sign(this.ball.position.z) * platformLimit;
            this.ballVelocity.z *= -0.7; // Rebond
        }
    }
    
    checkHoleCollisions() {
        this.holes.forEach(hole => {
            const dist = this.ball.position.distanceTo(hole.position);
            if (dist < 1.0) {
                // Victoire ! La balle a atteint l'objectif
                if (this.onLevelComplete) this.onLevelComplete();
            }
        });
    }
    
    checkEnemyCollisions() {
        this.enemies.forEach(enemy => {
            const dist = this.ball.position.distanceTo(enemy.position);
            if (dist < 1.0) {
                this.resetBall();
                if (this.onFall) this.onFall();
            }
        });
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            // Changement de direction aléatoire
            enemy.userData.changeDirectionTimer--;
            if (enemy.userData.changeDirectionTimer <= 0) {
                enemy.userData.velocity.x = (Math.random() - 0.5) * 0.08;
                enemy.userData.velocity.z = (Math.random() - 0.5) * 0.08;
                enemy.userData.changeDirectionTimer = 50 + Math.random() * 100;
            }
            
            // Déplacement
            enemy.position.x += enemy.userData.velocity.x;
            enemy.position.z += enemy.userData.velocity.z;
            
            // Limites de la plateforme (agrandie)
            const platformLimit = 8.5;
            if (Math.abs(enemy.position.x) > platformLimit) {
                enemy.position.x = Math.sign(enemy.position.x) * platformLimit;
                enemy.userData.velocity.x *= -1;
            }
            if (Math.abs(enemy.position.z) > platformLimit) {
                enemy.position.z = Math.sign(enemy.position.z) * platformLimit;
                enemy.userData.velocity.z *= -1;
            }
            
            // Collision avec les murs
            this.walls.forEach(wall => {
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
    }
    
    checkCrystalCollisions() {
        this.crystals.forEach(crystal => {
            if (!crystal.userData.collected) {
                const dist = this.ball.position.distanceTo(crystal.position);
                if (dist < 1.0) {
                    crystal.userData.collected = true;
                    crystal.visible = false;
                    if (this.onCrystalCollected) this.onCrystalCollected();
                }
            }
        });
    }
    
    rotateCrystals() {
        this.crystals.forEach(crystal => {
            if (!crystal.userData.collected) {
                crystal.rotation.y += 0.02;
            }
        });
    }
}

// Export pour utilisation dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
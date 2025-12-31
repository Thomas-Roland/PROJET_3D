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
        
        // Callbacks pour les événements
        this.onFall = null;
        this.onCrystalCollected = null;
        this.onLevelComplete = null;
    }
    
    setTilt(x, z) {
        this.tilt.x = Math.max(-this.maxTilt, Math.min(this.maxTilt, x));
        this.tilt.z = Math.max(-this.maxTilt, Math.min(this.maxTilt, z));
    }
    
    resetBall(x = -4.5, y = 3, z = -4.5) {
        this.ball.position.set(x, y, z);
        this.ballVelocity.set(0, 0, 0);
    }
    
    update() {
        if (!this.ball) return;
        
        // Rotation du labyrinthe
        this.mazeGroup.rotation.x = this.tilt.x;
        this.mazeGroup.rotation.z = this.tilt.z;
        
        // Gravité basée sur l'inclinaison
        const gravity = 0.15;
        this.ballVelocity.x += Math.sin(this.tilt.z) * gravity * 0.1;
        this.ballVelocity.z += -Math.sin(this.tilt.x) * gravity * 0.1;
        
        // Friction
        this.ballVelocity.multiplyScalar(0.98);
        
        // Déplacement
        this.ball.position.x += this.ballVelocity.x;
        this.ball.position.z += this.ballVelocity.z;
        
        // Collision avec les murs
        this.checkWallCollisions();
        
        // Limites de la plateforme
        this.checkPlatformBounds();
        
        // Collision avec les trous
        this.checkHoleCollisions();
        
        // Collision avec les ennemis
        this.checkEnemyCollisions();
        
        // Déplacement des ennemis
        this.updateEnemies();
        
        // Collection des cristaux
        this.checkCrystalCollisions();
        
        // Rotation des cristaux
        this.rotateCrystals();
        
        // Atteindre la sortie
        this.checkExitCollision();
    }
    
    checkWallCollisions() {
        this.walls.forEach(wall => {
            const ballBox = new THREE.Box3().setFromObject(this.ball);
            const wallBox = new THREE.Box3().setFromObject(wall);
            
            if (ballBox.intersectsBox(wallBox)) {
                this.ball.position.x -= this.ballVelocity.x;
                this.ball.position.z -= this.ballVelocity.z;
                this.ballVelocity.multiplyScalar(-0.5);
            }
        });
    }
    
    checkPlatformBounds() {
        if (Math.abs(this.ball.position.x) > 5.5) {
            this.ball.position.x = Math.sign(this.ball.position.x) * 5.5;
            this.ballVelocity.x *= -0.5;
        }
        if (Math.abs(this.ball.position.z) > 5.5) {
            this.ball.position.z = Math.sign(this.ball.position.z) * 5.5;
            this.ballVelocity.z *= -0.5;
        }
    }
    
    checkHoleCollisions() {
        this.holes.forEach(hole => {
            const dist = this.ball.position.distanceTo(hole.position);
            if (dist < 0.8) {
                this.resetBall();
                if (this.onFall) this.onFall();
            }
        });
    }
    
    checkEnemyCollisions() {
        this.enemies.forEach(enemy => {
            const dist = this.ball.position.distanceTo(enemy.position);
            if (dist < 0.8) {
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
                enemy.userData.velocity.x = (Math.random() - 0.5) * 0.05;
                enemy.userData.velocity.z = (Math.random() - 0.5) * 0.05;
                enemy.userData.changeDirectionTimer = 50 + Math.random() * 100;
            }
            
            // Déplacement
            enemy.position.x += enemy.userData.velocity.x;
            enemy.position.z += enemy.userData.velocity.z;
            
            // Limites de la plateforme
            if (Math.abs(enemy.position.x) > 5.5) {
                enemy.position.x = Math.sign(enemy.position.x) * 5.5;
                enemy.userData.velocity.x *= -1;
            }
            if (Math.abs(enemy.position.z) > 5.5) {
                enemy.position.z = Math.sign(enemy.position.z) * 5.5;
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
                if (dist < 0.8) {
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
    
    checkExitCollision() {
        if (this.exit) {
            const distToExit = this.ball.position.distanceTo(this.exit.position);
            if (distToExit < 1.2) {
                if (this.onLevelComplete) this.onLevelComplete();
            }
        }
    }
}

// Export pour utilisation dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
// physics.js - Moteur physique simplifié et fonctionnel

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
        this.isFalling = false;
        
        // Callbacks
    this.onFall = null;
    this.onCrystalCollected = null;
    this.onLevelComplete = null;
    this.onCameraUpdate = null;
    this.onPlatformChange = null; // 🆕 NOUVEAU CALLBACK
    }
    
    setTilt(x, z) {
        this.tilt.x = Math.max(-this.maxTilt, Math.min(this.maxTilt, x));
        this.tilt.z = Math.max(-this.maxTilt, Math.min(this.maxTilt, z));
    }
    
    resetBall(x = -7, y = 0.5, z = -7) {
        this.ball.position.set(x, y, z);
        this.ballVelocity.set(0, 0, 0);
        this.isFalling = false;
    }
    
    update() {
        if (!this.ball) return;
        
        // Rotation du labyrinthe
        this.mazeGroup.rotation.x = -this.tilt.x;
        this.mazeGroup.rotation.z = -this.tilt.z;
        
// Si la bille tombe dans un trou
if (this.isFalling) {
    this.ball.position.y -= 0.2;
    this.ballVelocity.x *= 0.95;
    this.ballVelocity.z *= 0.95;
    
    console.log(`🔉 Chute: y = ${this.ball.position.y.toFixed(2)}`);
    
    // Atterrissage plateforme MILIEU
    if (this.ball.position.y <= -18.5 && this.ball.position.y > -21) {
        console.log(`✅ ATTERRISSAGE PLATEFORME MILIEU (y=${this.ball.position.y.toFixed(2)})`);
        // 🆕 GARDER la position X et Z actuelle (même axe que le trou)
        this.ball.position.y = -18.5;
        this.ballVelocity.set(0, 0, 0);
        this.isFalling = false;
        
        if (this.onPlatformChange) this.onPlatformChange(2);
        if (this.onCameraUpdate) this.onCameraUpdate(-18.5);
        return;
    } 
    // Atterrissage plateforme FINALE
    else if (this.ball.position.y <= -38.5 && this.ball.position.y > -41) {
        console.log(`✅ ATTERRISSAGE PLATEFORME FINALE (y=${this.ball.position.y.toFixed(2)})`);
        // 🆕 GARDER la position X et Z actuelle (même axe que le trou)
        this.ball.position.y = -38.5;
        this.ballVelocity.set(0, 0, 0);
        this.isFalling = false;
        
        if (this.onPlatformChange) this.onPlatformChange(3);
        if (this.onCameraUpdate) this.onCameraUpdate(-38.5);
        return;
    }
    
    return; // Ne pas exécuter le reste pendant la chute
}
        
        // GRAVITÉ VERTICALE (réduite pour éviter chute spontanée)
        this.ballVelocity.y -= 0.015;
        
        const gravity = 0.12;
        this.ballVelocity.x += Math.sin(-this.tilt.z) * gravity;
        this.ballVelocity.z += Math.sin(-this.tilt.x) * gravity;
        
        this.ballVelocity.x *= 0.86;
        this.ballVelocity.z *= 0.86;
        
        const maxSpeed = 0.20;
        const speed = Math.sqrt(this.ballVelocity.x ** 2 + this.ballVelocity.z ** 2);
        if (speed > maxSpeed) {
            this.ballVelocity.x = (this.ballVelocity.x / speed) * maxSpeed;
            this.ballVelocity.z = (this.ballVelocity.z / speed) * maxSpeed;
        }
        
        // DÉPLACEMENT
        this.ball.position.x += this.ballVelocity.x;
        this.ball.position.y += this.ballVelocity.y;
        this.ball.position.z += this.ballVelocity.z;
        
        // COLLISION AVEC LE SOL - Détection précise par plateforme
        let groundY;
        
        // Plateforme FINALE (y = -39.5)
        if (this.ball.position.y < -30) {
            groundY = -39.5;
        } 
        // Plateforme MILIEU (y = -19.5)
        else if (this.ball.position.y < -15) {
            groundY = -19.5;
        } 
        // Plateforme HAUTE (y = 0.5)
        else {
            groundY = 0.5;
        }
        
        // Empêcher de traverser le sol (SAUF si en chute dans un trou)
        if (!this.isFalling && this.ball.position.y <= groundY + this.ballRadius) {
            this.ball.position.y = groundY + this.ballRadius;
            
            if (this.ballVelocity.y < -0.15) {
                this.ballVelocity.y *= -0.3; // Rebond
            } else {
                this.ballVelocity.y = 0; // Arrêt complet
            }
        }
        
        // LIMITES DE LA PLATEFORME
        const limit = 9;
        if (Math.abs(this.ball.position.x) > limit) {
            this.ball.position.x = Math.sign(this.ball.position.x) * limit;
            this.ballVelocity.x *= -0.7;
        }
        if (Math.abs(this.ball.position.z) > limit) {
            this.ball.position.z = Math.sign(this.ball.position.z) * limit;
            this.ballVelocity.z *= -0.7;
        }
        
        // COLLISIONS
        this.checkWallCollisions();
        this.checkHoleCollisions();
        this.checkEnemyCollisions();
        this.checkCrystalCollisions();
        this.checkExitCollision();
        
        // DÉPLACEMENT ENNEMIS
        this.updateEnemies();
        
        // ROTATION CRISTAUX
        this.rotateCrystals();
        
        // TOMBE DANS LE VIDE (vraiment perdu)
        if (this.ball.position.y < -50) {
            console.log("💀 GAME OVER - Tombé dans le vide !");
            this.resetBall();
            if (this.onFall) this.onFall();
        }
    }
    
    checkWallCollisions() {
    this.walls.forEach(wall => {
        const wallWorldPos = new THREE.Vector3();
        wall.getWorldPosition(wallWorldPos);
        
        const dx = this.ball.position.x - wallWorldPos.x;
        const dy = this.ball.position.y - wallWorldPos.y;
        const dz = this.ball.position.z - wallWorldPos.z;
        
        // ✅ Ignorer si pas au même niveau (avec marge plus large)
        if (Math.abs(dy) > 3) return;
        
        const w = wall.geometry.parameters.width;
        const d = wall.geometry.parameters.depth;
        const h = wall.geometry.parameters.height;
        
        const closestX = Math.max(wallWorldPos.x - w/2, Math.min(this.ball.position.x, wallWorldPos.x + w/2));
        const closestZ = Math.max(wallWorldPos.z - d/2, Math.min(this.ball.position.z, wallWorldPos.z + d/2));
        
        const distX = this.ball.position.x - closestX;
        const distZ = this.ball.position.z - closestZ;
        const dist = Math.sqrt(distX * distX + distZ * distZ);
        
        if (dist < this.ballRadius + 0.1) {
            // ✅ Collision avec rebond
            if (Math.abs(dx) / (w/2) > Math.abs(dz) / (d/2)) {
                this.ball.position.x = wallWorldPos.x + Math.sign(dx) * (w/2 + this.ballRadius + 0.2);
                this.ballVelocity.x *= -0.6;
                this.ballVelocity.z *= 0.7;
            } else {
                this.ball.position.z = wallWorldPos.z + Math.sign(dz) * (d/2 + this.ballRadius + 0.2);
                this.ballVelocity.z *= -0.6;
                this.ballVelocity.x *= 0.7;
            }
        }
    });
}
    
   checkHoleCollisions() {
    this.holes.forEach((hole, index) => {
        if (!hole.userData.isFallThrough) return;
        
        const holeWorldPos = new THREE.Vector3();
        hole.getWorldPosition(holeWorldPos);
        
        const dist2D = Math.sqrt(
            Math.pow(this.ball.position.x - holeWorldPos.x, 2) +
            Math.pow(this.ball.position.z - holeWorldPos.z, 2)
        );
        
        const holeRadius = 2.5; // Rayon de détection réduit pour plus de précision
        
        // ✅ Déterminer la plateforme actuelle de la bille
        let currentPlatform;
        if (this.ball.position.y > -10) {
            currentPlatform = 1; // Plateforme haute
        } else if (this.ball.position.y > -30) {
            currentPlatform = 2; // Plateforme milieu
        } else {
            currentPlatform = 3; // Plateforme finale
        }
        
        // ✅ Déterminer la plateforme du trou
        let holePlatform;
        if (holeWorldPos.y > -10) {
            holePlatform = 1;
        } else if (holeWorldPos.y > -30) {
            holePlatform = 2;
        } else {
            holePlatform = 3;
        }
        
        // ✅ La bille doit être sur la MÊME plateforme que le trou
        const isOnSamePlatform = currentPlatform === holePlatform;
        
      // 🔍 LOGS détaillés (DÉSACTIVÉS pour éviter le spam - réactiver si besoin de debug)
        // if (dist2D < 5) {
        //     console.log(`🔍 Trou #${index}:`, {
        //         'Plateforme trou': holePlatform,
        //         'Plateforme bille': currentPlatform,
        //         'Même plateforme?': isOnSamePlatform,
        //         'Distance XZ': dist2D.toFixed(2),
        //     });
        // }
        
        // 🔍 LOG si proche du trou (pour debug)
        if (dist2D < 5 && isOnSamePlatform) {
            console.log(`🔍 Proche trou #${index} - Dist: ${dist2D.toFixed(2)}, Rayon: ${holeRadius}, isFalling: ${this.isFalling}`);
        }
        
        // ✅ Condition de chute : même plateforme + dans le rayon + pas déjà en train de tomber
        if (dist2D < holeRadius && isOnSamePlatform && !this.isFalling) {
            console.log(`🔥 ACTIVATION CHUTE - Distance: ${dist2D.toFixed(2)}, Plateforme: ${holePlatform}`);
            this.isFalling = true;
            
            // Attraction FORTE vers le centre du trou
            const pullStrength = 0.15;
            this.ballVelocity.x += (holeWorldPos.x - this.ball.position.x) * pullStrength;
            this.ballVelocity.z += (holeWorldPos.z - this.ball.position.z) * pullStrength;
            this.ballVelocity.y = -0.5; // Force la chute
            
            return; // 🆕 SORTIR immédiatement pour éviter plusieurs détections
        }
    });
}
    
    checkEnemyCollisions() {
        this.enemies.forEach(enemy => {
            // Position de l'ennemi dans le monde
            const enemyWorldPos = new THREE.Vector3();
            enemy.getWorldPosition(enemyWorldPos);
            
            const heightDiff = Math.abs(this.ball.position.y - enemyWorldPos.y);
            if (heightDiff > 2) return;
            
            const dist = this.ball.position.distanceTo(enemyWorldPos);
            
            // Collision avec l'ennemi (0.4 = rayon ennemi)
            if (dist < this.ballRadius + 0.4) {
                console.log("💥 Collision avec ennemi - RESPAWN !");
                this.resetBall();
                if (this.onFall) this.onFall();
            }
        });
    }
    
    checkCrystalCollisions() {
        this.crystals.forEach(crystal => {
            // Ne pas vérifier si déjà collecté ou invisible
            if (crystal.userData.collected || !crystal.visible) return;
            
            const dist = this.ball.position.distanceTo(crystal.position);
            
            if (dist < this.ballRadius + 0.7) {
                console.log("💎 Cristal collecté !");
                crystal.userData.collected = true;
                
                // Animation de disparition
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / 500;
                    
                    if (progress < 1 && crystal.material) {
                        crystal.material.opacity = 1 - progress;
                        crystal.material.transparent = true;
                        crystal.scale.setScalar(1 + progress * 0.5);
                        requestAnimationFrame(animate);
                    } else {
                        crystal.visible = false;
                    }
                };
                animate();
                
                if (this.onCrystalCollected) this.onCrystalCollected();
            }
        });
    }
    
    checkExitCollision() {
        if (!this.exit) return;
        
        // Position de la sortie dans le monde
        const exitWorldPos = new THREE.Vector3();
        this.exit.getWorldPosition(exitWorldPos);
        
       // ✔️ VICTOIRE SEULEMENT si bille est sur la DERNIÈRE plateforme
        const isOnFinalPlatform = this.ball.position.y < -38 && this.ball.position.y > -42;
        
        if (!isOnFinalPlatform) return; // Pas encore sur la bonne plateforme
        
        const dist = Math.sqrt(
            Math.pow(this.ball.position.x - exitWorldPos.x, 2) +
            Math.pow(this.ball.position.z - exitWorldPos.z, 2)
        );
        
        if (dist < 2.5) {
            console.log("🏆 NIVEAU TERMINÉ - Tu es sur la plateforme finale !");
            if (this.onLevelComplete) this.onLevelComplete();
        }
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            enemy.userData.changeDirectionTimer--;
            
            if (enemy.userData.changeDirectionTimer <= 0) {
                enemy.userData.velocity.x = (Math.random() - 0.5) * 0.08;
                enemy.userData.velocity.z = (Math.random() - 0.5) * 0.08;
                enemy.userData.changeDirectionTimer = 50 + Math.random() * 100;
            }
            
            enemy.position.x += enemy.userData.velocity.x;
            enemy.position.z += enemy.userData.velocity.z;
            
            // Limites
            const limit = 8;
            if (Math.abs(enemy.position.x) > limit) {
                enemy.position.x = Math.sign(enemy.position.x) * limit;
                enemy.userData.velocity.x *= -1;
            }
            if (Math.abs(enemy.position.z) > limit) {
                enemy.position.z = Math.sign(enemy.position.z) * limit;
                enemy.userData.velocity.z *= -1;
            }
            
            // Collision avec murs
            this.walls.forEach(wall => {
                const wallWorldPos = new THREE.Vector3();
                wall.getWorldPosition(wallWorldPos);
                
                const heightDiff = Math.abs(enemy.position.y - wallWorldPos.y);
                if (heightDiff > 2) return;
                
                const enemyBox = new THREE.Box3().setFromObject(enemy);
                const wallBox = new THREE.Box3().setFromObject(wall);
                
                if (enemyBox.intersectsBox(wallBox)) {
                    enemy.position.x -= enemy.userData.velocity.x;
                    enemy.position.z -= enemy.userData.velocity.z;
                    enemy.userData.velocity.multiplyScalar(-1);
                }
            });
            
            enemy.rotation.y += 0.02;
        });
    }
    
    rotateCrystals() {
        this.crystals.forEach(crystal => {
            if (!crystal.userData.collected) {
                crystal.rotation.y += 0.02;
            }
        });
    }
    
    // POUR COMPATIBILITÉ (non utilisé dans cette version)
    updateSolidObjects() {
        console.log("✔️ Objets initialisés");
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
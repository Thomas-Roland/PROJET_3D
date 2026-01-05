// enemies.js - Gestion des ennemis

class EnemyManager {
    constructor(scene, mazeGroup) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.enemies = [];
    }
    
    createEnemies(count, level = 1) {
        this.clear();
        
        // Position Y selon le niveau
        let yPosition;
        if (level === 1) {
            yPosition = 1.2; // Plateforme haute
        } else {
            yPosition = -18.8; // Plateforme finale
        }
        
        for (let i = 0; i < count; i++) {
            // ðŸ†• Zone Ã©largie : -15 Ã  +15 au lieu de -7 Ã  +7
            const x = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 30;
            
            const enemyGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const enemyMat = new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 0.5
            });
            
            const enemy = new THREE.Mesh(enemyGeo, enemyMat);
            enemy.position.set(x, yPosition, z);
            enemy.castShadow = true;
            
            enemy.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.08,
                0,
                (Math.random() - 0.5) * 0.08
            );
            enemy.userData.changeDirectionTimer = Math.random() * 100;
            enemy.userData.isEnemy = true;
            enemy.userData.damage = 1;
            enemy.userData.level = level;
            
            this.mazeGroup.add(enemy);
            this.enemies.push(enemy);
        }
        
        console.log(`ðŸ‘¾ ${count} ennemis crÃ©Ã©s au niveau ${level} (y=${yPosition})`);
        return this.enemies;
    }
    
    clear() {
        this.enemies.forEach(enemy => {
            this.mazeGroup.remove(enemy);
            if (enemy.geometry) enemy.geometry.dispose();
            if (enemy.material) enemy.material.dispose();
        });
        this.enemies = [];
    }
    
    getEnemies() {
        return this.enemies;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnemyManager;
}
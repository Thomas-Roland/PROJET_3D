// enemies.js - Gestion des ennemis

class EnemyManager {
    constructor(scene, mazeGroup) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.enemies = [];
    }
    
    createEnemies(count) {
        this.clear();
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = 2.6;
            const z = (Math.random() - 0.5) * 10;
            
            const enemyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
            const enemyMat = new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 0.3
            });
            
            const enemy = new THREE.Mesh(enemyGeo, enemyMat);
            enemy.position.set(x, y, z);
            enemy.castShadow = true;
            
            // Données de mouvement
            enemy.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                0,
                (Math.random() - 0.5) * 0.05
            );
            enemy.userData.changeDirectionTimer = Math.random() * 100;
            
            this.mazeGroup.add(enemy);
            this.enemies.push(enemy);
        }
        
        return this.enemies;
    }
    
    clear() {
        this.enemies.forEach(enemy => {
            this.mazeGroup.remove(enemy);
        });
        this.enemies = [];
    }
    
    getEnemies() {
        return this.enemies;
    }
}

// Export pour utilisation dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnemyManager;
}
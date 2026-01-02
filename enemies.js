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
            const x = (Math.random() - 0.5) * 14;
            const y = 1.2;
            const z = (Math.random() - 0.5) * 14;
            
            const enemyGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const enemyMat = new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 0.5
            });
            
            const enemy = new THREE.Mesh(enemyGeo, enemyMat);
            enemy.position.set(x, y, z);
            enemy.castShadow = true;
            
            // DONNÉES DE MOUVEMENT
            enemy.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.08,
                0,
                (Math.random() - 0.5) * 0.08
            );
            enemy.userData.changeDirectionTimer = Math.random() * 100;
            enemy.userData.isEnemy = true;
            enemy.userData.damage = 1;
            
            this.mazeGroup.add(enemy);
            this.enemies.push(enemy);
        }
        
        console.log(`👾 ${count} ennemis créés`);
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
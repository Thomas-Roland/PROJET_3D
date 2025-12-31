// crystals.js - Gestion des cristaux

class CrystalManager {
    constructor(scene, mazeGroup) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.crystals = [];
    }
    
    createCrystals(count) {
        this.clear();
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 14; // Zone plus large
            const y = 6.0; // Plus haut (y=5 + 1.0)
            const z = (Math.random() - 0.5) * 14;
            
            const crystalGeo = new THREE.OctahedronGeometry(0.5, 0); // Plus gros
            const crystalMat = new THREE.MeshStandardMaterial({ 
                color: 0x44ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 0.6
            });
            
            const crystal = new THREE.Mesh(crystalGeo, crystalMat);
            crystal.position.set(x, y, z);
            crystal.userData.collected = false;
            
            this.mazeGroup.add(crystal);
            this.crystals.push(crystal);
        }
        
        return this.crystals;
    }
    
    clear() {
        this.crystals.forEach(crystal => {
            this.mazeGroup.remove(crystal);
        });
        this.crystals = [];
    }
    
    getCrystals() {
        return this.crystals;
    }
}

// Export pour utilisation dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrystalManager;
}
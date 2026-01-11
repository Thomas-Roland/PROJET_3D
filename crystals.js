class CrystalManager {
    constructor(scene, mazeGroup) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.crystals = [];
    }
    
    createCrystals(count, level = 1) {
        this.clear();
        
       
       
       
        // Position
        let yPosition;
        if (level === 1) {
            yPosition = 1.0; 
        } else {
            yPosition = -19.0; 
        }
        



        
        //aléatoire
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 30;
            
            const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
            const crystalMat = new THREE.MeshStandardMaterial({ 
                color: 0x44ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 0.6,
                transparent: false
            });
            
            const crystal = new THREE.Mesh(crystalGeo, crystalMat);
            crystal.position.set(x, yPosition, z);
            
            crystal.userData.collected = false;
            crystal.userData.points = 10;
            crystal.visible = true;
            
            this.mazeGroup.add(crystal);
            this.crystals.push(crystal);
        }
        
        console.log(`💎 ${count} cristaux créés au niveau ${level} (y=${yPosition})`);
        return this.crystals;
    }
    
    clear() {
        this.crystals.forEach(crystal => {
            this.mazeGroup.remove(crystal);
            if (crystal.geometry) crystal.geometry.dispose();
            if (crystal.material) crystal.material.dispose();
        });
        this.crystals = [];
    }
    
    getCrystals() {
        return this.crystals;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrystalManager;
}
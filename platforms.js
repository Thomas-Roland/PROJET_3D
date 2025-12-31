// platforms.js - Gestion des plateformes, murs, trous et sortie

class PlatformManager {
    constructor(scene, mazeGroup, difficultySettings) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.difficultySettings = difficultySettings;
        
        this.walls = [];
        this.holes = [];
        this.exit = null;
        this.platform = null;
    }
    
    createPlatform(difficulty) {
        this.clear();
        
        const settings = this.difficultySettings[difficulty];
        
        // Plateforme principale
        const platformGeo = new THREE.BoxGeometry(12, 0.5, 12);
        const platformMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3e });
        this.platform = new THREE.Mesh(platformGeo, platformMat);
        this.platform.position.y = 2;
        this.platform.receiveShadow = true;
        this.mazeGroup.add(this.platform);
        
        // Création des murs
        this.createWalls(settings.wallComplexity);
        
        // Création des trous
        this.createHoles(settings.holeCount);
        
        // Création de la sortie
        this.createExit();
        
        return {
            walls: this.walls,
            holes: this.holes,
            exit: this.exit
        };
    }
    
    createWalls(complexity) {
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x3a3a6e });
        
        const createWall = (x, y, z, width, depth) => {
            const geo = new THREE.BoxGeometry(width, 1, depth);
            const wall = new THREE.Mesh(geo, wallMat);
            wall.position.set(x, y + 2.5, z);
            wall.castShadow = true;
            wall.receiveShadow = true;
            this.mazeGroup.add(wall);
            this.walls.push(wall);
        };
        
        // Murs extérieurs
        createWall(0, 0.25, -6, 12, 0.3);
        createWall(0, 0.25, 6, 12, 0.3);
        createWall(-6, 0.25, 0, 0.3, 12);
        createWall(6, 0.25, 0, 0.3, 12);
        
        // Murs internes selon complexité
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
        } else if (complexity === 'complex') {
            createWall(-3, 0.25, -3, 0.3, 8);
            createWall(3, 0.25, 3, 0.3, 8);
            createWall(-1, 0.25, -2, 6, 0.3);
            createWall(1, 0.25, 2, 6, 0.3);
            createWall(-2, 0.25, 0, 0.3, 6);
            createWall(2, 0.25, 0, 0.3, 6);
        }
    }
    
    createHoles(count) {
        for (let i = 0; i < count; i++) {
            const holeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 16);
            const holeMat = new THREE.MeshStandardMaterial({ 
                color: 0x000000,
                emissive: 0x220000
            });
            const hole = new THREE.Mesh(holeGeo, holeMat);
            hole.position.set(
                (Math.random() - 0.5) * 10,
                2,
                (Math.random() - 0.5) * 10
            );
            this.mazeGroup.add(hole);
            this.holes.push(hole);
        }
    }
    
    createExit() {
        const exitGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
        const exitMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            emissive: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        this.exit = new THREE.Mesh(exitGeo, exitMat);
        this.exit.position.set(4.5, 2.4, 4.5);
        this.mazeGroup.add(this.exit);
    }
    
    clear() {
        while (this.mazeGroup.children.length > 0) {
            this.mazeGroup.remove(this.mazeGroup.children[0]);
        }
        this.walls = [];
        this.holes = [];
        this.exit = null;
        this.platform = null;
    }
}

// Export pour utilisation dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformManager;
}
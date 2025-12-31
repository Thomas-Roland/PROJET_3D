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
        
        // Plateforme principale (AGRANDIE : 18x18 au lieu de 12x12)
        const platformGeo = new THREE.BoxGeometry(18, 0.5, 18);
        const platformMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3e });
        this.platform = new THREE.Mesh(platformGeo, platformMat);
        this.platform.position.y = 5; // RemontÃ©e Ã  y=5
        this.platform.receiveShadow = true;
        this.mazeGroup.add(this.platform);
        
        // CrÃ©ation des murs
        this.createWalls(settings.wallComplexity);
        
        // CrÃ©ation du trou objectif (UN SEUL)
        this.createGoalHole();
        
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
            wall.position.set(x, y + 5.5, z); // AjustÃ© pour y=5
            wall.castShadow = true;
            wall.receiveShadow = true;
            this.mazeGroup.add(wall);
            this.walls.push(wall);
        };
        
        // Murs extÃ©rieurs (AGRANDIS pour plateforme 18x18)
        createWall(0, 0.25, -9, 18, 0.3);    // Mur nord
        createWall(0, 0.25, 9, 18, 0.3);     // Mur sud
        createWall(-9, 0.25, 0, 0.3, 18);    // Mur ouest
        createWall(9, 0.25, 0, 0.3, 18);     // Mur est
        
        // Murs internes selon complexitÃ©
        if (complexity === 'simple') {
            createWall(-4, 0.25, -4, 0.3, 6);
            createWall(4, 0.25, 4, 0.3, 6);
            createWall(0, 0.25, 0, 6, 0.3);
        } else if (complexity === 'medium') {
            createWall(-4, 0.25, -4, 0.3, 8);
            createWall(4, 0.25, 4, 0.3, 8);
            createWall(0, 0.25, -3, 8, 0.3);
            createWall(0, 0.25, 3, 8, 0.3);
            createWall(-3, 0.25, 0, 0.3, 6);
        } else if (complexity === 'complex') {
            createWall(-4, 0.25, -4, 0.3, 10);
            createWall(4, 0.25, 4, 0.3, 10);
            createWall(-2, 0.25, -3, 8, 0.3);
            createWall(2, 0.25, 3, 8, 0.3);
            createWall(-3, 0.25, 0, 0.3, 8);
            createWall(3, 0.25, 0, 0.3, 8);
        }
    }
    
    createGoalHole() {
        // Trou OBJECTIF (lumineux et attirant) - UN SEUL
        const holeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
        const holeMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        
        // Position au coin opposÃ© de la bille (en haut Ã  droite)
        hole.position.set(6.5, 5, 6.5);
        this.mazeGroup.add(hole);
        this.holes.push(hole);
        
        // Ajouter une lumiÃ¨re au trou pour le rendre visible
        const holeLight = new THREE.PointLight(0x00ff00, 2, 8);
        holeLight.position.set(6.5, 5.5, 6.5);
        this.mazeGroup.add(holeLight);
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
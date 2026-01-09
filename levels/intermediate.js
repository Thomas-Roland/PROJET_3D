// levels/intermediate.js - Configuration du niveau intermédiaire

const IntermediateLevel = {
    name: "Intermédiaire",
    difficulty: "intermediate",
    
    // Configuration du labyrinthe plateforme HAUTE - Labyrinthe navigable sur toute la surface
    wallsTop: [
        // Bordures extérieures
        { x: 0, y: 1, z: -16, w: 32, h: 2, d: 1 },  // Haut
        { x: 0, y: 1, z: 16, w: 32, h: 2, d: 1 },   // Bas
        { x: -16, y: 1, z: 0, w: 1, h: 2, d: 32 },  // Gauche
        { x: 16, y: 1, z: 0, w: 1, h: 2, d: 32 },   // Droite
        
        // Murs horizontaux créant les couloirs
        { x: -8, y: 1, z: -12, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: -12, w: 12, h: 2, d: 1 },
        
        { x: -12, y: 1, z: -8, w: 10, h: 2, d: 1 },
        { x: 4, y: 1, z: -8, w: 16, h: 2, d: 1 },
        
        { x: -8, y: 1, z: -4, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: -4, w: 10, h: 2, d: 1 },
        
        { x: 4, y: 1, z: 0, w: 14, h: 2, d: 1 },
        
        { x: -10, y: 1, z: 4, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: 4, w: 12, h: 2, d: 1 },
        
        { x: 6, y: 1, z: 8, w: 14, h: 2, d: 1 },
        
        { x: -10, y: 1, z: 12, w: 14, h: 2, d: 1 },        
        { x: -8, y: 1, z: 12, w: 14, h: 2, d: 1 },

        // Murs verticaux créant les passages

        { x: -8, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: -8, y: 1, z: 4, w: 1, h: 2, d: 6 },
        
        { x: -4, y: 1, z: 6, w: 1, h: 2, d: 8 },
        
        { x: 0, y: 1, z: 2, w: 1, h: 2, d: 8 },
        
        { x: 4, y: 1, z: -14, w: 1, h: 2, d: 6 },
        
        { x: 8, y: 1, z: 4, w: 1, h: 2, d: 6 },
        
        { x: 12, y: 1, z: -14, w: 1, h: 2, d: 8 },
    ],
    
    // Position du trou (sud-est)
    holeTop: { x: 11, y: 0.51, z: 12, radius: 1.5 },
    
    // Configuration du labyrinthe plateforme FINALE - Labyrinthe navigable sur toute la surface
    wallsFinal: [
        // Bordures extérieures
        { x: 0, y: 1, z: -16, w: 32, h: 2, d: 1 },  // Haut
        { x: 0, y: 1, z: 16, w: 32, h: 2, d: 1 },   // Bas
        { x: -16, y: 1, z: 0, w: 1, h: 2, d: 32 },  // Gauche
        { x: 16, y: 1, z: 0, w: 1, h: 2, d: 32 },   // Droite
        
        // Murs intérieurs - disposition en spirale
        { x: -10, y: 1, z: -12, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: -12, w: 10, h: 2, d: 1 },
        
        { x: -12, y: 1, z: -8, w: 8, h: 2, d: 1 },
        { x: 2, y: 1, z: -8, w: 18, h: 2, d: 1 },
        
        { x: -8, y: 1, z: -4, w: 10, h: 2, d: 1 },
        { x: 6, y: 1, z: -4, w: 14, h: 2, d: 1 },
        
        
        { x: -10, y: 1, z: 4, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: 4, w: 14, h: 2, d: 1 },
        
        { x: 2, y: 1, z: 8, w: 18, h: 2, d: 1 },
        
        { x: -8, y: 1, z: 12, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: 12, w: 12, h: 2, d: 1 },
        
        // Murs verticaux
        { x: -12, y: 1, z: -14, w: 1, h: 2, d: 8 },
        { x: -12, y: 1, z: 0, w: 1, h: 2, d: 10 },
        
        { x: -8, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: -8, y: 1, z: 4, w: 1, h: 2, d: 6 },
        
        { x: -4, y: 1, z: 2, w: 1, h: 2, d: 8 },
        
        { x: 0, y: 1, z: -6, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: 6, w: 1, h: 2, d: 8 },
        
        { x: 4, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: 4, y: 1, z: 4, w: 1, h: 2, d: 10 },
        
        { x: 8, y: 1, z: -14, w: 1, h: 2, d: 6 },
        { x: 8, y: 1, z: 6, w: 1, h: 2, d: 8 },
        
        { x: 12, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: 4, w: 1, h: 2, d: 10 }
    ],
    
    // Paramètres de gameplay (PLUS DIFFICILE que débutant)
    settings: {
        timeLimit: 45,        
        enemyCount: 4,        
        crystalCount: 12,      
        enemySpeed: 0.10,      
        ballMaxSpeed: 0.15     
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntermediateLevel;
}
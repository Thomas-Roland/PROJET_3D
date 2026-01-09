// levels/expert.js - Configuration du niveau expert

const ExpertLevel = {
    name: "Expert",
    difficulty: "expert",
    
    // Configuration du labyrinthe plateforme HAUTE
    wallsTop: [
        // Bordures extérieures
        { x: 0, y: 1, z: -16, w: 32, h: 2, d: 1 },
        { x: 0, y: 1, z: 16, w: 32, h: 2, d: 1 },
        { x: -16, y: 1, z: 0, w: 1, h: 2, d: 32 },
        { x: 16, y: 1, z: 0, w: 1, h: 2, d: 32 },
        
        // Murs horizontaux
        { x: -8, y: 1, z: -14, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: -14, w: 12, h: 2, d: 1 },
        { x: -10, y: 1, z: -12, w: 14, h: 2, d: 1 },
        { x: 6, y: 1, z: -12, w: 14, h: 2, d: 1 },
        { x: -12, y: 1, z: -10, w: 10, h: 2, d: 1 },
        { x: 4, y: 1, z: -10, w: 18, h: 2, d: 1 },
        { x: -8, y: 1, z: -8, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: -8, w: 12, h: 2, d: 1 },
        { x: -14, y: 1, z: -6, w: 10, h: 2, d: 1 },
        { x: 2, y: 1, z: -6, w: 18, h: 2, d: 1 },
        { x: -10, y: 1, z: -4, w: 14, h: 2, d: 1 },
        { x: 6, y: 1, z: -4, w: 14, h: 2, d: 1 },
        { x: -12, y: 1, z: -2, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: -2, w: 16, h: 2, d: 1 },
        { x: -8, y: 1, z: 0, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: 0, w: 12, h: 2, d: 1 },
        { x: -14, y: 1, z: 2, w: 10, h: 2, d: 1 },
        { x: 0, y: 1, z: 2, w: 20, h: 2, d: 1 },
        { x: -10, y: 1, z: 4, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: 4, w: 12, h: 2, d: 1 },
        { x: -12, y: 1, z: 6, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: 6, w: 16, h: 2, d: 1 },
        { x: -8, y: 1, z: 8, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 8, w: 10, h: 2, d: 1 },
        { x: -14, y: 1, z: 10, w: 10, h: 2, d: 1 },
        { x: 0, y: 1, z: 10, w: 20, h: 2, d: 1 },
        { x: -10, y: 1, z: 12, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: 12, w: 12, h: 2, d: 1 },
        { x: -6, y: 1, z: 14, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 14, w: 10, h: 2, d: 1 },
        
        // Murs verticaux
        { x: -14, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: -14, y: 1, z: 0, w: 1, h: 2, d: 10 },
        { x: -12, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: -12, y: 1, z: 4, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: -14, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: -2, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: 10, w: 1, h: 2, d: 8 },
        { x: -8, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: -8, y: 1, z: 2, w: 1, h: 2, d: 8 },
        { x: -6, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: -6, y: 1, z: 4, w: 1, h: 2, d: 8 },
        { x: -4, y: 1, z: -14, w: 1, h: 2, d: 8 },
        { x: -4, y: 1, z: -2, w: 1, h: 2, d: 8 },
        { x: -4, y: 1, z: 10, w: 1, h: 2, d: 8 },
        { x: -2, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: -2, y: 1, z: 2, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: 4, w: 1, h: 2, d: 8 },
        { x: 2, y: 1, z: -14, w: 1, h: 2, d: 8 },
        { x: 2, y: 1, z: -2, w: 1, h: 2, d: 8 },
        { x: 2, y: 1, z: 10, w: 1, h: 2, d: 8 },
        { x: 4, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: 4, y: 1, z: 2, w: 1, h: 2, d: 8 },
        { x: 6, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: 6, y: 1, z: 4, w: 1, h: 2, d: 8 },
        { x: 8, y: 1, z: -14, w: 1, h: 2, d: 8 },
        { x: 8, y: 1, z: -2, w: 1, h: 2, d: 8 },
        { x: 8, y: 1, z: 10, w: 1, h: 2, d: 8 },
        { x: 10, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: 10, y: 1, z: 2, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: -10, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: 4, w: 1, h: 2, d: 8 },
        { x: 14, y: 1, z: -14, w: 1, h: 2, d: 8 },
        { x: 14, y: 1, z: 0, w: 1, h: 2, d: 10 }
    ],
    
    // Position du trou
    holeTop: { x: 13, y: 0.51, z: 13, radius: 1.5 },
    
    // Configuration du labyrinthe plateforme FINALE
    wallsFinal: [
        // Bordures extérieures
        { x: 0, y: 1, z: -16, w: 32, h: 2, d: 1 },
        { x: 0, y: 1, z: 16, w: 32, h: 2, d: 1 },
        { x: -16, y: 1, z: 0, w: 1, h: 2, d: 32 },
        { x: 16, y: 1, z: 0, w: 1, h: 2, d: 32 },
        
        // Labyrinthe en spirale
        { x: -10, y: 1, z: -14, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: -14, w: 12, h: 2, d: 1 },
        { x: -12, y: 1, z: -12, w: 10, h: 2, d: 1 },
        { x: 4, y: 1, z: -12, w: 18, h: 2, d: 1 },
        { x: -8, y: 1, z: -10, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: -10, w: 10, h: 2, d: 1 },
        { x: -14, y: 1, z: -8, w: 10, h: 2, d: 1 },
        { x: 2, y: 1, z: -8, w: 18, h: 2, d: 1 },
        { x: -10, y: 1, z: -6, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: -6, w: 12, h: 2, d: 1 },
        { x: -12, y: 1, z: -4, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: -4, w: 16, h: 2, d: 1 },
        { x: -8, y: 1, z: -2, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: -2, w: 10, h: 2, d: 1 },
        { x: -14, y: 1, z: 0, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: 0, w: 14, h: 2, d: 1 },
        { x: -10, y: 1, z: 2, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: 2, w: 12, h: 2, d: 1 },
        { x: -12, y: 1, z: 4, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: 4, w: 16, h: 2, d: 1 },
        { x: -8, y: 1, z: 6, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 6, w: 10, h: 2, d: 1 },
        { x: -14, y: 1, z: 8, w: 10, h: 2, d: 1 },
        { x: 2, y: 1, z: 8, w: 18, h: 2, d: 1 },
        { x: -10, y: 1, z: 10, w: 14, h: 2, d: 1 },
        { x: 8, y: 1, z: 10, w: 12, h: 2, d: 1 },
        { x: -12, y: 1, z: 12, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: 12, w: 16, h: 2, d: 1 },
        { x: -6, y: 1, z: 14, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 14, w: 10, h: 2, d: 1 },
        
        // Murs verticaux
        { x: -14, y: 1, z: -13, w: 1, h: 2, d: 8 },
        { x: -14, y: 1, z: 1, w: 1, h: 2, d: 10 },
        { x: -12, y: 1, z: -11, w: 1, h: 2, d: 8 },
        { x: -12, y: 1, z: 5, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: -3, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: 9, w: 1, h: 2, d: 8 },
        { x: -8, y: 1, z: -13, w: 1, h: 2, d: 8 },
        { x: -8, y: 1, z: 1, w: 1, h: 2, d: 8 },
        { x: -6, y: 1, z: -11, w: 1, h: 2, d: 8 },
        { x: -6, y: 1, z: 3, w: 1, h: 2, d: 8 },
        { x: -4, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: -4, y: 1, z: -3, w: 1, h: 2, d: 8 },
        { x: -4, y: 1, z: 9, w: 1, h: 2, d: 8 },
        { x: -2, y: 1, z: -13, w: 1, h: 2, d: 8 },
        { x: -2, y: 1, z: 1, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: -11, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: 3, w: 1, h: 2, d: 8 },
        { x: 2, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: 2, y: 1, z: -3, w: 1, h: 2, d: 8 },
        { x: 2, y: 1, z: 9, w: 1, h: 2, d: 8 },
        { x: 4, y: 1, z: -13, w: 1, h: 2, d: 8 },
        { x: 4, y: 1, z: 1, w: 1, h: 2, d: 8 },
        { x: 6, y: 1, z: -11, w: 1, h: 2, d: 8 },
        { x: 6, y: 1, z: 3, w: 1, h: 2, d: 8 },
        { x: 8, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: 8, y: 1, z: -3, w: 1, h: 2, d: 8 },
        { x: 8, y: 1, z: 9, w: 1, h: 2, d: 8 },
        { x: 10, y: 1, z: -13, w: 1, h: 2, d: 8 },
        { x: 10, y: 1, z: 1, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: -11, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: 3, w: 1, h: 2, d: 8 },
        { x: 14, y: 1, z: -13, w: 1, h: 2, d: 8 },
        { x: 14, y: 1, z: 1, w: 1, h: 2, d: 8 }
    ],
    
    // Paramètres de gameplay
    settings: {
        timeLimit: 130,
        enemyCount: 5,
        crystalCount: 15,
        enemySpeed: 0.12,
        ballMaxSpeed: 0.25
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpertLevel;
}

// Test de chargement
console.log('✅ ExpertLevel chargé:', ExpertLevel.name);
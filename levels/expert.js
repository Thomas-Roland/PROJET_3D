// levels/expert.js - Configuration du niveau expert

const ExpertLevel = {
    name: "Expert",
    difficulty: "expert",
    
    // Configuration du labyrinthe plateforme HAUTE - Version simplifiée et jouable
    wallsTop: [
        // Murs horizontaux - créant des couloirs larges
        { x: -6, y: 1, z: -12, w: 16, h: 2, d: 1 },
        { x: 10, y: 1, z: -12, w: 8, h: 2, d: 1 },
        
        { x: -10, y: 1, z: -6, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: -6, w: 16, h: 2, d: 1 },
        
        { x: -8, y: 1, z: 0, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: 0, w: 12, h: 2, d: 1 },
        
        { x: -12, y: 1, z: 6, w: 10, h: 2, d: 1 },
        { x: 4, y: 1, z: 6, w: 18, h: 2, d: 1 },
        
        { x: -6, y: 1, z: 12, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 12, w: 10, h: 2, d: 1 },
        
        // Murs verticaux - créant les passages
        { x: -12, y: 1, z: -9, w: 1, h: 2, d: 10 },
        { x: -12, y: 1, z: 9, w: 1, h: 2, d: 8 },
        
        { x: -6, y: 1, z: -15, w: 1, h: 2, d: 6 },
        { x: -6, y: 1, z: -3, w: 1, h: 2, d: 10 },
        
        { x: 0, y: 1, z: -9, w: 1, h: 2, d: 10 },
        { x: 0, y: 1, z: 9, w: 1, h: 2, d: 8 },
        
        { x: 6, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: 6, y: 1, z: 3, w: 1, h: 2, d: 10 },
        
        { x: 12, y: 1, z: -15, w: 1, h: 2, d: 10 },
        { x: 12, y: 1, z: 3, w: 1, h: 2, d: 12 }
    ],
    
    // Position du trou
    holeTop: { x: 13, y: 0.51, z: 13, radius: 1.5 },
    
    // Configuration du labyrinthe plateforme FINALE - Version simplifiée et jouable
    wallsFinal: [
        // Labyrinthe simplifié avec passages larges
        { x: -8, y: 1, z: -12, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: -12, w: 10, h: 2, d: 1 },
        
        { x: -12, y: 1, z: -6, w: 10, h: 2, d: 1 },
        { x: 4, y: 1, z: -6, w: 18, h: 2, d: 1 },
        
        { x: -6, y: 1, z: 0, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 0, w: 10, h: 2, d: 1 },
        
        { x: -10, y: 1, z: 6, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: 6, w: 16, h: 2, d: 1 },
        
        { x: -8, y: 1, z: 12, w: 14, h: 2, d: 1 },
        { x: 10, y: 1, z: 12, w: 10, h: 2, d: 1 },
        
        // Murs verticaux
        { x: -12, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: -12, y: 1, z: 3, w: 1, h: 2, d: 10 },
        
        { x: -6, y: 1, z: -9, w: 1, h: 2, d: 10 },
        { x: -6, y: 1, z: 9, w: 1, h: 2, d: 8 },
        
        { x: 0, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: 3, w: 1, h: 2, d: 10 },
        
        { x: 6, y: 1, z: -9, w: 1, h: 2, d: 10 },
        { x: 6, y: 1, z: 9, w: 1, h: 2, d: 8 },
        
        { x: 12, y: 1, z: -15, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: 3, w: 1, h: 2, d: 10 }
    ],
    
    // Paramètres de gameplay - Vraiment EXPERT
    settings: {
        timeLimit: 30,
        enemyCount: 5,
        crystalCount: 15,
        enemySpeed: 0.12,
        ballMaxSpeed: 0.20
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpertLevel;
}

// Test de chargement
console.log('✅ ExpertLevel chargé:', ExpertLevel.name);
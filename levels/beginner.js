// levels/beginner.js - Configuration du niveau débutant

const BeginnerLevel = {
    name: "Débutant",
    difficulty: "beginner",
    
    // Configuration du labyrinthe plateforme HAUTE
    wallsTop: [
        // Murs verticaux gauche
        { x: -12, y: 1, z: -8, w: 1, h: 2, d: 12 },
        { x: -12, y: 1, z: 8, w: 1, h: 2, d: 8 },
        
        // Murs verticaux centre-gauche
        { x: -6, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: -6, y: 1, z: 4, w: 1, h: 2, d: 16 },
        
        // Murs verticaux centre
        { x: 0, y: 1, z: -8, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: 8, w: 1, h: 2, d: 12 },
        
        // Murs verticaux centre-droite
        { x: 6, y: 1, z: -12, w: 1, h: 2, d: 12 },
        { x: 6, y: 1, z: 8, w: 1, h: 2, d: 8 },
        
        // Murs verticaux droite
        { x: 12, y: 1, z: -4, w: 1, h: 2, d: 16 },
        { x: 12, y: 1, z: 12, w: 1, h: 2, d: 8 },
        
        // Murs horizontaux haut
        { x: -8, y: 1, z: -12, w: 8, h: 2, d: 1 },
        { x: 4, y: 1, z: -12, w: 12, h: 2, d: 1 },
        
        // Murs horizontaux centre-haut
        { x: -12, y: 1, z: -6, w: 8, h: 2, d: 1 },
        { x: 8, y: 1, z: -6, w: 16, h: 2, d: 1 },
        
        // Murs horizontaux centre
        { x: -8, y: 1, z: 0, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: 0, w: 8, h: 2, d: 1 },
        
        // Murs horizontaux centre-bas
        { x: -12, y: 1, z: 6, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: 6, w: 8, h: 2, d: 1 },
        
        // Murs horizontaux bas
        { x: -8, y: 1, z: 12, w: 16, h: 2, d: 1 },
        { x: 12, y: 1, z: 12, w: 8, h: 2, d: 1 }
    ],
    
    // Position du trou
    holeTop: { x: 10, y: 0.51, z: 10, radius: 1.5 },
    
    // Configuration du labyrinthe plateforme FINALE
    wallsFinal: [
        // Zone supérieure
        { x: -8, y: 1, z: -10, w: 8, h: 2, d: 1 },
        { x: 8, y: 1, z: -10, w: 8, h: 2, d: 1 },
        
        // Zone gauche
        { x: -10, y: 1, z: -5, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: 5, w: 1, h: 2, d: 8 },
        
        // Zone droite
        { x: 10, y: 1, z: -5, w: 1, h: 2, d: 8 },
        { x: 10, y: 1, z: 5, w: 1, h: 2, d: 8 },
        
        // Zone inférieure
        { x: -8, y: 1, z: 10, w: 8, h: 2, d: 1 },
        { x: 8, y: 1, z: 10, w: 8, h: 2, d: 1 },
        
        // Obstacles intermédiaires
        { x: -6, y: 1, z: -6, w: 1, h: 2, d: 6 },
        { x: 6, y: 1, z: -6, w: 1, h: 2, d: 6 },
        { x: -6, y: 1, z: 6, w: 6, h: 2, d: 1 },
        { x: 6, y: 1, z: 6, w: 6, h: 2, d: 1 }
    ],
    
    // Paramètres de gameplay
    settings: {
        timeLimit: 60,        
        enemyCount: 0,
        crystalCount: 8,
        enemySpeed: 0.08,
        ballMaxSpeed: 0.06
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BeginnerLevel;
}
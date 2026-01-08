// levels/intermediate.js - Configuration du niveau intermédiaire

const IntermediateLevel = {
    name: "Intermédiaire",
    difficulty: "intermediate",
    
    // Configuration du labyrinthe plateforme HAUTE (LABYRINTHE OPTIMAL - dans les limites)
    wallsTop: [
        // ===== COLONNES VERTICALES =====
        { x: -12, y: 1, z: -10, w: 1, h: 2, d: 12 },
        { x: -12, y: 1, z: 6, w: 1, h: 2, d: 10 },
        
        { x: -8, y: 1, z: -12, w: 1, h: 2, d: 10 },
        { x: -8, y: 1, z: 2, w: 1, h: 2, d: 12 },
        
        { x: -4, y: 1, z: -8, w: 1, h: 2, d: 12 },
        { x: -4, y: 1, z: 8, w: 1, h: 2, d: 10 },
        
        { x: 0, y: 1, z: -12, w: 1, h: 2, d: 10 },
        { x: 0, y: 1, z: 2, w: 1, h: 2, d: 12 },
        
        { x: 4, y: 1, z: -10, w: 1, h: 2, d: 14 },
        { x: 4, y: 1, z: 8, w: 1, h: 2, d: 10 },
        
        { x: 8, y: 1, z: -12, w: 1, h: 2, d: 12 },
        { x: 8, y: 1, z: 4, w: 1, h: 2, d: 12 },
        
        { x: 12, y: 1, z: -8, w: 1, h: 2, d: 12 },
        { x: 12, y: 1, z: 8, w: 1, h: 2, d: 10 },
        
        // ===== LIGNES HORIZONTALES =====
        { x: -10, y: 1, z: -12, w: 10, h: 2, d: 1 },
        { x: 4, y: 1, z: -12, w: 10, h: 2, d: 1 },
        
        { x: -12, y: 1, z: -8, w: 10, h: 2, d: 1 },
        { x: 2, y: 1, z: -8, w: 12, h: 2, d: 1 },
        
        { x: -10, y: 1, z: -4, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: -4, w: 10, h: 2, d: 1 },
        
        { x: -12, y: 1, z: 0, w: 10, h: 2, d: 1 },
        { x: 2, y: 1, z: 0, w: 12, h: 2, d: 1 },
        
        { x: -10, y: 1, z: 4, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: 4, w: 10, h: 2, d: 1 },
        
        { x: -12, y: 1, z: 8, w: 10, h: 2, d: 1 },
        { x: 2, y: 1, z: 8, w: 12, h: 2, d: 1 },
        
        { x: -10, y: 1, z: 12, w: 12, h: 2, d: 1 },
        { x: 6, y: 1, z: 12, w: 10, h: 2, d: 1 }
    ],
    
    // Position du trou (accessible via le labyrinthe)
    holeTop: { x: -8, y: 0.51, z: 12, radius: 1.5 },
    
    // Configuration du labyrinthe plateforme FINALE (OPTIMAL - dans les limites)
    wallsFinal: [
        // ===== COLONNES VERTICALES =====
        { x: -11, y: 1, z: -10, w: 1, h: 2, d: 12 },
        { x: -11, y: 1, z: 6, w: 1, h: 2, d: 10 },
        
        { x: -7, y: 1, z: -12, w: 1, h: 2, d: 10 },
        { x: -7, y: 1, z: 2, w: 1, h: 2, d: 12 },
        
        { x: -3, y: 1, z: -8, w: 1, h: 2, d: 12 },
        { x: -3, y: 1, z: 8, w: 1, h: 2, d: 10 },
        
        { x: 1, y: 1, z: -12, w: 1, h: 2, d: 10 },
        { x: 1, y: 1, z: 2, w: 1, h: 2, d: 12 },
        
        { x: 5, y: 1, z: -10, w: 1, h: 2, d: 14 },
        { x: 5, y: 1, z: 8, w: 1, h: 2, d: 10 },
        
        { x: 9, y: 1, z: -12, w: 1, h: 2, d: 12 },
        { x: 9, y: 1, z: 4, w: 1, h: 2, d: 12 },
        
        { x: 13, y: 1, z: -8, w: 1, h: 2, d: 12 },
        { x: 13, y: 1, z: 8, w: 1, h: 2, d: 10 },
        
        // ===== LIGNES HORIZONTALES =====
        { x: -9, y: 1, z: -12, w: 10, h: 2, d: 1 },
        { x: 5, y: 1, z: -12, w: 10, h: 2, d: 1 },
        
        { x: -11, y: 1, z: -8, w: 10, h: 2, d: 1 },
        { x: 3, y: 1, z: -8, w: 12, h: 2, d: 1 },
        
        { x: -9, y: 1, z: -4, w: 12, h: 2, d: 1 },
        { x: 7, y: 1, z: -4, w: 10, h: 2, d: 1 },
        
        { x: -11, y: 1, z: 0, w: 10, h: 2, d: 1 },
        { x: 3, y: 1, z: 0, w: 12, h: 2, d: 1 },
        
        { x: -9, y: 1, z: 4, w: 12, h: 2, d: 1 },
        { x: 7, y: 1, z: 4, w: 10, h: 2, d: 1 },
        
        { x: -11, y: 1, z: 8, w: 10, h: 2, d: 1 },
        { x: 3, y: 1, z: 8, w: 12, h: 2, d: 1 },
        
        { x: -9, y: 1, z: 12, w: 12, h: 2, d: 1 },
        { x: 7, y: 1, z: 12, w: 10, h: 2, d: 1 }
    ],
    
    // Paramètres de gameplay (PLUS DIFFICILE que débutant)
    settings: {
        timeLimit: 120,        // 2 minutes (vs 3 pour débutant)
        enemyCount: 10,        // 10 ennemis (vs 6)
        crystalCount: 12,      // 12 cristaux (vs 8)
        enemySpeed: 0.10,      // Ennemis plus rapides
        ballMaxSpeed: 0.22     // Bille légèrement plus rapide
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntermediateLevel;
}
const ExpertLevel = {
    name: "Expert",
    difficulty: "expert",
    



    // Murs
    wallsTop: [
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
    




    // Trou
    holeTop: { x: 13, y: 0.51, z: 13, radius: 1.5 },
    





    // Mur 2
    wallsFinal: [
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
    
    

    // Personnalisation
    settings: {
        timeLimit: 30,
        enemyCount: 5,
        crystalCount: 15,
        enemySpeed: 0.12,
        ballMaxSpeed: 0.25
    }
};





// Verif chargement
console.log('✅ ExpertLevel chargé:', ExpertLevel.name);
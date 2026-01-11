const BeginnerLevel = {
    name: "Débutant",
    difficulty: "beginner",
    


    
    // les murs
    wallsTop: [
        { x: -12, y: 1, z: -8, w: 1, h: 2, d: 12 },
        { x: -12, y: 1, z: 8, w: 1, h: 2, d: 8 },     
        { x: -6, y: 1, z: -12, w: 1, h: 2, d: 8 },
        { x: -6, y: 1, z: 4, w: 1, h: 2, d: 16 },        
        { x: 0, y: 1, z: -8, w: 1, h: 2, d: 8 },
        { x: 0, y: 1, z: 8, w: 1, h: 2, d: 12 },
        { x: 6, y: 1, z: -12, w: 1, h: 2, d: 12 },
        { x: 6, y: 1, z: 8, w: 1, h: 2, d: 8 },
        { x: 12, y: 1, z: -4, w: 1, h: 2, d: 16 },
        { x: 12, y: 1, z: 12, w: 1, h: 2, d: 8 }, 
        { x: -8, y: 1, z: -12, w: 8, h: 2, d: 1 },
        { x: 4, y: 1, z: -12, w: 12, h: 2, d: 1 },
        { x: -12, y: 1, z: -6, w: 8, h: 2, d: 1 },
        { x: 8, y: 1, z: -6, w: 16, h: 2, d: 1 },
        { x: -8, y: 1, z: 0, w: 12, h: 2, d: 1 },
        { x: 8, y: 1, z: 0, w: 8, h: 2, d: 1 },
        { x: -12, y: 1, z: 6, w: 12, h: 2, d: 1 },
        { x: 4, y: 1, z: 6, w: 8, h: 2, d: 1 },      
        { x: -8, y: 1, z: 12, w: 16, h: 2, d: 1 },
        { x: 12, y: 1, z: 12, w: 8, h: 2, d: 1 }
    ],
    




    // Trou
    holeTop: { x: 10, y: 0.51, z: 10, radius: 1.5 },
   
    



    // Mur 2
    wallsFinal: [
        { x: -8, y: 1, z: -10, w: 8, h: 2, d: 1 },
        { x: 8, y: 1, z: -10, w: 8, h: 2, d: 1 },       
        { x: -10, y: 1, z: -5, w: 1, h: 2, d: 8 },
        { x: -10, y: 1, z: 5, w: 1, h: 2, d: 8 },       
        { x: 10, y: 1, z: -5, w: 1, h: 2, d: 8 },
        { x: 10, y: 1, z: 5, w: 1, h: 2, d: 8 },       
        { x: -8, y: 1, z: 10, w: 8, h: 2, d: 1 },
        { x: 8, y: 1, z: 10, w: 8, h: 2, d: 1 },
        { x: -6, y: 1, z: -6, w: 1, h: 2, d: 6 },
        { x: 6, y: 1, z: -6, w: 1, h: 2, d: 6 },
        { x: -6, y: 1, z: 6, w: 6, h: 2, d: 1 },
        { x: 6, y: 1, z: 6, w: 6, h: 2, d: 1 }
    ],
 
    


    // Personnalisation
    settings: {
        timeLimit: 60,        
        enemyCount: 3,
        crystalCount: 8,
        enemySpeed: 0.08,
        ballMaxSpeed: 0.20
    }
};
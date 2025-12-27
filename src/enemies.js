// Gestion des ennemis pour le jeu

class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        // Autres propriétés selon le type d'ennemi
    }

    update() {
        // Logique de déplacement ou d'attaque
    }

    render(ctx) {
        // Affichage de l'ennemi sur le canvas
    }
}

export { Enemy };

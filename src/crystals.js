// Gestion des cristaux pour le jeu

class Crystal {
    constructor(x, y, value = 1) {
        this.x = x;
        this.y = y;
        this.value = value;
        // Autres propriétés si besoin
    }

    collect(player) {
        // Logique de collecte du cristal par le joueur
        player.score += this.value;
    }

    render(ctx) {
        // Affichage du cristal sur le canvas
    }
}

export { Crystal };

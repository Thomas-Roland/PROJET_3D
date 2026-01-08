// levelLoader.js - Gestionnaire de niveaux

class LevelLoader {
    constructor() {
        this.levels = {
            beginner: BeginnerLevel,
            intermediate: IntermediateLevel,
            // expert: ExpertLevel                // À ajouter plus tard
        };
    }
    
    /**
     * Récupère la configuration d'un niveau selon la difficulté
     * @param {string} difficulty - 'beginner', 'intermediate', ou 'expert'
     * @returns {Object} Configuration du niveau
     */
    getLevel(difficulty) {
        if (!this.levels[difficulty]) {
            console.error(`❌ Niveau "${difficulty}" introuvable !`);
            return null;
        }
        
        console.log(`📦 Chargement du niveau: ${this.levels[difficulty].name}`);
        return this.levels[difficulty];
    }
    
    /**
     * Vérifie si un niveau existe
     * @param {string} difficulty 
     * @returns {boolean}
     */
    hasLevel(difficulty) {
        return !!this.levels[difficulty];
    }
    
    /**
     * Retourne la liste de toutes les difficultés disponibles
     * @returns {Array<string>}
     */
    getLevelsList() {
        return Object.keys(this.levels);
    }
    
    /**
     * Retourne le nom du niveau suivant
     * @param {string} currentDifficulty 
     * @returns {string|null}
     */
    getNextDifficulty(currentDifficulty) {
        const order = ['beginner', 'intermediate', 'expert'];
        const currentIndex = order.indexOf(currentDifficulty);
        
        if (currentIndex === -1 || currentIndex === order.length - 1) {
            return null; // Pas de niveau suivant
        }
        
        const nextDiff = order[currentIndex + 1];
        return this.hasLevel(nextDiff) ? nextDiff : null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelLoader;
}
// Permet de lancer le jeu en mode développement avec Vite
import '/src/style.css';
import { Enemy } from '/src/enemies.js';
import { Crystal } from '/src/crystals.js';
import * as THREE from 'three';

// Redirige tout vers main.js classique (pour compatibilité Vite)
import '/main.js';

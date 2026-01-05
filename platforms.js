// platforms.js - Plateformes indÃ©pendantes avec labyrinthe distinct par niveau

class PlatformManager {
    constructor(scene, mazeGroup, difficultySettings) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.difficultySettings = difficultySettings;

        this.platforms = [];
        this.walls = [];
        this.holes = [];
        this.exit = null;
    }

    // ===== CREATION COMPLETE =====
    createPlatform(difficulty) {
        this.clear();

        const settings = this.difficultySettings[difficulty];

        // Plateforme haute
        const topPlatform = this.createUpperPlatform(0, true, "top");
        this.createWalls(settings.wallComplexity, topPlatform, "top");

        // Plateforme finale (pas de trou, avec sortie)
        const finalPlatform = this.createUpperPlatform(-20, false, "middle");
        this.createWalls(settings.wallComplexity, finalPlatform, "middle");
        
        // Ajouter la zone de sortie
        this.addExitZone(finalPlatform);

        return {
            platforms: this.platforms,
            walls: this.walls,
            holes: this.holes,
            exit: this.exit
        };
    }

    // ===== PLATEFORME STANDARD (DOUBLÃ‰E) =====
    createUpperPlatform(yPosition, withHole, type) {
        const platformGroup = new THREE.Group();
        platformGroup.position.y = yPosition;

        const geo = new THREE.BoxGeometry(36, 1, 36);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x333366,
            roughness: 0.7
        });

        const platform = new THREE.Mesh(geo, mat);
        platform.receiveShadow = true;
        platform.userData.isSolid = true;
        platformGroup.add(platform);

        // Bordures
        this.addUpperPlatformBorders(platformGroup);

        // Trou
        if (withHole) {
            const holePosition = type === "middle"
                ? new THREE.Vector3(0, 0.51, 0)
                : new THREE.Vector3(10, 0.51, 10);

            const holeGeo = new THREE.CircleGeometry(1.5, 32);
            const holeMat = new THREE.MeshStandardMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });

            const hole = new THREE.Mesh(holeGeo, holeMat);
            hole.rotation.x = -Math.PI / 2;
            hole.position.copy(holePosition);
            hole.userData.isFallThrough = true;

            platformGroup.add(hole);
            this.holes.push(hole);

            // Indicateur visuel
            const ringGeo = new THREE.RingGeometry(1.5, 2, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.copy(holePosition);
            platformGroup.add(ring);

            const light = new THREE.PointLight(0xffaa00, 1, 8);
            light.position.set(
                holePosition.x,
                2,
                holePosition.z
            );
            platformGroup.add(light);

            const markerGeo = new THREE.SphereGeometry(1.0, 16, 16);
            const markerMat = new THREE.MeshBasicMaterial({
                color: 0xff00ff,
                transparent: true,
                opacity: 0.9
            });
            const marker = new THREE.Mesh(markerGeo, markerMat);
            marker.position.set(holePosition.x, holePosition.y + 3, holePosition.z);
            platformGroup.add(marker);

            console.log(`ðŸŽ¯ Trou ${type} crÃ©Ã© - Position locale: (${holePosition.x}, ${holePosition.y}, ${holePosition.z})`);
        }

        this.mazeGroup.add(platformGroup);
        this.platforms.push(platformGroup);

        return platformGroup;
    }

    // ===== ZONE DE SORTIE =====
    addExitZone(platformGroup) {
        const exitGeo = new THREE.CylinderGeometry(3, 3, 0.3, 32);
        const exitMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1
        });

        this.exit = new THREE.Mesh(exitGeo, exitMat);
        this.exit.position.set(0, 0.6, 0);
        platformGroup.add(this.exit);

        const exitLight = new THREE.PointLight(0x00ff00, 2, 15);
        exitLight.position.set(0, 3, 0);
        platformGroup.add(exitLight);
    }

    // ===== BORDURES (DOUBLÃ‰ES) =====
    addUpperPlatformBorders(group) {
        const mat = new THREE.MeshStandardMaterial({ color: 0x555577 });
        const h = 2;
        const t = 0.5;
        const half = 18;

        this.addWallToGroup(group, 0, 1, -half - t / 2, 36, h, t, mat);
        this.addWallToGroup(group, 0, 1, half + t / 2, 36, h, t, mat);
        this.addWallToGroup(group, -half - t / 2, 1, 0, t, h, 36, mat);
        this.addWallToGroup(group, half + t / 2, 1, 0, t, h, 36, mat);
    }

    // ===== LABYRINTHE COMPLET =====
    createWalls(complexity, platformGroup, type) {
        const mat = new THREE.MeshStandardMaterial({
            color: 0x444466,
            roughness: 0.8
        });

        // ðŸ”´ PLATEFORME HAUTE - Labyrinthe complexe
        if (type === "top") {
            // Murs verticaux gauche
            this.addWallToGroup(platformGroup, -12, 1, -8, 1, 2, 12, mat);
            this.addWallToGroup(platformGroup, -12, 1, 8, 1, 2, 8, mat);
            
            // Murs verticaux centre-gauche
            this.addWallToGroup(platformGroup, -6, 1, -12, 1, 2, 8, mat);
            this.addWallToGroup(platformGroup, -6, 1, 4, 1, 2, 16, mat);
            
            // Murs verticaux centre
            this.addWallToGroup(platformGroup, 0, 1, -8, 1, 2, 8, mat);
            this.addWallToGroup(platformGroup, 0, 1, 8, 1, 2, 12, mat);
            
            // Murs verticaux centre-droite
            this.addWallToGroup(platformGroup, 6, 1, -12, 1, 2, 12, mat);
            this.addWallToGroup(platformGroup, 6, 1, 8, 1, 2, 8, mat);
            
            // Murs verticaux droite
            this.addWallToGroup(platformGroup, 12, 1, -4, 1, 2, 16, mat);
            this.addWallToGroup(platformGroup, 12, 1, 12, 1, 2, 8, mat);
            
            // Murs horizontaux haut
            this.addWallToGroup(platformGroup, -8, 1, -12, 8, 2, 1, mat);
            this.addWallToGroup(platformGroup, 4, 1, -12, 12, 2, 1, mat);
            
            // Murs horizontaux centre-haut
            this.addWallToGroup(platformGroup, -12, 1, -6, 8, 2, 1, mat);
            this.addWallToGroup(platformGroup, 8, 1, -6, 16, 2, 1, mat);
            
            // Murs horizontaux centre
            this.addWallToGroup(platformGroup, -8, 1, 0, 12, 2, 1, mat);
            this.addWallToGroup(platformGroup, 8, 1, 0, 8, 2, 1, mat);
            
            // Murs horizontaux centre-bas
            this.addWallToGroup(platformGroup, -12, 1, 6, 12, 2, 1, mat);
            this.addWallToGroup(platformGroup, 4, 1, 6, 8, 2, 1, mat);
            
            // Murs horizontaux bas
            this.addWallToGroup(platformGroup, -8, 1, 12, 16, 2, 1, mat);
            this.addWallToGroup(platformGroup, 12, 1, 12, 8, 2, 1, mat);
        }

        // ðŸ”µ PLATEFORME FINALE - Labyrinthe guidant vers le centre vert
        if (type === "middle") {
            // Couloir extÃ©rieur - forme un cadre
            this.addWallToGroup(platformGroup, -12, 1, 0, 1, 2, 16, mat);
            this.addWallToGroup(platformGroup, 12, 1, 0, 1, 2, 16, mat);
            this.addWallToGroup(platformGroup, 0, 1, -12, 16, 2, 1, mat);
            this.addWallToGroup(platformGroup, 0, 1, 12, 16, 2, 1, mat);
            
            // Obstacles pour crÃ©er des passages
            this.addWallToGroup(platformGroup, -8, 1, -8, 1, 2, 8, mat);
            this.addWallToGroup(platformGroup, -8, 1, 8, 8, 2, 1, mat);
            
            this.addWallToGroup(platformGroup, 8, 1, -8, 8, 2, 1, mat);
            this.addWallToGroup(platformGroup, 8, 1, 4, 1, 2, 8, mat);
            
            // Murs intermÃ©diaires pour crÃ©er le labyrinthe
            this.addWallToGroup(platformGroup, -4, 1, -4, 1, 2, 8, mat);
            this.addWallToGroup(platformGroup, -4, 1, 8, 8, 2, 1, mat);
            
            this.addWallToGroup(platformGroup, 4, 1, -8, 8, 2, 1, mat);
            this.addWallToGroup(platformGroup, 4, 1, 0, 1, 2, 8, mat);
            
            // DerniÃ¨re barriÃ¨re avant le centre (laisse passage vers zone verte)
            this.addWallToGroup(platformGroup, 0, 1, -4, 8, 2, 1, mat);
            this.addWallToGroup(platformGroup, 0, 1, 4, 6, 2, 1, mat);
            
            // Murs qui guident vers le centre vert
            this.addWallToGroup(platformGroup, -2, 1, 0, 1, 2, 4, mat);
            this.addWallToGroup(platformGroup, 2, 1, 0, 1, 2, 4, mat);
        }
    }

    // ===== WALL HELPER =====
    addWallToGroup(group, x, y, z, w, h, d, mat) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(x, y, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        wall.userData.isSolid = true;

        group.add(wall);
        this.walls.push(wall);
    }

    // ===== CLEAR =====
    clear() {
        while (this.mazeGroup.children.length > 0) {
            this.mazeGroup.remove(this.mazeGroup.children[0]);
        }

        this.platforms = [];
        this.walls = [];
        this.holes = [];
        this.exit = null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformManager;
}
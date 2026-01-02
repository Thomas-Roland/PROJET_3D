// platforms.js - Plateformes indépendantes avec labyrinthe distinct par niveau

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

        // Plateforme haute descendue à y=0 (au lieu de y=5)
        const topPlatform = this.createUpperPlatform(0, true, "top");
        this.createWalls(settings.wallComplexity, topPlatform, "top");

        // Plateforme milieu descendue à y=-9 (au lieu de y=-4)
        const middlePlatform = this.createUpperPlatform(-9, true, "middle");
        this.createWalls(settings.wallComplexity, middlePlatform, "middle");

        // Plateforme finale descendue à y=-17 (au lieu de y=-12)
        const bottomPlatform = this.createLowerPlatform();

        return {
            platforms: this.platforms,
            walls: this.walls,
            holes: this.holes,
            exit: this.exit
        };
    }

    // ===== PLATEFORME STANDARD =====
    createUpperPlatform(yPosition, withHole, type) {
        const platformGroup = new THREE.Group();
        platformGroup.position.y = yPosition;

        const geo = new THREE.BoxGeometry(18, 1, 18);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x333366,
            roughness: 0.7
        });

        const platform = new THREE.Mesh(geo, mat);
        platform.receiveShadow = true;
        platform.userData.isSolid = true; // 🔷 SOLIDE
        platformGroup.add(platform);

        // Bordures
        this.addUpperPlatformBorders(platformGroup);

        // Trou
        if (withHole) {
            const holePosition =
                type === "middle"
                    ? new THREE.Vector3(-6, 0.51, -6) // 🔵 NOUVELLE POSITION (MILIEU)
                    : new THREE.Vector3(6, 0.51, 6);   // 🔴 POSITION STANDARD (HAUT)

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
        }

        this.mazeGroup.add(platformGroup);
        this.platforms.push(platformGroup);

        return platformGroup;
    }

    // ===== PLATEFORME FINALE =====
    createLowerPlatform() {
        const platformGroup = new THREE.Group();
        platformGroup.position.set(6, -17, 6); // Descendue de y=-12 à y=-17

        const geo = new THREE.BoxGeometry(12, 1, 12);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x226622,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        });

        const platform = new THREE.Mesh(geo, mat);
        platform.receiveShadow = true;
        platform.userData.isSolid = true; // 🔷 SOLIDE
        platformGroup.add(platform);

        // Zone de sortie
        const exitGeo = new THREE.CylinderGeometry(2, 2, 0.3, 32);
        const exitMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1
        });

        this.exit = new THREE.Mesh(exitGeo, exitMat);
        this.exit.position.set(0, 0.6, 0);
        platformGroup.add(this.exit);

        const exitLight = new THREE.PointLight(0x00ff00, 2, 10);
        exitLight.position.set(0, 3, 0);
        platformGroup.add(exitLight);

        // Bordures
        const matWall = new THREE.MeshStandardMaterial({ color: 0x555555 });
        this.addWallToGroup(platformGroup, 0, 1, -6.5, 12, 1.5, 0.5, matWall);
        this.addWallToGroup(platformGroup, 0, 1, 6.5, 12, 1.5, 0.5, matWall);
        this.addWallToGroup(platformGroup, -6.5, 1, 0, 0.5, 1.5, 12, matWall);
        this.addWallToGroup(platformGroup, 6.5, 1, 0, 0.5, 1.5, 12, matWall);

        this.mazeGroup.add(platformGroup);
        this.platforms.push(platformGroup);

        return platformGroup;
    }

    // ===== BORDURES =====
    addUpperPlatformBorders(group) {
        const mat = new THREE.MeshStandardMaterial({ color: 0x555577 });
        const h = 2;
        const t = 0.5;
        const half = 9;

        this.addWallToGroup(group, 0, 1, -half - t / 2, 18, h, t, mat);
        this.addWallToGroup(group, 0, 1, half + t / 2, 18, h, t, mat);
        this.addWallToGroup(group, -half - t / 2, 1, 0, t, h, 18, mat);
        this.addWallToGroup(group, half + t / 2, 1, 0, t, h, 18, mat);
    }

    // ===== LABYRINTHE =====
    createWalls(complexity, platformGroup, type) {
        const mat = new THREE.MeshStandardMaterial({
            color: 0x444466,
            roughness: 0.8
        });

        // 🔴 PLATEFORME HAUTE (standard)
        if (type === "top") {
            this.addWallToGroup(platformGroup, -3, 1, 0, 1, 2, 8, mat);
            this.addWallToGroup(platformGroup, 3, 1, -3, 1, 2, 6, mat);
            this.addWallToGroup(platformGroup, 0, 1, -6, 10, 2, 1, mat);
        }

        // 🔵 PLATEFORME MILIEU (nouvelle disposition)
        if (type === "middle") {
            this.addWallToGroup(platformGroup, 0, 1, -2, 12, 2, 1, mat);
            this.addWallToGroup(platformGroup, -4, 1, 3, 1, 2, 8, mat);
            this.addWallToGroup(platformGroup, 4, 1, -4, 1, 2, 6, mat);
            this.addWallToGroup(platformGroup, 0, 1, 5, 6, 2, 1, mat);
        }
    }

    // ===== WALL HELPER =====
    addWallToGroup(group, x, y, z, w, h, d, mat) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(x, y, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        wall.userData.isSolid = true; // 🔷 SOLIDE

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
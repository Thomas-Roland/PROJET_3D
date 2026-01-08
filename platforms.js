// platforms.js - Plateformes avec chargement depuis configuration

class PlatformManager {
    constructor(scene, mazeGroup) {
        this.scene = scene;
        this.mazeGroup = mazeGroup;
        this.platforms = [];
        this.walls = [];
        this.holes = [];
        this.exit = null;
    }

    // ===== CRÉATION DEPUIS CONFIGURATION DE NIVEAU =====
    createPlatform(levelConfig) {
        this.clear();

        console.log(`🏗️ Construction du niveau: ${levelConfig.name}`);

        // Plateforme haute avec configuration du niveau
        const topPlatform = this.createUpperPlatform(0, true, "top");
        this.createWallsFromConfig(topPlatform, levelConfig.wallsTop);
        this.addHole(topPlatform, levelConfig.holeTop);

        // Plateforme finale avec configuration du niveau
        const finalPlatform = this.createUpperPlatform(-20, false, "middle");
        this.createWallsFromConfig(finalPlatform, levelConfig.wallsFinal);
        this.addExitZone(finalPlatform);

        console.log(`✅ ${this.walls.length} murs créés`);
        console.log(`✅ ${this.holes.length} trous créés`);

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

        this.mazeGroup.add(platformGroup);
        this.platforms.push(platformGroup);

        return platformGroup;
    }

    // ===== BORDURES =====
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

    // ===== CRÉATION DES MURS DEPUIS CONFIG =====
    createWallsFromConfig(platformGroup, wallsConfig) {
        const mat = new THREE.MeshStandardMaterial({
            color: 0x444466,
            roughness: 0.8
        });

        wallsConfig.forEach(wall => {
            this.addWallToGroup(
                platformGroup, 
                wall.x, wall.y, wall.z, 
                wall.w, wall.h, wall.d, 
                mat
            );
        });

        console.log(`  📐 ${wallsConfig.length} murs ajoutés depuis la configuration`);
    }

    // ===== AJOUT D'UN TROU =====
    addHole(platformGroup, holeConfig) {
        const holePosition = new THREE.Vector3(
            holeConfig.x, 
            holeConfig.y, 
            holeConfig.z
        );

        // Géométrie du trou
        const holeGeo = new THREE.CircleGeometry(holeConfig.radius, 32);
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

        // Anneau lumineux autour du trou
        const ringGeo = new THREE.RingGeometry(holeConfig.radius, holeConfig.radius + 0.5, 32);
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

        // Lumière au-dessus du trou
        const light = new THREE.PointLight(0xffaa00, 1, 8);
        light.position.set(holePosition.x, 2, holePosition.z);
        platformGroup.add(light);

        // Marqueur visuel
        const markerGeo = new THREE.SphereGeometry(1.0, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.9
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.set(holePosition.x, holePosition.y + 3, holePosition.z);
        platformGroup.add(marker);

        console.log(`  🕳️ Trou créé à (${holePosition.x}, ${holePosition.y}, ${holePosition.z})`);
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

        console.log(`  🚪 Zone de sortie créée`);
    }

    // ===== HELPER POUR AJOUTER UN MUR =====
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

    // ===== NETTOYAGE =====
    clear() {
        while (this.mazeGroup.children.length > 0) {
            this.mazeGroup.remove(this.mazeGroup.children[0]);
        }

        this.platforms = [];
        this.walls = [];
        this.holes = [];
        this.exit = null;

        console.log(`🧹 Plateformes nettoyées`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformManager;
}
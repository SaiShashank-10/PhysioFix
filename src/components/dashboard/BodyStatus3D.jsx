import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Premium 3D Human Body with Realistic Proportions & Athletic Outfit
export default function BodyStatus3D({ onPartClick, selectedPart }) {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const animationIdRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredPart, setHoveredPart] = useState(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // ========== SCENE SETUP ==========
        const scene = new THREE.Scene();

        // Premium dark gradient background
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = 512;
        bgCanvas.height = 512;
        const bgCtx = bgCanvas.getContext('2d');
        const gradient = bgCtx.createRadialGradient(256, 200, 0, 256, 256, 400);
        gradient.addColorStop(0, '#0f1419');
        gradient.addColorStop(0.5, '#0a0e12');
        gradient.addColorStop(1, '#050709');
        bgCtx.fillStyle = gradient;
        bgCtx.fillRect(0, 0, 512, 512);
        scene.background = new THREE.CanvasTexture(bgCanvas);

        // Camera with cinematic FOV
        const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.0, 4.2);
        camera.lookAt(0, 0.9, 0);

        // Renderer with high quality settings
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ========== PREMIUM LIGHTING ==========
        // Ambient - soft base
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        // Key light - main illumination (warm)
        const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
        keyLight.position.set(4, 6, 4);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);

        // Fill light - soften shadows (cool)
        const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.8);
        fillLight.position.set(-4, 4, -2);
        scene.add(fillLight);

        // Rim light - edge definition (cyan accent)
        const rimLight = new THREE.SpotLight(0x08e8de, 1.5, 15, Math.PI / 4, 0.5);
        rimLight.position.set(0, 3, -4);
        scene.add(rimLight);

        // Top light - hair/head highlight
        const topLight = new THREE.PointLight(0xffffff, 0.6, 8);
        topLight.position.set(0, 4, 0);
        scene.add(topLight);

        // Accent rotating light
        const accentLight = new THREE.PointLight(0x08e8de, 0.3, 6);
        scene.add(accentLight);

        // Ground reflection plane
        const groundGeo = new THREE.CircleGeometry(2, 64);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x0a0e12,
            roughness: 0.3,
            metalness: 0.8,
            transparent: true,
            opacity: 0.6
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        scene.add(ground);

        // ========== MODEL GROUP ==========
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        // ========== MATERIALS - Ultra Realistic ==========

        // Skin - realistic subsurface-like effect
        const skinMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd4a574,
            roughness: 0.45,
            metalness: 0.02,
            clearcoat: 0.15,
            clearcoatRoughness: 0.4,
            sheen: 0.5,
            sheenRoughness: 0.3,
            sheenColor: new THREE.Color(0xffccaa),
            envMapIntensity: 0.5
        });

        // Hair - dark with subtle sheen
        const hairMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a0f0a,
            roughness: 0.7,
            metalness: 0.1,
            sheen: 0.8,
            sheenRoughness: 0.3,
            sheenColor: new THREE.Color(0x3d2817)
        });

        // Athletic compression top - dark navy with subtle texture
        const topMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0d1f3c,
            roughness: 0.6,
            metalness: 0.0,
            sheen: 0.4,
            sheenRoughness: 0.5,
            sheenColor: new THREE.Color(0x1a4080),
            clearcoat: 0.05
        });

        // Athletic joggers - charcoal gray
        const pantsMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a30,
            roughness: 0.7,
            metalness: 0.0,
            sheen: 0.2,
            sheenColor: new THREE.Color(0x404045)
        });

        // Sneakers - white with subtle metalness
        const shoeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf0f0f0,
            roughness: 0.35,
            metalness: 0.1,
            clearcoat: 0.2,
            clearcoatRoughness: 0.3
        });

        // Shoe accent - cyan brand color
        const shoeAccentMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x08e8de,
            roughness: 0.3,
            metalness: 0.3,
            emissive: 0x08e8de,
            emissiveIntensity: 0.2
        });

        // ========== BUILD REALISTIC HUMAN ==========

        // Scale factor for proper proportions (1.75m human)
        const s = 1;

        // HEAD - More detailed shape
        const headGroup = new THREE.Group();

        // Skull base
        const skull = new THREE.Mesh(
            new THREE.SphereGeometry(0.105 * s, 48, 48),
            skinMaterial
        );
        skull.scale.set(0.92, 1.08, 0.95);
        skull.position.y = 1.68 * s;
        headGroup.add(skull);

        // Face shape - slight protrusion
        const face = new THREE.Mesh(
            new THREE.SphereGeometry(0.09 * s, 32, 32),
            skinMaterial
        );
        face.scale.set(0.85, 0.9, 0.5);
        face.position.set(0, 1.65 * s, 0.04 * s);
        headGroup.add(face);

        // Jaw
        const jaw = new THREE.Mesh(
            new THREE.BoxGeometry(0.08 * s, 0.05 * s, 0.07 * s),
            skinMaterial
        );
        jaw.position.set(0, 1.56 * s, 0.02 * s);
        jaw.rotation.x = 0.1;
        headGroup.add(jaw);

        // Ears
        const earGeo = new THREE.SphereGeometry(0.02 * s, 16, 16);
        const earL = new THREE.Mesh(earGeo, skinMaterial);
        earL.scale.set(0.4, 0.9, 0.6);
        earL.position.set(-0.095 * s, 1.66 * s, 0);
        headGroup.add(earL);
        const earR = earL.clone();
        earR.position.x = 0.095 * s;
        headGroup.add(earR);

        // Hair - Styled short cut
        const hairBase = new THREE.Mesh(
            new THREE.SphereGeometry(0.115 * s, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6),
            hairMaterial
        );
        hairBase.position.set(0, 1.75 * s, -0.01 * s);
        hairBase.scale.set(0.9, 0.55, 0.92);
        headGroup.add(hairBase);

        // Hair sides
        const hairSide = new THREE.Mesh(
            new THREE.BoxGeometry(0.02 * s, 0.08 * s, 0.1 * s),
            hairMaterial
        );
        hairSide.position.set(-0.09 * s, 1.7 * s, -0.02 * s);
        headGroup.add(hairSide);
        const hairSideR = hairSide.clone();
        hairSideR.position.x = 0.09 * s;
        headGroup.add(hairSideR);

        modelGroup.add(headGroup);

        // NECK
        const neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045 * s, 0.05 * s, 0.1 * s, 24),
            skinMaterial
        );
        neck.position.set(0, 1.5 * s, 0);
        modelGroup.add(neck);

        // TORSO - Athletic build with compression top
        const torsoGroup = new THREE.Group();

        // Upper chest
        const chest = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18 * s, 0.16 * s, 0.25 * s, 32),
            topMaterial
        );
        chest.position.set(0, 1.32 * s, 0);
        chest.scale.set(1.1, 1, 0.65);
        torsoGroup.add(chest);

        // Lower torso
        const abdomen = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14 * s, 0.145 * s, 0.2 * s, 32),
            topMaterial
        );
        abdomen.position.set(0, 1.1 * s, 0);
        abdomen.scale.set(1.05, 1, 0.6);
        torsoGroup.add(abdomen);

        // Shoulders - Athletic rounded
        const shoulderGeo = new THREE.SphereGeometry(0.075 * s, 24, 24);
        const shoulderL = new THREE.Mesh(shoulderGeo, topMaterial);
        shoulderL.position.set(-0.21 * s, 1.38 * s, 0);
        shoulderL.scale.set(1.1, 0.7, 0.7);
        torsoGroup.add(shoulderL);
        const shoulderR = shoulderL.clone();
        shoulderR.position.x = 0.21 * s;
        torsoGroup.add(shoulderR);

        modelGroup.add(torsoGroup);

        // ARMS - Athletic with short sleeves showing skin
        const armGroup = new THREE.Group();

        // Upper arms (sleeves)
        const upperArmGeo = new THREE.CapsuleGeometry(0.05 * s, 0.15 * s, 8, 16);
        const upperArmL = new THREE.Mesh(upperArmGeo, topMaterial);
        upperArmL.position.set(-0.28 * s, 1.22 * s, 0);
        upperArmL.rotation.z = 0.12;
        armGroup.add(upperArmL);
        const upperArmR = upperArmL.clone();
        upperArmR.position.x = 0.28 * s;
        upperArmR.rotation.z = -0.12;
        armGroup.add(upperArmR);

        // Exposed forearms (skin)
        const forearmGeo = new THREE.CapsuleGeometry(0.038 * s, 0.18 * s, 8, 16);
        const forearmL = new THREE.Mesh(forearmGeo, skinMaterial);
        forearmL.position.set(-0.34 * s, 0.92 * s, 0);
        forearmL.rotation.z = 0.08;
        armGroup.add(forearmL);
        const forearmR = forearmL.clone();
        forearmR.position.x = 0.34 * s;
        forearmR.rotation.z = -0.08;
        armGroup.add(forearmR);

        // Elbows
        const elbowGeo = new THREE.SphereGeometry(0.04 * s, 16, 16);
        const elbowL = new THREE.Mesh(elbowGeo, skinMaterial);
        elbowL.position.set(-0.32 * s, 1.05 * s, 0);
        armGroup.add(elbowL);
        const elbowR = elbowL.clone();
        elbowR.position.x = 0.32 * s;
        armGroup.add(elbowR);

        // Wrists
        const wristGeo = new THREE.SphereGeometry(0.025 * s, 16, 16);
        const wristL = new THREE.Mesh(wristGeo, skinMaterial);
        wristL.position.set(-0.36 * s, 0.72 * s, 0);
        armGroup.add(wristL);
        const wristR = wristL.clone();
        wristR.position.x = 0.36 * s;
        armGroup.add(wristR);

        // Hands - More detailed
        const handGeo = new THREE.BoxGeometry(0.05 * s, 0.08 * s, 0.025 * s);
        const handL = new THREE.Mesh(handGeo, skinMaterial);
        handL.position.set(-0.37 * s, 0.62 * s, 0);
        handL.rotation.z = 0.05;
        armGroup.add(handL);
        const handR = handL.clone();
        handR.position.x = 0.37 * s;
        handR.rotation.z = -0.05;
        armGroup.add(handR);

        modelGroup.add(armGroup);

        // LOWER BODY - Athletic joggers
        const legsGroup = new THREE.Group();

        // Hips/Waist
        const hips = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15 * s, 0.16 * s, 0.15 * s, 32),
            pantsMaterial
        );
        hips.position.set(0, 0.93 * s, 0);
        hips.scale.set(1.05, 1, 0.55);
        legsGroup.add(hips);

        // Thighs
        const thighGeo = new THREE.CapsuleGeometry(0.065 * s, 0.28 * s, 8, 16);
        const thighL = new THREE.Mesh(thighGeo, pantsMaterial);
        thighL.position.set(-0.08 * s, 0.65 * s, 0);
        legsGroup.add(thighL);
        const thighR = thighL.clone();
        thighR.position.x = 0.08 * s;
        legsGroup.add(thighR);

        // Knees
        const kneeGeo = new THREE.SphereGeometry(0.055 * s, 16, 16);
        const kneeL = new THREE.Mesh(kneeGeo, pantsMaterial);
        kneeL.position.set(-0.08 * s, 0.42 * s, 0.01 * s);
        legsGroup.add(kneeL);
        const kneeR = kneeL.clone();
        kneeR.position.x = 0.08 * s;
        legsGroup.add(kneeR);

        // Calves
        const calfGeo = new THREE.CapsuleGeometry(0.05 * s, 0.25 * s, 8, 16);
        const calfL = new THREE.Mesh(calfGeo, pantsMaterial);
        calfL.position.set(-0.08 * s, 0.2 * s, 0);
        legsGroup.add(calfL);
        const calfR = calfL.clone();
        calfR.position.x = 0.08 * s;
        legsGroup.add(calfR);

        // Ankles
        const ankleGeo = new THREE.SphereGeometry(0.035 * s, 16, 16);
        const ankleL = new THREE.Mesh(ankleGeo, pantsMaterial);
        ankleL.position.set(-0.08 * s, 0.02 * s, 0);
        legsGroup.add(ankleL);
        const ankleR = ankleL.clone();
        ankleR.position.x = 0.08 * s;
        legsGroup.add(ankleR);

        modelGroup.add(legsGroup);

        // FEET - Athletic sneakers
        const feetGroup = new THREE.Group();

        // Shoe base
        const shoeGeo = new THREE.BoxGeometry(0.07 * s, 0.045 * s, 0.14 * s);
        const shoeL = new THREE.Mesh(shoeGeo, shoeMaterial);
        shoeL.position.set(-0.08 * s, -0.02 * s, 0.02 * s);
        feetGroup.add(shoeL);
        const shoeR = shoeL.clone();
        shoeR.position.x = 0.08 * s;
        feetGroup.add(shoeR);

        // Shoe toe cap
        const toeGeo = new THREE.SphereGeometry(0.035 * s, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const toeL = new THREE.Mesh(toeGeo, shoeMaterial);
        toeL.position.set(-0.08 * s, -0.02 * s, 0.08 * s);
        toeL.rotation.x = Math.PI / 2;
        toeL.scale.set(1, 1, 0.6);
        feetGroup.add(toeL);
        const toeR = toeL.clone();
        toeR.position.x = 0.08 * s;
        feetGroup.add(toeR);

        // Shoe accent stripe
        const stripeGeo = new THREE.BoxGeometry(0.005 * s, 0.02 * s, 0.08 * s);
        const stripeL = new THREE.Mesh(stripeGeo, shoeAccentMaterial);
        stripeL.position.set(-0.115 * s, -0.01 * s, 0.02 * s);
        feetGroup.add(stripeL);
        const stripeR = stripeL.clone();
        stripeR.position.x = 0.115 * s;
        feetGroup.add(stripeR);

        // Sole
        const soleGeo = new THREE.BoxGeometry(0.075 * s, 0.015 * s, 0.15 * s);
        const soleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
        const soleL = new THREE.Mesh(soleGeo, soleMat);
        soleL.position.set(-0.08 * s, -0.045 * s, 0.02 * s);
        feetGroup.add(soleL);
        const soleR = soleL.clone();
        soleR.position.x = 0.08 * s;
        feetGroup.add(soleR);

        modelGroup.add(feetGroup);

        // Center model
        modelGroup.position.y = -0.85;

        // ========== INTERACTIVE HITBOXES ==========
        const hitboxDefs = [
            { name: 'Head', pos: [0, 1.68, 0], size: [0.22, 0.28, 0.22], color: '#ff6b6b' },
            { name: 'Neck', pos: [0, 1.5, 0], size: [0.1, 0.1, 0.1], color: '#ffa502' },
            { name: 'Left Shoulder', pos: [-0.24, 1.38, 0], size: [0.12, 0.1, 0.1], color: '#5352ed' },
            { name: 'Right Shoulder', pos: [0.24, 1.38, 0], size: [0.12, 0.1, 0.1], color: '#5352ed' },
            { name: 'Chest', pos: [0, 1.3, 0], size: [0.32, 0.2, 0.15], color: '#2ed573' },
            { name: 'Abdomen', pos: [0, 1.08, 0], size: [0.25, 0.15, 0.12], color: '#1e90ff' },
            { name: 'Lower Back', pos: [0, 0.95, -0.06], size: [0.22, 0.15, 0.1], color: '#ff4757' },
            { name: 'Left Upper Arm', pos: [-0.28, 1.2, 0], size: [0.1, 0.2, 0.1], color: '#3742fa' },
            { name: 'Right Upper Arm', pos: [0.28, 1.2, 0], size: [0.1, 0.2, 0.1], color: '#3742fa' },
            { name: 'Left Elbow', pos: [-0.32, 1.05, 0], size: [0.08, 0.08, 0.08], color: '#ffa502' },
            { name: 'Right Elbow', pos: [0.32, 1.05, 0], size: [0.08, 0.08, 0.08], color: '#ffa502' },
            { name: 'Left Forearm', pos: [-0.34, 0.9, 0], size: [0.08, 0.2, 0.08], color: '#3742fa' },
            { name: 'Right Forearm', pos: [0.34, 0.9, 0], size: [0.08, 0.2, 0.08], color: '#3742fa' },
            { name: 'Left Wrist', pos: [-0.36, 0.72, 0], size: [0.06, 0.06, 0.06], color: '#ffa502' },
            { name: 'Right Wrist', pos: [0.36, 0.72, 0], size: [0.06, 0.06, 0.06], color: '#ffa502' },
            { name: 'Left Hand', pos: [-0.37, 0.62, 0], size: [0.07, 0.1, 0.04], color: '#ff6b6b' },
            { name: 'Right Hand', pos: [0.37, 0.62, 0], size: [0.07, 0.1, 0.04], color: '#ff6b6b' },
            { name: 'Left Hip', pos: [-0.1, 0.88, 0], size: [0.1, 0.12, 0.1], color: '#a55eea' },
            { name: 'Right Hip', pos: [0.1, 0.88, 0], size: [0.1, 0.12, 0.1], color: '#a55eea' },
            { name: 'Left Thigh', pos: [-0.08, 0.65, 0], size: [0.12, 0.28, 0.1], color: '#2ed573' },
            { name: 'Right Thigh', pos: [0.08, 0.65, 0], size: [0.12, 0.28, 0.1], color: '#2ed573' },
            { name: 'Left Knee', pos: [-0.08, 0.42, 0], size: [0.1, 0.1, 0.1], color: '#ff4757' },
            { name: 'Right Knee', pos: [0.08, 0.42, 0], size: [0.1, 0.1, 0.1], color: '#ff4757' },
            { name: 'Left Calf', pos: [-0.08, 0.2, 0], size: [0.1, 0.25, 0.1], color: '#70a1ff' },
            { name: 'Right Calf', pos: [0.08, 0.2, 0], size: [0.1, 0.25, 0.1], color: '#70a1ff' },
            { name: 'Left Ankle', pos: [-0.08, 0.02, 0], size: [0.08, 0.08, 0.08], color: '#ffa502' },
            { name: 'Right Ankle', pos: [0.08, 0.02, 0], size: [0.08, 0.08, 0.08], color: '#ffa502' },
            { name: 'Left Foot', pos: [-0.08, -0.02, 0.02], size: [0.09, 0.06, 0.15], color: '#5352ed' },
            { name: 'Right Foot', pos: [0.08, -0.02, 0.02], size: [0.09, 0.06, 0.15], color: '#5352ed' },
        ];

        const hitboxes = [];
        const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });

        hitboxDefs.forEach(d => {
            const hb = new THREE.Mesh(new THREE.BoxGeometry(...d.size), hitboxMat.clone());
            hb.position.set(...d.pos);
            hb.userData = { bodyPart: d.name, color: d.color };
            modelGroup.add(hb);
            hitboxes.push(hb);
        });

        setIsLoading(false);

        // ========== INTERACTION ==========
        let isDragging = false;
        let dragStartX = 0;
        let dragOffset = 0;
        let targetZoom = 4.2;
        let currentZoom = 4.2;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onPointerDown = (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            container.style.cursor = 'grabbing';
        };

        const onPointerUp = (e) => {
            if (isDragging && Math.abs(e.clientX - dragStartX) < 5) {
                const rect = container.getBoundingClientRect();
                mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObjects(hitboxes);
                if (hits.length > 0 && onPartClick) {
                    onPartClick(hits[0].object.userData.bodyPart);
                }
            }
            isDragging = false;
            container.style.cursor = 'grab';
        };

        const onPointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            if (isDragging) {
                dragOffset += (e.clientX - dragStartX) * 0.008;
                dragStartX = e.clientX;
            } else {
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObjects(hitboxes);
                if (hits.length > 0) {
                    setHoveredPart(hits[0].object.userData.bodyPart);
                    container.style.cursor = 'pointer';
                } else {
                    setHoveredPart(null);
                    container.style.cursor = 'grab';
                }
            }
        };

        const onWheel = (e) => {
            e.preventDefault();
            targetZoom = Math.max(2.5, Math.min(7, targetZoom + e.deltaY * 0.003));
        };

        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointerup', onPointerUp);
        container.addEventListener('pointerleave', () => { isDragging = false; });
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('wheel', onWheel, { passive: false });
        container.style.cursor = 'grab';

        // ========== ANIMATION LOOP ==========
        let time = 0;
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            time += 0.016;

            // Continuous 360° rotation
            modelGroup.rotation.y = time * 0.4 + dragOffset;

            // Smooth zoom
            currentZoom += (targetZoom - currentZoom) * 0.06;
            camera.position.z = currentZoom;

            // Subtle breathing motion
            modelGroup.position.y = -0.85 + Math.sin(time * 0.6) * 0.008;

            // Rotate accent light
            accentLight.position.x = Math.cos(time * 0.3) * 3;
            accentLight.position.z = Math.sin(time * 0.3) * 3;
            accentLight.position.y = 1.5 + Math.sin(time * 0.5) * 0.5;

            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const onResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            container.removeEventListener('pointerdown', onPointerDown);
            container.removeEventListener('pointerup', onPointerUp);
            container.removeEventListener('pointermove', onPointerMove);
            container.removeEventListener('wheel', onWheel);
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            if (container && rendererRef.current?.domElement) {
                container.removeChild(rendererRef.current.domElement);
            }
            renderer.dispose();
        };
    }, [onPartClick, selectedPart]);

    return (
        <div className="w-full h-full relative group bg-[#080a0d] rounded-2xl overflow-hidden">
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#080a0d]">
                    <div className="relative w-20 h-20 mb-4">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-2 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <div className="text-primary text-sm font-bold tracking-wider">LOADING 3D MODEL</div>
                    <div className="text-slate-500 text-xs mt-1">Please wait...</div>
                </div>
            )}

            {/* 3D Canvas Container */}
            <div ref={containerRef} className="w-full h-full" />

            {/* Hover Tooltip */}
            {hoveredPart && !selectedPart && (
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-primary/50 pointer-events-none shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-left-4 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Click to Analyze</span>
                    </div>
                    <div className="text-lg font-black text-white">{hoveredPart}</div>
                </div>
            )}

            {/* Selected Part Indicator */}
            {selectedPart && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600/30 to-transparent backdrop-blur-xl px-5 py-3 rounded-2xl border border-red-500/50 pointer-events-none shadow-2xl shadow-red-500/20 animate-in fade-in slide-in-from-left-4 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Analyzing</span>
                    </div>
                    <div className="text-lg font-black text-red-400">{selectedPart}</div>
                </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end pointer-events-none">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-full border border-primary/40">
                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(8,232,222,0.8)]" />
                    <span className="text-xs font-black text-primary uppercase tracking-wider">3D ACTIVE</span>
                </div>
                <div className="text-[10px] text-slate-500 bg-black/50 px-3 py-1 rounded-full">
                    Auto-Rotating
                </div>
            </div>

            {/* Bottom Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl px-6 py-2.5 rounded-full text-xs text-white/70 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10 flex items-center gap-5">
                <span className="flex items-center gap-2">
                    <span className="text-primary">↔</span> Drag to rotate
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                    <span className="text-primary">⚲</span> Scroll to zoom
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                    <span className="text-primary">👆</span> Click body part
                </span>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/20 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/20 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/20 rounded-br-2xl pointer-events-none" />
        </div>
    );
}

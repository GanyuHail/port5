(function () {
    'use strict';
    //const raycaster = new THREE.Raycaster();
    //const pointer = new THREE.Vector2();
    var scene, camera, renderer;
    var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane,
        geometry, particleCount, sphereMesh,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;

    init();
    animate();

    function init() {

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 250;
        farPlane = 3000;

        cameraZ = farPlane / 2;
        fogHex = 0x000000;
        fogDensity = 0.0007;
        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        ambientLight.castShadow = true;
        scene.add(ambientLight);

        // const spotLight = new THREE.SpotLight(0xF7A8B8, 8);
        // spotLight.castShadow = true;
       // spotLight.position.set(100, 64, 32);
       // scene.add(spotLight);

        // function onPointerClick(event) {
        // pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        // pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // };

        //const lightHelper = new THREE.PointLightHelper(spotLight)
        //scene.add(lightHelper);

        //const sphereGeometry = new THREE.SphereGeometry(100, 64, 32);
        //const sphereTex = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/port3a/main/src/uniPinchpinched.jpg');
       //const sphereMaterial = new THREE.MeshStandardMaterial({ map: sphereTex });
        //const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        //scene.add(sphereMesh);

        //const sphereGeometry2 = new THREE.SphereGeometry(75, 64, 32);
        //const sphereMesh2 = new THREE.Mesh(sphereGeometry2);
        //scene.add(sphereMesh2);

        //const sphereGeometry3 = new THREE.SphereGeometry(50, 64, 32);
        //const sphereMesh3 = new THREE.Mesh(sphereGeometry3);
        //scene.add(sphereMesh3);

        //const sphereGeometry4 = new THREE.SphereGeometry(25, 64, 32);
        //const sphereMesh4 = new THREE.Mesh(sphereGeometry4);
        //scene.add(sphereMesh4);

        //const sphereGeometry5 = new THREE.SphereGeometry(5, 64, 32);
        //const sphereMesh5 = new THREE.Mesh(sphereGeometry5);
        //scene.add(sphereMesh5);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        geometry = new THREE.Geometry();
        particleCount = 10000;

        for (i = 0; i < particleCount; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;
            geometry.vertices.push(vertex);
        }

        parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
        ];
        parameterCount = parameters.length;
        for (i = 0; i < parameterCount; i++) {

            size = parameters[i][1];

            materials[i] = new THREE.PointsMaterial({
                transparent: true,
                size: 2.5,
                //uniforms: {
                    //size: { value: 10 },
                    //scale: { value: 1 },
                //},
            });

            particles = new THREE.Points(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            scene.add(particles);
        }

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        //document.addEventListener('wheel', scroll, false);
        //window.addEventListener('pointerclick', onclick, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var time = Date.now() * 0.00005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.position.z += (mouseY - camera.position.z) * 0.001;
        camera.lookAt(scene.position);

        for (i = 0; i < scene.children.length; i++) {
            var object = scene.children[i];
            if (object instanceof THREE.Points) {
                object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
            }
        }

        for (i = 0; i < materials.length; i++) {
            color = parameters[i][0];
            h = (360 * (color[0] + time) % 360) / 360;
            materials[i].color.setHSL(h, color [1], color [2]);
        }

        //raycaster.setFromCamera(pointer, camera);
        //const intersects = raycaster.intersectObjects(scene.children);

        //for (let i = 0; i < intersects.length; i++) {
        //   intersects[i].object.material.color.set(0xF7A8B8);
        //}

        renderer.render(scene, camera);
    }

    //function onDocumentMouseDown(event) {

    // event.preventDefault();
    // mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    // mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // raycaster.setFromCamera(pointer, camera);
    // var intersects = raycaster.intersectObjects(objects);
    // if (intersects.length > 0) {
    //      intersects[i].object.material.color.set(0xF7A8B8);
    //  }
    //  }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    function onDocumentTouchStart(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
})();
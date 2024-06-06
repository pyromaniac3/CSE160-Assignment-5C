import * as THREE from 'three';
//import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    // Camera Stats
	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

    // Create a new Scene
	const scene = new THREE.Scene();

    // Create base box mesh and geometry
    const cubes = [] // array to rotate the cubes 
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

    // Texture Loader
    const loader = new THREE.TextureLoader();
    const materials = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/akkoxamanda.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/ladynoir.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/mammamia.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/oz.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/seal.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/koi.png')}),
      ];


    const cube = new THREE.Mesh( geometry, materials );
	scene.add( cube );
	cubes.push( cube ); // add to our list of cubes to rotate

    // Add Lighting to the Scene
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    let confettiPositions;
    let confettiGeom;
    
    function addTheConfetti() {
        confettiGeom = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);
        confettiVelocities = new Float32Array(particlesCount * 3);
        console.log("confetti");
        for (let i = 0; i < particlesCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 75; // x position
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 75; // y position
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 75; // z position
    
            confettiVelocities[i * 3] = (Math.random() - 0.5) * 2; // x velocity
            confettiVelocities[i * 3 + 1] = Math.random() * 5; // y velocity
            confettiVelocities[i * 3 + 2] = (Math.random() - 0.5) * 2; // z velocity
        }
    
        confettiGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        confettiPositions = confettiGeom.attributes.position.array;
    
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true, // Use this to allow different colors for each particle
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
    
        // Set different colors for the particles
        const colors = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            // Generate saturated colors by ensuring RGB values are closer to 1
            switch(Math.floor(Math.random() * 3)){
                case 0:
                    colors[i * 3] = 1;
                    colors[i * 3 + 1] = 0;
                    colors[i * 3 + 1] = 0;
                    break;
                case 1:
                    colors[i * 3] = 0;
                    colors[i * 3 + 1] = 1;
                    colors[i * 3 + 1] = 0;
                    break;
                case 2:
                    colors[i * 3] = 0;
                    colors[i * 3 + 1] = 0;
                    colors[i * 3 + 1] = 1;
                    break;
                default:
                    colors[i * 3] = 1;
                    colors[i * 3 + 1] = 0;
                    colors[i * 3 + 1] = 0;
                    break;
            }
        }
        confettiGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
        const particles = new THREE.Points(confettiGeom, particlesMaterial);
        scene.add(particles);
        console.log("hiya");
    }



    addTheConfetti();
    // // making 3 different cubes, saving them into an array so we can send it to the render in one
    // const shapes = [
    //     makeInstance(geometry, 0x44aa88,  0),
    //     makeInstance(geometry, 0x8844aa, -2),
    //     makeInstance(geometry, 0xaa8844,  2),
    //   ];

    function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

    // Function to animate and roate the cube in 3D space
	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

        // rotating the cubs
		cubes.forEach( ( cube, ndx ) => {

			const speed = .2 + ndx * .1;
			const rot = time * speed;
			//cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );
        //animateConfetti();
		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

    //call this function to add multiple boxes to the scene easy
    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial( { color } );
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
       
        cube.position.x = x;
       
        return cube;
      }

    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        //texture.minFilter = THREE.LinearMipmapLinearFilter;
        return texture;
      }
}

// Run Main
main();
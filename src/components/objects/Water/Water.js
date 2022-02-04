import { Group, Scene } from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
// import POSX from "../../scenes/textures/Skybox/posx.jpg";
// import NEGX from "../../scenes/textures/Skybox/negx.jpg";
// import POSY from "../../scenes/textures/Skybox/posy.jpg";
// import NEGY from "../../scenes/textures/Skybox/negy.jpg";
// import POSZ from "../../scenes/textures/Skybox/posz.jpg";
// import NEGZ from "../../scenes/textures/Skybox/negz.jpg";

class Water extends Group {
  constructor(parent, color, metalMap, x, y, z, radius) {
    // Call parent Group() constructor
	super();

    // Init state
    this.state = {
		// gui: parent.state.gui,
		bob: false,
		spin: this.spin.bind(this),
		// twirl: 0,
		radius: radius,
		count: radius,
		grow: 0,
	};
	
	this.fadeIn = this.fadeIn.bind(this);
  
	this.name = "WATER"  

	const geometry = new THREE.CircleGeometry( radius, 32 );
	const material = new THREE.MeshBasicMaterial( { color: color } );
// 0x96c0ff
	// var material = new THREE.MeshStandardMaterial( {
	// 	color: 0x30f2f2,
	// 	emissive: 0x555555,
	// 	metalness: 1,   // between 0 and 1
	// 	roughness: 0, // between 0 and 1
	// 	envMap: metalMap,
	// 	envMapIntensity: 2
	// } );

	const circle = new THREE.Mesh( geometry, material );
	circle.rotation.x = -Math.PI / 2;
	this.add( circle );
	this.geometry = geometry;
	this.circle = circle;

	circle.position.set(x, y, z);

	console.log(this.state.grow);
    parent.addToUpdateList(this);
    this.visible = false;
    // Populate GUI
    // this.state.gui.add(this.state, 'bob');
	// this.state.gui.add(this.state, 'spin');

  }

  fadeIn() {
	  this.visible = true;
	this.state.grow = 1;
	// pouring out water
	setTimeout(() => {
		this.visible = false;
	}, 900000);
  }

  spin() {

	// 1.002 0.998 200
	}
	update(timeStamp) {
		if (this.state.grow) {
			// this.state.count++;
			// this.circle.radius *= 1.1;
			this.state.radius *= 1.01;
			this.circle.scale.multiplyScalar(1.01);
			// this.circle.setAttribute('radius', 1.2* this.circle.getAttribute('radius'));
			// radius.multiplyScalar(1.2);
			if (this.state.radius > 3.5) {
				this.state.grow = 0;
			}
		}



        // TWEEN.update();
	}
}

export default Water;

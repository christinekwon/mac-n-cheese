import { Group, MeshPhongMaterial, CubeTextureLoader, MeshStandardMaterial } from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Pot.obj';

// import POSX from "../../scenes/textures/Forest/posx.jpg";
// import NEGX from "../../scenes/textures/Forest/negx.jpg";
// import POSY from "../../scenes/textures/Forest/posy.jpg";
// import NEGY from "../../scenes/textures/Forest/negy.jpg";
// import POSZ from "../../scenes/textures/Forest/posz.jpg";
// import NEGZ from "../../scenes/textures/Forest/negz.jpg";
// import CLOUDS from "../../scenes/textures/Clouds/clouds.jpg";


class Pot extends Group {
    constructor(parent, metalMap) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            bob: false,
            spin: this.spin.bind(this),
            twirl: 0,
        };

        // Load object
        const loader = new OBJLoader();

        this.name = 'Pot';

        // let envMap = new CubeTextureLoader()
        // .load( [
        //     POSX, NEGX,
        //     POSY, NEGY,
        //     POSZ, NEGZ
		// ] );
        // let envMap = new CubeTextureLoader()
        // .load( [
        //     CLOUDS, CLOUDS,
        //     CLOUDS, CLOUDS,
        //     CLOUDS, CLOUDS
		// ] );

        var material = new MeshStandardMaterial( {
			// color: 0xfcc742,
			// emissive: 0xad6a0e,
			// gold
			// color: 0xffc311,
			// emissive: 0x4f3006,
			// pink
			// color: 0xffcad4,
			// emissive: 0xef798a,
			//silver
			color: 0xffffff,
			emissive: 0x444444,
			metalness: 1,
			roughness: 0,
			// metalness: 1,   // between 0 and 1
			// roughness: 0.5, // between 0 and 1
			envMap: metalMap,
			envMapIntensity: 1
		} );

        // var material = new MeshPhongMaterial({
		// 	color: 0xff00f3,
		// 	specular: 0xffffff,
		// 	shininess: 100
		// });

        loader.load(MODEL, obj => {
            obj.position.set(0, 0, 0);
            obj.rotation.set(0,0,0);
			// obj.position.set(0, -1.5, 0);
			// obj.rotation.set(0, -Math.PI, 0);
			obj.scale.multiplyScalar(1.2);
			// let textureloader = new THREE.TextureLoader();
			// textureloader.load(BUTTERFLY,function(tx){
			// 	tx.offset.set(-0.3, 0.5);
			// 	tx.repeat.set(1.5, 1.5);
			// 	let stripeMaterial = new THREE.MeshPhongMaterial({
			// 		map: tx,
			// 		wireframe: false,
			// 		specular: 0xffffff,
			// 		shininess: 1000,
			// 	});
			// 	obj.children[0].material = stripeMaterial;
			// });
            obj.children[0].material = material;
            obj.matrixAutoUpdate = false;
            obj.updateMatrix();
            this.add(obj);
        });


        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

            // false jumpy
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 30);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Pot;
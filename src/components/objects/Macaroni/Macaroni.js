import { Group, MeshPhongMaterial } from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Macaroni.obj';

class Macaroni extends Group {
    constructor(parent, x, y, z) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            bob: false,
            spin: this.spin.bind(this),
            twirl: 0,
            falling: 0
        };

        let tenMins = 400000;
        // 0.005 -> 0.05
        // 300 -> 30
        this.factor0 = 0.005;
        this.factor0Interval =  (0.05 - 0.005) / tenMins;
        this.factor1 = 300;
        this.factor1Interval = (10 - 300) / tenMins;

        // Load object
        const loader = new OBJLoader();

        this.name = 'Macaroni';

        var material = new MeshPhongMaterial({
			color: 0xfc9803,
			specular: 0xffffff,
			shininess: 1
		});

        loader.load(MODEL, obj => {
            obj.position.set(x, 10, z);
			// obj.position.set(0, -1.5, 0);
			obj.rotation.set(Math.PI / 2, 0, 0);
			obj.scale.multiplyScalar(0.1);
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

        this.drop = this.drop.bind(this);


        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.visible = false;

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }


    drop() {
        this.state.falling = 1;
        this.visible = true;
        setTimeout(() => {
            this.state.bob = true;
        }, 1000);

        // pouring out water
        setTimeout(() => {
            this.visible = false;
        }, 600000);

        //putting back in
        setTimeout(() => {
            this.visible = true;
        }, 605000);
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
        if (this.state.falling) {
            console.log(this.position);
            console.log('falling');
            if (this.position.y < -7) {
                console.log('done falling');
                this.state.falling = 0;
            }
            this.position.y -= 0.1;
        }
        if (this.state.bob) {
            // Bob back and forth
            // 0.005 -> 0.05
            // 300 -> 30
            // console.log(this.factor0);
            // console.log(this.factor1);
            this.factor0 += this.factor0Interval;
            this.factor1 += this.factor1Interval;
            this.rotation.y = this.factor0 * Math.sin(timeStamp / this.factor1);
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

export default Macaroni;

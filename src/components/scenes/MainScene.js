import * as Dat from 'dat.gui';
import { Scene, Color, CubeTextureLoader, TextureLoader } from 'three';
import { Pot, Spoon, Macaroni, Bubble, Water } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";

import POSX from "./textures/Skybox/posx.jpg";
import NEGX from "./textures/Skybox/negx.jpg";
import POSY from "./textures/Skybox/posy.jpg";
import NEGY from "./textures/Skybox/negy.jpg";
import POSZ from "./textures/Skybox/posz.jpg";
import NEGZ from "./textures/Skybox/negz.jpg";
import CLOUDS from "./textures/Clouds/clouds.jpg";

class MainScene extends Scene {
    
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0xffffff);

        // var bg = new TextureLoader().load(CLOUDS);
        // this.background = bg;

        var metalMap = new CubeTextureLoader()
        .load( [
            POSX, NEGX,
            POSY, NEGY,
            POSZ, NEGZ
        ] );

        this.tools = {
            "POT": new Pot(this, metalMap),
            "SPOON": new Spoon(this),
            "WATER": new Water(this, 0xcce0ff, metalMap, 0, 2, 0, 0.06),
            "CHEESE": new Water(this, 0xfc9803, metalMap, 0, 2.1, 0, 0.06),
            // "MACARONI": new Macaroni(this),
            "B0": new Bubble(this, metalMap, 0, 0, 0, 1, 3)
        }
        let bubPos = 2.5;
        let interBub = bubPos*Math.sin(Math.PI / 4);
        this.bubbles = [
            new Bubble(this, metalMap, 0, 0, bubPos, 0.7, 1),
            new Bubble(this, metalMap, 0, 0, -bubPos, 0.8, 0),
            new Bubble(this, metalMap, bubPos, 0, 0, 0.5, 1),
            new Bubble(this, metalMap, -bubPos, 0, 0, 0.9, 0),
            new Bubble(this, metalMap, interBub, 0, interBub, 0.6, 1),
            new Bubble(this, metalMap, interBub, 0, -interBub, 0.9, 0),
            new Bubble(this, metalMap, -interBub, 0, interBub, 0.5, 1),
            new Bubble(this, metalMap, -interBub, 0, -interBub, 0.8, 0),
            new Bubble(this, metalMap, 0, 0, 0, 0.8, 3),
            // new Bubble(this, metalMap, 0, 0, 0, 1, 3),
        ]

        let y = 1;
        let distance = 1.5;
        let macPos = 1.5;
        let interMac = macPos * Math.sin(Math.PI / 4);
        this.macaroni = [
            // new Macaroni(this, 0, y, macPos),
            // new Macaroni(this, 0, y, -macPos),
            // new Macaroni(this, macPos, y, 0),
            // new Macaroni(this, -macPos, y, 0),
            // new Macaroni(this, interMac, y, interMac),
            // new Macaroni(this, interMac, y, -interMac),
            // new Macaroni(this, -interMac, y, interMac),
            // new Macaroni(this, -interMac, y, -interMac),
            new Macaroni(this, 0, y, -distance),
            new Macaroni(this, 0, y, 0),
            new Macaroni(this, distance, y, 0),
            new Macaroni(this, distance, y, distance),
            new Macaroni(this, -distance, y, distance),
            new Macaroni(this, -distance, y, 0),
            new Macaroni(this, -distance, y, -distance),
            new Macaroni(this, distance, y, -distance),
            new Macaroni(this, 0, y, distance),
            new Macaroni(this, 0, y, -distance),
        ]

        for (let obj in this.tools) {
            this.add(this.tools[obj]);
        }
        for (let bubble of this.bubbles) {
            this.add(bubble);
        }
        for (let mac of this.macaroni) {
            this.add(mac);
        }
        // Add meshes to scene
        // const land = new Land();
        // const flower = new Flower(this);
        
        const lights = new BasicLights();
        this.add(lights);

        this.begin.bind(this);
        this.boil = this.boil.bind(this);
        this.cook = this.cook.bind(this);
        this.mix = this.mix.bind(this);


        this.begin();
        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    begin() {
        // setTimeout(() => this.tools['WATER'].state.grow = 1, 1000);

        // this.boil();
        // this.cook();

        // boil water instantly
        setTimeout(this.boil, 1000, this);
        //cook pasta afte 5 mins
        setTimeout(this.cook, 300000)

        // drain + mix after 15 mins
        setTimeout(this.mix, 900000)
        // this.mix();
        // setTimeout(this.mix, 1000)
    }

    boil() {
        // setTimeout(this.tools['WATER'].fadeIn, 1000);
        for (let bub of this.bubbles) {
            bub.begin();
        }
    }

    cook() {
        for (let mac of this.macaroni) {
            mac.drop();
        }
    }

    mix() {
        this.tools['CHEESE'].fadeIn();
        setTimeout(this.tools['SPOON'].begin, 10000);
        // this.tools['SPOON'].begin();
    }



    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default MainScene;

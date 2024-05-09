import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import Resources from "../Utils/Resources";

type LerpType = {
   current: number;
   target: number;
   ease: number;
};

export default class Cube {
   experience: Experience;
   scene: THREE.Scene;
   resources: Resources;
   lerp: LerpType;
   rotation: number;
   rectLight!: THREE.RectAreaLight;
   cubeRoom!: THREE.Object3D<THREE.Event>;
   cubeScene: THREE.Group;
   //for animations
   // mixer!: THREE.AnimationMixer;
   // swim!: THREE.AnimationAction;

   constructor() {
      this.experience = new Experience();
      this.scene = this.experience.scene;
      this.resources = this.experience.resources;
      this.cubeScene = (this.resources.items['cube'] as GLTF).scene;
      this.rotation = 0;
      //TODO: need to understand the moving camera along curves
      this.lerp = {
         current: 0,
         target: 0,
         ease: 0.1,
      };

      this.setModel();
   }

   setModel() {
      this.cubeScene.children.forEach((child: THREE.Object3D<THREE.Event>) => {
         child.castShadow = true;
         child.receiveShadow = true;

         //Threejs automatically group mesh together
         //So need to check if child is a group to add castShadow
         if (child instanceof THREE.Group) {
            child.children.forEach((groupChild) => {
               groupChild.castShadow = true;
               groupChild.receiveShadow = true;
            });
         }

         // child.scale.set(0, 0, 0);
         if (child.name === "Cube") {
            child.position.set(0, -1.5, 0);
            child.rotation.y = Math.PI / 4;
            this.cubeRoom = child;
         }

      });
      this.scene.add(this.cubeScene);
      this.cubeScene.scale.set(0.11, 0.11, 0.11);
   }

   resize() { }

   update() {
      this.lerp.current = GSAP.utils.interpolate(
         this.lerp.current,
         this.lerp.target,
         this.lerp.ease
      );
      this.cubeScene.rotation.y = this.lerp.current;
   }
}

import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap"
import GUI from "lil-gui"

export default class Environment {
   experience: Experience;
   scene: THREE.Scene;
   resources: any;
   room: any;
   sunLight!: THREE.DirectionalLight;
   ambientLight!: THREE.AmbientLight;
   gui!: GUI;

   constructor() {
      this.experience = new Experience();
      this.scene = this.experience.scene;
      this.resources = this.experience.resources;

      this.setSunlight();
      // this.setupGUI();
   }

   // setupGUI() {
   //    this.gui = new GUI()
   //    let lilGUI: any = document.querySelector(".lil-gui")
   //    // console.log(lilGUI)
   //    if (lilGUI.style) {
   //       lilGUI.style.left = "30px";
   //       lilGUI.style.right = 0;
   //    }
   // }

   setSunlight() {
      this.sunLight = new THREE.DirectionalLight("#ffffff", 2.5);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.camera.far = 20;
      this.sunLight.shadow.mapSize.set(2048, 2048);
      this.sunLight.shadow.normalBias = 0.05;

      this.sunLight.position.set(-1.5, 7, 3);
      this.scene.add(this.sunLight);

      this.ambientLight = new THREE.AmbientLight("#ffffff", 0.7);
      this.scene.add(this.ambientLight);
   }

   switchTheme(theme: string) {
      if (theme === "dark") {
         GSAP.to(this.sunLight.color, {
            r: 0.174,
            g: 0.232,
            b: 0.686,
         });
         GSAP.to(this.ambientLight.color, {
            r: 0.174,
            g: 0.232,
            b: 0.686,
         });
         GSAP.to(this.sunLight, {
            intensity: 0.78,
         });
         GSAP.to(this.ambientLight, {
            intensity: 0.78,
         });
      } else {
         GSAP.to(this.sunLight.color, {
            r: 1,
            g: 1,
            b: 1,
         });
         GSAP.to(this.ambientLight.color, {
            r: 1,
            g: 1,
            b: 1,
         });
         GSAP.to(this.sunLight, {
            intensity: 2.5,
         });
         GSAP.to(this.ambientLight, {
            intensity: 0.7,
         });
      }
   }
}
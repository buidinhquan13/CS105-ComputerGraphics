import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
   experience: Experience;
   sizes: any;
   scene: any;
   canvas: any;
   camera: any;
   renderer!: THREE.WebGLRenderer;

   constructor() {
      this.experience = new Experience();
      this.sizes = this.experience.sizes;
      this.scene = this.experience.scene;
      this.canvas = this.experience.canvas;
      this.camera = this.experience.camera.orthographicCamera;
      this.setRenderer();
   }

   setRenderer() {
      this.renderer = new THREE.WebGLRenderer({
         canvas: this.canvas,
         antialias: true
      })

      // this.renderer.physicallyCorrectLights = true;
      // this.renderer.useLegacyLights = true
      
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.CineonToneMapping;
      this.renderer.toneMappingExposure = 1.75;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(this.sizes.pixelRatio);
   }

   resize() {
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(this.sizes.pixelRatio);
   }

   update() {
      this.renderer.render(this.scene, this.camera);
   }

   switchCamera(camera: string) {
      if(camera === "perspective") {
         this.camera = this.experience.camera.perspectiveCamera
         document.querySelector('.page')?.classList.toggle('hidden', true);
         this.experience.world.controls.asscroll.disable()
      }
      else if (camera === "orthographic") {
         this.camera = this.experience.camera.orthographicCamera
         document.querySelector('.page')?.classList.toggle('hidden', false);
         this.experience.world.controls.asscroll.enable()
      }
   }
}
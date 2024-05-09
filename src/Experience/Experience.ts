// import * as THREE from "three"
import * as THREE from "three"
import Sizes from "./Utils/Sizes";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Time from "./Utils/Time";
import World from "./World/World";
import Resources from "./Utils/Resources";
import assets from "./Utils/assets";
import Theme from "./Utils/Theme";
import Preloader from "./Preloader";

export default class Experience {
   static instance: any;
   canvas: any;
   sizes!: Sizes;
   scene!: THREE.Scene;
   camera!: Camera;
   renderer!: Renderer;
   time!: Time;
   world!: World;
   resources!: Resources;
   theme!: Theme;
   preloader!: Preloader;

   constructor(canvas?: any) {
      if (Experience.instance) {
         return Experience.instance
      }

      Experience.instance = this;
      this.canvas = canvas;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf6f6f6)
      this.time = new Time();
      this.sizes = new Sizes();
      this.camera = new Camera();
      this.renderer = new Renderer();
      this.resources = new Resources(assets)
      this.theme = new Theme();
      this.world = new World();
      this.preloader = new Preloader();

      //listen on "resize" event from EventEmitter
      this.sizes.on("resize", () => {
         this.resize()
      })
      //listen on "update" event from EventEmitter
      this.time.on("update", () => {
         this.update()
      })
      this.theme.on("switch-theme", (theme) => {
         this.switchTheme(theme)
      })

      this.camera.on("switch-camera", (camera) => {
         this.switchCamera(camera);
      })
   }

   switchTheme(theme: string) {
      if (this.world.environment) {
         this.world.environment.switchTheme(theme)
         this.world.currentRoom?.switchTheme?.();
      }
   }

   switchCamera(camera: string) {
      if (this.world.environment) {
         this.renderer.switchCamera(camera)
      }
   }

   resize() {
      this.camera.resize();
      this.renderer.resize()
      this.world.resize()
   }

   update() {
      this.preloader.update();
      this.camera.update();
      this.renderer.update();
      this.world.update()
   }
}
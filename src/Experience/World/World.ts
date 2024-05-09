import * as THREE from "three";
import Experience from "../Experience";
import Room from "./Room";
import Environment from "./Environment";
import assets from "../Utils/assets";
import Controls from "./Controls";
import Floor from "./Floor";
import EventEmitter from "events";
import RoomOverview from "../Room/RoomOverview";
import Cube from "./Cube";
import BokoRoom from "../Room/BokoRoom";
import { ROOM_DATA } from "../../constant/roomTitle";
import SleepingRoom from "../Room/SleepingRoom";
import KitchenRoom from "../Room/KitchenRoom";
import LivingRoom from "../Room/LivingRoom";

export default class World extends EventEmitter {
   experience: Experience;
   room!: Room;
   sizes: any;
   scene: THREE.Scene;
   canvas: any;
   camera: any;
   resources: any;
   environment!: Environment;
   controls!: Controls;
   floor!: Floor;
   cube!: Cube;
   currentRoomIndex!: number;
   currentRoom: any;

   constructor() {
      super();
      this.experience = new Experience();
      this.sizes = this.experience.sizes;
      this.scene = this.experience.scene;
      this.canvas = this.experience.canvas;
      this.camera = this.experience.camera;
      this.resources = this.experience.resources;

      this.resources.on("ready", () => {
         this.environment = new Environment();
         this.floor = new Floor();
         this.cube = new Cube();
         // Disable scroll when in homepage
         if (document.querySelector("body")) {
            (document.querySelector("body") as HTMLElement).style.overflow =
               "hidden";
         }
         this.emit("worldready");
      });

      this.on("changehomepage", () => {
         window.scrollTo(0, 0)
         if (document.querySelector("body")) {
            (document.querySelector("body") as HTMLElement).style.overflow =
               "hidden";
         }
         this.currentRoom = new RoomOverview(this.currentRoomIndex);
      });

      this.on("showroom", (roomIndex: number) => {
         if (this.controls) {
            this.controls.clearSmoothScroll();
         }
         this.currentRoomIndex = roomIndex;
         if (document.querySelector(".section-description") != null) {
            document.querySelector(".section-description")!.innerHTML =
               ROOM_DATA[this.currentRoomIndex].description;
         }
         // The first room in assets is a cube. Room layout start from 1.
         switch (this.currentRoomIndex + 1) {
            case 1:
               this.currentRoom = new SleepingRoom();
               break;
            case 2:
               this.currentRoom = new BokoRoom();
               break;
            case 3:
               this.currentRoom = new KitchenRoom();
               break;
            case 4:
               this.currentRoom = new LivingRoom();
               break;
            default:
               this.currentRoom = new BokoRoom();
         }
         this.room = new Room(assets[this.currentRoomIndex + 1].name);
         this.controls = new Controls();
         this.currentRoom.emit("done-loading-room");
      });
   }

   resize() { }

   update() {
      if (this.room) {
         this.room.update();
      }
      if (this.controls) {
         this.controls.update();
      }
   }
}

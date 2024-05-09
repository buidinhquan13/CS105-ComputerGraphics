import { EventEmitter } from "events";
import * as THREE from "three";
import GSAP from "gsap";
import Experience from "./Experience";
import convertDivToSpan from "./Utils/convertDivToSpan";
import Sizes from "./Utils/Sizes";
import World from "./World/World";

export default class Preloader extends EventEmitter {
	private experience;
	private sizes: Sizes;
	private world: World;
	private cubeScene?: THREE.Group;
	private cubeRoom?: THREE.Object3D<THREE.Event>;
	// Store queue animation and excute by time line
	private timeline?: gsap.core.Timeline;
	private device: string;
	currentRoomScene: any;

	constructor() {
		super();
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.world = this.experience.world;
		this.device = this.sizes.device;

		this.sizes.on("switchdevice", (device: string) => {
			this.device = device;
		});

		this.world.on("worldready", () => {
			this.setAssets();
			this.playIntro();
		});
	}

	setAssets() {
		convertDivToSpan(document.querySelector(".intro-text"));
		convertDivToSpan(document.querySelector(".room-title"));
		convertDivToSpan(document.querySelector(".hero-main-title"));
		convertDivToSpan(document.querySelector(".hero-main-description"));
		convertDivToSpan(document.querySelector(".first-sub"));
		convertDivToSpan(document.querySelector(".second-sub"));

		this.cubeScene = this.world.cube.cubeScene;
		this.cubeRoom = this.world.cube.cubeRoom;
	}

	async playIntro() {
		window.scroll(0, 0)
		await this.firstIntro();
		if (this.cubeRoom) {
			this.cubeRoom.rotation.y = Math.PI / 4;
		}

		this.world.emit("changehomepage");
	}

	firstIntro() {
		return new Promise((resolve) => {
			if (!this.cubeRoom || !this.cubeScene) return;
			this.timeline = GSAP.timeline();
			this.timeline.to(".preloader", {
				opacity: 0,
				delay: 1,
				onComplete: () => {
					document.querySelector(".preloader")?.classList.add("hidden");
				},
			});
			if (this.device === "desktop") {
				this.timeline
					.to(
						this.cubeRoom.scale,
						{
							x: 1.4,
							y: 1.4,
							z: 1.4,
							ease: "back.out(2.5)",
							duration: 0.7,
						},
						"init"
					)
					.to(
						this.cubeRoom.position,
						{
							x: 0.638711,
							y: -1.15,
							z: 1.3243,
						},
						"init"
					)
					.to(this.cubeScene.position, {
						x: -1,
						ease: "power1.out",
						duration: 0.7,
					});
			} else {
				this.timeline
					.to(this.cubeRoom.scale, {
						x: 1.4,
						y: 1.4,
						z: 1.4,
						ease: "back.out(2.5)",
						duration: 0.7,
					})
					.to(this.cubeScene.position, {
						z: -1,
						ease: "power1.out",
						duration: 0.7,
					});
			}
			this.timeline
				.to(".intro-text .animatedis", {
					yPercent: -100,
					stagger: 0.05,
					ease: "back.out(1.7)",
				})
				.to(
					".intro-text .animatedis",
					{
						yPercent: 100,
						stagger: 0.05,
						ease: "back.in(1.7)",
					},
					"+=1"
				)
				.to(
					this.cubeScene.position,
					{
						x: 0,
						y: 0,
						z: 0,
						ease: "power1.out",
						onComplete: () => {
							document.querySelector(".intro")?.classList.add("hidden");
						},
					},
					"same"
				)
				.to(
					this.cubeRoom.scale,
					{
						x: 5,
						y: 5,
						z: 5,
					},
					"same"
				)
				.to(
					this.cubeRoom.position,
					{
						x: 0.638711,
						y: 2.5,
						z: 1.3243,
						onComplete: resolve,
					},
					"same"
				);
		});
	}

	resize() {}

	update() {
		// if (this.moveFlag) {
		// 		this.move();
		// }
	}
}

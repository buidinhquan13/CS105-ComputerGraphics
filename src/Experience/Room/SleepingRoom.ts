import { EventEmitter } from "events";
import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience";

export default class SleepingRoom extends EventEmitter {
	private experience;
	private timeline: gsap.core.Timeline;
	roomChildren!: { [key in string]: THREE.Object3D<THREE.Event> };
	cube: THREE.Object3D<THREE.Event>;
	backEvent!: () => void;
	spotLightLeft!: THREE.SpotLight;
	spotLightRight!: THREE.SpotLight;

	constructor() {
		super();
		this.experience = new Experience();
		this.timeline = GSAP.timeline();
		// this.setAssets();
		this.cube = this.experience.world.cube.cubeRoom;
		this.on("done-loading-room", () => {
			this.roomChildren = this.experience.world.room.roomChildren;
			const intensity = 5;
			this.spotLightLeft = new THREE.SpotLight(
				0xffffff,
				intensity,
				1,
				Math.PI / 2,
				1
			);
			this.spotLightLeft.position.set(0, 2, 0);
			this.spotLightLeft.target.position.set(-0.8, 0, 0.2);
			this.spotLightRight = new THREE.SpotLight(
				0xffffff,
				intensity,
				1,
				Math.PI / 2,
				1
			);
			this.spotLightRight.position.set(-0.2, 2, -19);
			this.spotLightRight.target.position.set(0, 0, -0.5);
			this.switchTheme();
			this.spotLightLeft.target.updateMatrixWorld();
			this.spotLightRight.target.updateMatrixWorld();
			this.roomChildren.lamp_base.add(this.spotLightLeft);
			this.roomChildren.lamp_base.add(this.spotLightRight);

			this.playLoadingRoom();
			this.attachBackEvent();
		});
	}

	playLoadingRoom() {
		window.removeEventListener(
			"mousemove",
			this.experience.world.room.mouseMoveEvent
		);
		document.querySelector(".btn-back")?.classList.toggle("hidden", false);
		document
			.querySelector(".toggle-bar-camera")
			?.classList.toggle("hidden", false);
		this.timeline
			.set(this.experience.world.room.actualRoom.scale, {
				x: 0.25,
				y: 0.25,
				z: 0.25,
			})
			.set(this.roomChildren.room.scale, {
				x: 4,
				y: 4,
				z: 4,
			})
			.to(this.cube.scale, {
				x: 0,
				y: 0,
				z: 0,
				duration: 1,
			})
			.to(
				".hero-main-title .animatedis",
				{
					yPercent: -100,
					stagger: 0.07,
					ease: "back.out(1.7)",
				},
				"introtext"
			)
			.to(
				".hero-main-description .animatedis",
				{
					yPercent: -100,
					stagger: 0.07,
					ease: "back.out(1.7)",
				},
				"introtext"
			)
			.to(
				".first-sub .animatedis",
				{
					yPercent: -100,
					stagger: 0.07,
					ease: "back.out(1.7)",
				},
				"introtext"
			)
			.to(
				".second-sub .animatedis",
				{
					yPercent: -100,
					stagger: 0.07,
					ease: "back.out(1.7)",
					onComplete: () => {
						document.querySelector("body")!.style.overflow = "scroll";
					},
				},
				"introtext"
			)
			.to(
				this.roomChildren.frame.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.hexagon.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.blanket.scale,
				{
					x: 0.912741,
					y: 0.912741,
					z: 0.912741,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.4"
			)
			.to(
				this.roomChildren.lamp_base.scale,
				{
					x: 0.278656,
					y: 0.278656,
					z: 0.278656,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.3"
			)
			.to(
				this.roomChildren.matress.scale,
				{
					x: 0.912741,
					y: 0.912741,
					z: 0.912741,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.2"
			)
			.to(
				this.roomChildren.nightstand_table.scale,
				{
					x: 0.852012,
					y: 0.852012,
					z: 0.852012,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.1"
			)
			.to(
				this.roomChildren.wardrobe.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.1"
			)
			.to(".btn-back", {
				opacity: 1,
				duration: 0.5,
				pointerEvents: "auto",
				cursor: "pointer",
				onComplete: () => {
					window.addEventListener(
						"mousemove",
						this.experience.world.room.mouseMoveEvent
					);
				},
			});
	}

	attachBackEvent() {
		this.backEvent = this.backToHomePage.bind(this);
		document
			.querySelector(".btn-back")
			?.addEventListener("click", this.backEvent);
	}

	backToHomePage() {
		document
			.querySelector(".btn-back")
			?.removeEventListener("click", this.backEvent);
		document
			.querySelector(".toggle-bar-camera")
			?.classList.toggle("hidden", true);
		this.timeline
			.to(this.cube.scale, {
				x: 10,
				y: 10,
				z: 10,
			})
			.set(this.roomChildren.room.scale, {
				x: 0,
				y: 0,
				z: 0,
			})
			.to(
				".hero-main-title .animatedis",
				{
					yPercent: 100,
					stagger: 0.07,
					ease: "back.in(1.7)",
				},
				"introtext"
			)
			.to(
				".hero-main-description .animatedis",
				{
					yPercent: 100,
					stagger: 0.07,
					ease: "back.in(1.7)",
				},
				"introtext"
			)
			.to(
				".first-sub .animatedis",
				{
					yPercent: 100,
					stagger: 0.07,
					ease: "back.in(1.7)",
				},
				"introtext"
			)
			.to(
				".second-sub .animatedis",
				{
					yPercent: 100,
					stagger: 0.07,
					ease: "back.in(1.7)",
				},
				"introtext"
			)
			.to(".btn-back", {
				opacity: 0,
				duration: 0.5,
				pointerEvents: "none",
				cursor: "none",
				// pointerEvents: 'auto',
				onComplete: () => {
					this.experience.world.room.clearRoom();
					window.removeEventListener(
						"mousemove",
						this.experience.world.room.mouseMoveEvent
					);
					document.querySelector(".btn-back")?.classList.toggle("hidden", true);
					document.querySelector("body")!.style.overflow = "hidden";
					this.experience.world.emit("changehomepage");
					this.spotLightLeft.dispose();
					this.spotLightRight.dispose();
				},
			});
	}

	switchTheme() {
		const theme = this.experience.theme.theme;
		if (theme === "dark") {
			this.spotLightLeft.power = 15.707963267948966;
			this.spotLightRight.power = 15.707963267948966;
		} else {
			this.spotLightLeft.power = 0;
			this.spotLightRight.power = 0;
		}
	}
}

import { EventEmitter } from "events";
import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience";

export default class KitchenRoom extends EventEmitter {
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
			this.loadingRoom();
			const intensity = 3;
			this.spotLightLeft = new THREE.SpotLight(
				0xffffff,
				1,
				10,
				Math.PI / 3,
				1,
			);
			this.spotLightLeft.position.set(-2.5, -2, 1);
			this.spotLightLeft.target.position.set(0, 0, 0);
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
			this.roomChildren.lamp.add(this.spotLightLeft);
			this.roomChildren.lamp.add(this.spotLightRight);
			// Kitchen room is special case so need special init.
			this.playLoadingRoom();
			this.attachBackEvent();
		});
	}

	loadingRoom() {
		this.roomChildren.room.children.forEach((child) => {
			if (child.name !== "floor" && child.name !== "tiles") {
				child.castShadow = true;
				child.receiveShadow = true;
				child.scale.set(0, 0, 0);
				this.roomChildren[child.name.toLowerCase()] = child;
			}
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
				x: 4.15903,
				y: 4.08559,
				z: 3.88764,
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
				this.roomChildren.cabinet_base.scale,
				{
					x: 0.6844120025634766,
					y: 0.05777336657047272,
					z: 0.23209086060523987,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.cabinet.scale,
				{
					x: 0.1963675618171692,
					y: 0.23885568976402283,
					z: 0.2601439356803894,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.3"
			)
			.to(
				this.roomChildren.refrigerator.scale,
				{
					x: 0.23139269649982452,
					y: 0.8231937885284424,
					z: 0.2040671408176422,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.sink.scale,
				{
					x: 0.4938393831253052,
					y: 0.5283124446868896,
					z: 0.502716600894928,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.shower_wash.scale,
				{
					x: 0.14510686695575714,
					y: 0.13563841581344604,
					z: 0.13807669281959534,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.cabinet_top.scale,
				{
					x: 0.17482686042785645,
					y: 0.29522740840911865,
					z: 0.16983194649219513,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.2"
			)
			.to(
				this.roomChildren.chimney_hood.scale,
				{
					x: 0.4938393831253052,
					y: 0.5283124446868896,
					z: 0.502716600894928,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.furniture.scale,
				{
					x: 0.49987325072288513,
					y: 0.5283124446868896,
					z: 0.4967174232006073,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.1"
			)
			.to(
				this.roomChildren.top_furniture.scale,
				{
					x: 0.06139949709177017,
					y: 0.04393605887889862,
					z: 0.07384390383958817,
					ease: "back.out(2.2)",
					duration: 0.5,
				},
				">-0.5"
			)
			.to(
				this.roomChildren.lamp.scale,
				{
					x: 0.05832960456609726,
					y: 0.08041601628065109,
					z: 0.05937815085053444,
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
		// Enable to fix bug shadow when scale big cube
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

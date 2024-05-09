import { EventEmitter } from "events";
import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience";
import Wall from "../World/Wall";
import { ROOM_DATA } from "../../constant/roomTitle";

export default class RoomOverview extends EventEmitter {
	private experience;
	private scene: THREE.Scene;
	private timeline?: gsap.core.Timeline;
	wall!: Wall;
	cube: THREE.Object3D<THREE.Event>;
	private holdStartX: number;
	private isMoving: boolean;
	private currentRoomIndex: number;
	clickShowRoomEvent: (() => void) | undefined;
	rotateMouseDownEvent!: (event: MouseEvent) => void;
	rotateMouseMoveEvent!: (event: MouseEvent) => void;
	rotateMouseUpEvent!: (event: MouseEvent) => void;

	constructor(currentRoomIndex: number = 0) {
		super();
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.timeline = GSAP.timeline();
		this.cube = this.experience.world.cube.cubeRoom;
		this.isMoving = false;
		// Need minus because negative room index is start from left to right, otherwise it start from right to left.
		this.currentRoomIndex = -currentRoomIndex;
		this.holdStartX = 0;
		this.setAssets();
	}

	async setAssets() {
		this.wall = new Wall();
		this.wall.plane.scale.setY(0);
		this.updateRoomChoiceIndex();
		await this.introRoomTitle();
		this.attachClickEvent();
		this.attachRotateEvent();
	}

	rotateCube() {
		const rotationDistance = Math.PI / 4;
		if (!this.isMoving) {
			this.timeline?.to(this.cube.rotation, {
				y: (2 * this.currentRoomIndex + 1) * rotationDistance,
				ease: "power1.out",
				duration: 1,
				onComplete: () => {
					this.isMoving = false;
				},
			});
			this.isMoving = true;
		}
	}

	rotateMouseDown(event: MouseEvent) {
		const targetClass = (event.target as Element).className;
		if (
			targetClass.includes("room-choice") ||
			targetClass.includes("btn-show-room")
		)
			return;
		this.holdStartX = event.clientX;
		document.addEventListener("mousemove", this.rotateMouseMoveEvent);
	}

	rotateMouseMove(event: MouseEvent) {
		if (this.isMoving) return;
		const holdSwipeDistance = event.clientX - this.holdStartX;
		this.holdStartX = event.clientX;
		this.cube.rotation.y -= holdSwipeDistance / (window.innerWidth / 2);
	}

	rotateMouseUp(event: MouseEvent) {
		const targetClass = (event.target as Element).className;
		if (
			targetClass.includes("room-choice") ||
			targetClass.includes("btn-show-room")
		)
			return;
		document.removeEventListener("mousemove", this.rotateMouseMoveEvent, false);
		this.currentRoomIndex = Math.round(
			(Math.round(this.cube.rotation.y / (Math.PI / 4)) - 1) / 2
		);
		this.updateRoomChoiceIndex();
		this.rotateCube();
	}

	attachRotateEvent() {
		this.rotateMouseDownEvent = this.rotateMouseDown.bind(this);
		this.rotateMouseMoveEvent = this.rotateMouseMove.bind(this);
		this.rotateMouseUpEvent = this.rotateMouseUp.bind(this);

		document.addEventListener("mousedown", this.rotateMouseDownEvent);
		document.addEventListener("mouseup", this.rotateMouseUpEvent);
	}

	introRoomTitle() {
		new Promise((resolve) => {
			document
				.querySelector(".room-choice-container")
				?.classList.toggle("hidden", false);
			document
				.querySelector(".btn-show-room")
				?.classList.toggle("hidden", false);
			document.querySelector(".room-title")?.classList.toggle("hidden", false);
			this.timeline
				?.to(
					this.cube.scale,
					{
						x: 5,
						y: 5,
						z: 5,
					},
					"cube init"
				)
				.to(
					this.cube.position,
					{
						x: 0.638711,
						y: 2.5,
						z: 1.3243,
					},
					"cube init"
				)
				.to(
					this.experience.camera.orthographicCamera.position,
					{
						y: 5.65,
					},
					"cube init"
				)
				.to(
					this.wall.plane.scale,
					{
						y: 1,
						ease: "back.out(2.5)",
						duration: 0.7,
					},
					"cube init"
				)
				.to(
					".room-title",
					{
						opacity: 1,
						duration: 0.5,
					},
					"title"
				)
				.to(
					".room-choice-container",
					{
						opacity: 1,
						duration: 0.5,
					},
					"title"
				)
				.to(
					".btn-show-room",
					{
						opacity: 1,
						duration: 0.5,
						onComplete: resolve,
					},
					"title"
				);
		});
	}

	attachClickEvent() {
		const rooms = document.querySelectorAll(".room-choice");
		rooms.forEach((room, index) => {
			room.addEventListener("click", () => {
				if (this.isMoving) return;
				const roomDirection = Math.sign(this.currentRoomIndex) || -1;
				const additionRoomIndex =
					(this.currentRoomIndex > 0
						? Math.floor(this.currentRoomIndex - 1 / rooms.length)
						: Math.ceil(this.currentRoomIndex / rooms.length)) * rooms.length;
				// Room index should change before adding addition index (addition index to change cube smoothy)
				const roomIndexShouldChange =
					this.currentRoomIndex > 0 ? rooms.length - index : index;
				this.currentRoomIndex =
					additionRoomIndex + roomDirection * roomIndexShouldChange;
				this.rotateCube();
				this.updateRoomChoiceIndex();
			});
		});
		this.clickShowRoomEvent = this.clickShowRoom.bind(this, rooms);
		document
			.querySelector(".btn-show-room")
			?.addEventListener("click", this.clickShowRoomEvent);
	}

	clickShowRoom(rooms: NodeListOf<Element>) {
		if (this.clickShowRoomEvent) {
			document
				.querySelector(".btn-show-room")
				?.removeEventListener("click", this.clickShowRoomEvent);
		}
		const roomIndex =
			this.currentRoomIndex % rooms.length > 0
				? rooms.length - (this.currentRoomIndex % rooms.length)
				: Math.abs(this.currentRoomIndex % rooms.length);
		new Promise((resolve) => {
			this.timeline
				?.to(
					".room-choice-container",
					{
						opacity: 0,
						duration: 0,
						onComplete: () => {
							this.scene.remove(this.wall.plane);
						},
					},
					"disable room overview control"
				)
				.to(
					".room-choice-container",
					{
						opacity: 0,
						onComplete: () => {
							document
								.querySelector(".room-choice-container")
								?.classList.toggle("hidden", true);
						},
					},
					"disable room overview control"
				)
				.to(
					".btn-show-room",
					{
						opacity: 0,
						onComplete: () => {
							document
								.querySelector(".btn-show-room")
								?.classList.toggle("hidden", true);
						},
					},
					"disable room overview control"
				)
				.to(
					".room-title",
					{
						opacity: 0,
						onComplete: () => {
							document
								.querySelector(".room-title")
								?.classList.toggle("hidden", true);
						},
					},
					"disable room overview control"
				)
				.to(this.cube.scale, {
					x: 5,
					y: 5,
					z: 5,
					duration: 0.1,
				})
				.to(
					this.cube.scale,
					{
						x: 10,
						y: 10,
						z: 10,
						duration: 1,
					},
					"same"
				)
				.to(
					this.experience.camera.orthographicCamera.position,
					{
						y: 6.5,
					},
					"same"
				)
				.to(
					this.cube.position,
					{
						x: 0.638711,
						y: 8.5618,
						z: 1.3243,
						onComplete: resolve,
					},
					"same"
				);
		}).then(() => {
			this.experience.world.emit("showroom", roomIndex);
			document.removeEventListener("mousedown", this.rotateMouseDownEvent);
			document.removeEventListener("mouseup", this.rotateMouseUpEvent);
			rooms.forEach((_, index) => {
				rooms[index].replaceWith(rooms[index].cloneNode(true));
			});
		});
	}

	updateRoomChoiceIndex() {
		const rooms = document.querySelectorAll(".room-choice");
		document
			.querySelector(".room-choice.active")
			?.classList.toggle("active", false);
		/**
		 * Because cube rotation left to right is anti-clockwise
		 * -> swipe from left to right to have choice swap from left to right => current room index is negative => Convert to positive to use to swap from left to right
		 * -> swipe from right to left to have choice swap from right to left => current room index is positive => Minus with room length to swap right to left
		 */
		const roomIndex =
			this.currentRoomIndex % rooms.length > 0
				? rooms.length - (this.currentRoomIndex % rooms.length)
				: Math.abs(this.currentRoomIndex % rooms.length);
		rooms[roomIndex].classList.toggle("active", true);
		if (document.querySelector(".room-title")) {
			document.querySelector(".room-title")!.textContent =
				ROOM_DATA[roomIndex].title;
		}
		const cubeMesh = this.cube.children[0] as THREE.Mesh;
		const cubeMeshSpecialFace = this.cube.children[1] as THREE.Mesh;
		const cubeMaterial = cubeMesh.material as THREE.MeshBasicMaterial;
		const cubeMaterialSpecialFace =
			cubeMeshSpecialFace.material as THREE.MeshBasicMaterial;
		if (cubeMaterial?.color && cubeMaterialSpecialFace?.color) {
			cubeMaterial.color = new THREE.Color(ROOM_DATA[roomIndex].color);
			cubeMaterialSpecialFace.color = new THREE.Color(
				ROOM_DATA[roomIndex].color
			);
		}
		const planeMaterial = this.wall.plane.material as THREE.MeshBasicMaterial;
		if (planeMaterial?.color) {
			planeMaterial.color = new THREE.Color(ROOM_DATA[roomIndex].bannerColor);
		}
	}
}

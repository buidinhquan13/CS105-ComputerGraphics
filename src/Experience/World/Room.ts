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

export default class Room {
	experience: Experience;
	scene: THREE.Scene;
	resources: Resources;
	room: GLTF;
	lerp: LerpType;
	rotation: number;
	rectLight!: THREE.RectAreaLight;
	actualRoom: THREE.Group;
	roomChildren: { [key in string]: THREE.Object3D<THREE.Event> };
	mouseMoveEvent!: (event: MouseEvent) => void;
	//for animations
	// mixer!: THREE.AnimationMixer;
	// swim!: THREE.AnimationAction;

	constructor(roomName: string) {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.room = this.resources.items[roomName];
		this.actualRoom = this.room.scene;
		this.roomChildren = {};
		this.rotation = 0;
		//TODO: need to understand the moving camera along curves
		this.lerp = {
			current: 0,
			target: 0,
			ease: 0.1,
		};
		
		this.setModel();
		this.onMouseMove();
		// this.setAnimation();
	}

   setModel() {
      // console.log(this.actualRoom)
		this.actualRoom.children.forEach((child: THREE.Object3D<THREE.Event>) => {
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

			this.addChildrenShadow(child)

			//only specific for room_01
			// if (child.name === "Aquarium") {
			// 	const aquarium = child.children[0] as THREE.Mesh;
			// 	aquarium.material = new THREE.MeshPhysicalMaterial();
			// 	const aquariumMaterial =
			// 		aquarium.material as THREE.MeshPhysicalMaterial;
			// 	aquariumMaterial.roughness = 0;
			// 	aquariumMaterial.color.set(0x549dd2);
			// 	aquariumMaterial.ior = 3;
			// 	aquariumMaterial.transmission = 1;
			// 	aquariumMaterial.opacity = 1;
			// 	aquariumMaterial.depthWrite = false;
			// 	aquariumMaterial.depthTest = false;

			// 	this.setupAreaLight(child);
			// }

			child.scale.set(0, 0, 0);

			this.roomChildren[child.name.toLowerCase()] = child;
		});

		this.actualRoom.scale.set(0.11, 0.11, 0.11);
		this.scene.add(this.actualRoom);
	}

	onMouseMove() {
		this.mouseMoveEvent = ((event: MouseEvent) => {
			const width = window.innerWidth;
			this.rotation = ((event.clientX - width / 2) * 2) / width;
			this.lerp.target = this.rotation * 0.15;
		}).bind(this);

		window.addEventListener("mousemove", this.mouseMoveEvent);
	}

	// setAnimation() {
	//     console.log(this.room)
	//     this.mixer = new THREE.AnimationMixer(this.room);
	//     this.swim = this.mixer.clipAction(this.room.animations[0])
	//     this.swim.play()
	// }

	resize() {}

	update() {
		this.lerp.current = GSAP.utils.interpolate(
			this.lerp.current,
			this.lerp.target,
			this.lerp.ease
		);
		this.actualRoom.rotation.y = this.lerp.current;
		// this.mixer.update(this.experience.time.delta)
	}

	clearRoom() {
		this.scene.remove(this.actualRoom)
		// this.roomChildren.aquarium.remove(this.roomChildren.rectLight)
	}

	addChildrenShadow(child: THREE.Object3D<THREE.Event>) {
		return child?.children.forEach((childOfChild) => {
			if(childOfChild.children.length > 0) {
				this.addChildrenShadow(childOfChild);
			}
			childOfChild.receiveShadow = true;
			childOfChild.castShadow = true;
			return;
		})

	}
}

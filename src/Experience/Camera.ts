import * as THREE from "three";
import Experience from "./Experience";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EventEmitter } from "events";

export default class Camera extends EventEmitter {
	experience: Experience;
	sizes: any;
	scene: any;
	canvas: any;

	perspectiveCamera!: THREE.PerspectiveCamera;
	orthographicCamera!: THREE.OrthographicCamera;
	controls: OrbitControls;
	toggleButton: any;
	toggleCircle: any;
	camera: string;

	// helper!: THREE.CameraHelper;

	constructor() {
		super();

		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
		this.camera = "orthographic";
		this.toggleButton = document.querySelector(
			".toggle-bar-camera .toggle-button"
		);
		this.toggleCircle = document.querySelector(
			".toggle-bar-camera .toggle-button .toggle-circle"
		);
		this.createPerspectiveCamera();
		this.createOrthographicCamera();
		this.setOrbitControls();
		this.setEventListeners();
	}
	//
	createPerspectiveCamera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35,
			this.sizes.aspect,
			0.1,
			1000
		);
		this.perspectiveCamera.position.y = 5.65;
		this.perspectiveCamera.position.z = 10;
		this.scene.add(this.perspectiveCamera);
	}

	createOrthographicCamera() {
		this.orthographicCamera = new THREE.OrthographicCamera(
			(-this.sizes.aspect * this.sizes.frustrum) / 2,
			(this.sizes.aspect * this.sizes.frustrum) / 2,
			this.sizes.frustrum / 2,
			-this.sizes.frustrum / 2,
			-50,
			50
		);
		// this.orthographicCamera.position.x
		this.orthographicCamera.position.y = 5.65;
		this.orthographicCamera.position.z = 10;
		// this.orthographicCamera.position.y = 4
		// this.orthographicCamera.position.z = 5
		this.orthographicCamera.rotation.x = -Math.PI / 6;
		this.scene.add(this.orthographicCamera);

		// const gridHelper = new THREE.GridHelper(20, 20);
		// this.scene.add(gridHelper);

		// const axesHelper = new THREE.AxesHelper(5);
		// this.scene.add(axesHelper);
	}

	setOrbitControls() {
		this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
		this.controls.enableDamping = true;
		this.controls.enableZoom = true;
		this.controls.maxDistance = 15;
		this.controls.maxPolarAngle = 1.5;
	}

	setEventListeners() {
		this.toggleButton.addEventListener("click", () => {
			this.camera =
				this.camera === "perspective" ? "orthographic" : "perspective";
			this.toggleCircle.classList.toggle("slide");

			//  let bodyEl = document.body
			//  bodyEl.className = this.camera
			//pass this.theme to the callback
			this.emit("switch-camera", this.camera);
		});
	}

	resize() {
		//Update Perspective Camera on resize
		this.perspectiveCamera.aspect = this.sizes.aspect;
		this.perspectiveCamera.updateProjectionMatrix();

		//Update Orthographic Camera on resize
		this.orthographicCamera.left =
			(-this.sizes.aspect * this.sizes.frustrum) / 2;
		this.orthographicCamera.right =
			(this.sizes.aspect * this.sizes.frustrum) / 2;
		this.orthographicCamera.top = this.sizes.frustrum / 2;
		this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
		this.orthographicCamera.updateProjectionMatrix();
	}

	update() {
		// console.log(this.perspectiveCamera.position);
		this.controls.update();

		// this.helper.matrixWorldNeedsUpdate = true;
		// this.helper.update();
		// this.helper.position.copy(this.orthographicCamera.position);
		// this.helper.rotation.copy(this.orthographicCamera.rotation);
	}
}

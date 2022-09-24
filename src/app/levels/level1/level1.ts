import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Color3, Axis, Space } from '@babylonjs/core/Maths/math';
import { CubeTexture } from '@babylonjs/core/Materials';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { SceneLoader } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes';

import '@babylonjs/loaders/glTF'; // Side Effect Only
import '../../../assets/glb/floor_and_coin.glb'; // Side Effect Only
import pbrenv from '../../../assets/env/northshore.env';
import { GameEnum } from '../../enum/game.enum';

export class Level1 {
	public canvas: any;
	public scene: any;
	public mesh: any;
	public coin: Mesh;

	private elapsedTime = 0;
	private bopSpeed = 0.003;
	private bopRange = 0.05;
	private rotateSpeed = 0.01;

	constructor() {
		this.canvas = document.getElementById(GameEnum.GAME_CANVAS_NAME);
	}

	private addCamera(scene: any): void {
		const camera = new ArcRotateCamera(
			'FreeCamera',
			-Math.PI / 2,
			1.4,
			1,
			new Vector3(0, 0, 0),
			scene
		);

		camera.wheelPrecision = 120;
		camera.minZ = 0.1;
		camera.panningSensibility = 0;

		scene.activeCamera = camera;
		scene.activeCamera.attachControl(this.canvas, true);
	}

	private addLight(scene: any): void {
		// Hemispheric Light
		const light = new HemisphericLight('hemiLight', new Vector3(-1, 1, 0), scene);
		light.diffuse = Color3.FromHexString('#cccccc');
		light.specular = Color3.FromHexString('#000000');
		light.groundColor = Color3.FromHexString('#cccccc');
		light.intensity = 0.5;

		// Directional Light
		const dlight = new DirectionalLight(GameEnum.MAIN_LIGHT, new Vector3(-1, -2, -1), scene);
		dlight.position = new Vector3(20, 40, 20);
		dlight.diffuse = Color3.FromHexString('#ffffff');
		dlight.intensity = 1.2;
	}

	private addPbrEnvironment(scene: any): void {
		const hdrTexture = CubeTexture.CreateFromPrefilteredData(pbrenv, scene);
		scene.environmentTexture = hdrTexture;
	}

	public start(scene: any): void {
		this.scene = scene;

		this.addCamera(scene);
		this.addLight(scene);
		this.addPbrEnvironment(scene);

		SceneLoader.ImportMesh(
			'',
			'assets/glb/',
			'floor_and_coin.glb',
			this.scene,
			(meshes: any, particleSystems: any, skeletons: any) => {
				this.mesh = meshes[0];
				this.coin = scene.getMeshById('coin1');
			}
		);
	}

	private bopUpDownAnimation(dt: number): void {
		const y = this.bopRange * Math.sin(this.bopSpeed * this.elapsedTime);

		if (this.coin) {
			// Rotate coin
			this.coin.rotate(Axis.Y, (Math.PI / 2) * this.rotateSpeed, Space.WORLD);

			// Bop coin
			this.coin.position = new Vector3(this.coin.position.x, y, this.coin.position.z);
		}

		this.elapsedTime += dt;
	}

	public update(dt: number): void {
		this.bopUpDownAnimation(dt);
	}
}

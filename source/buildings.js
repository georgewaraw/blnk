import {
	Mesh,
	Geometry,
	BoxGeometry,
	VideoTexture,
	MeshBasicMaterial
} from "three";
import { Utility } from "utility";
import { Shader } from "shader";

const attributes = [
	// north
	// 		front
	// 			center
	{ dimensions: [20, 120, 20], translation: [0, 0, -100] },
	// 			right
	{ dimensions: [40, 100, 20], translation: [40, -10, -100] },
	// 			left
	{ dimensions: [40, 80, 20], translation: [-40, -20, -100] },
	// 		back
	// 			center
	{ dimensions: [100, 80, 20], translation: [0, -20, -120] },
	// 			right
	{ dimensions: [20, 120, 20], translation: [40, 0, -120] },
	// 			left
	{ dimensions: [40, 100, 20], translation: [-40, -10, -120] },
	// south
	// 		front
	// 			center
	{ dimensions: [40, 100, 20], translation: [40, -10, 100] },
	// 			right
	{ dimensions: [40, 80, 20], translation: [-40, -20, 100] },
	// 			left
	{ dimensions: [20, 120, 20], translation: [0, 0, 100] },
	// 		back
	// 			center
	{ dimensions: [100, 80, 20], translation: [0, -20, 120] },
	// 			right
	{ dimensions: [40, 100, 20], translation: [-40, -10, 120] },
	// 			left
	{ dimensions: [20, 120, 20], translation: [40, 0, 120] },
	// east
	// 		front
	// 			center
	{ dimensions: [20, 240, 120], translation: [100, 0, 0] },
	// 			right
	{ dimensions: [20, 200, 240], translation: [100, -20, 80] },
	// 			left
	{ dimensions: [20, 160, 240], translation: [100, -40, -80] },
	// 		back
	// 			center
	{ dimensions: [20, 160, 360], translation: [120, -40, 0] },
	// 			right
	{ dimensions: [20, 240, 120], translation: [120, 0, 80] },
	// 			left
	{ dimensions: [20, 200, 240], translation: [120, -20, -80] },
	// west
	// 		front
	// 			center
	{ dimensions: [20, 200, 240], translation: [-100, -20, 80] },
	// 			right
	{ dimensions: [20, 160, 240], translation: [-100, -40, -80] },
	// 			left
	{ dimensions: [20, 240, 120], translation: [-100, 0, 0] },
	// 		back
	// 			center
	{ dimensions: [20, 160, 360], translation: [-120, -40, 0] },
	// 			right
	{ dimensions: [20, 200, 240], translation: [-120, -20, -80] },
	// 			left
	{ dimensions: [20, 240, 120], translation: [-120, 0, 80] }
];


const buildings = new Mesh( new Geometry() );

attributes
	.map( (e) => new BoxGeometry(...e.dimensions).translate(...e.translation) )
	.map( (e) => buildings.geometry.merge(e) );


buildings.initialize = Utility.once( (videos) => (
	
	buildings.material = videos
		.map( (e) => new VideoTexture(e) )
		.map( (e, i) => Shader.set(
			new MeshBasicMaterial({
				transparent: true,
				opacity: 0,
				map: e
			}),
			{
				uTime: 0,
				uSpeed: 1,
				uMorph: 1,
				uDistort: 20
			},
			`building_${i}`
		)),
	buildings.geometry.faces.map( (e) => e.materialIndex = Utility.random(buildings.material.length) )
));

buildings.fadeIn = Utility.once(() => buildings.material.map((e) => Utility.animate(
	0,
	0.8,
	2000,
	(v) => e.opacity = v
)));

buildings.rotate = (time) => buildings.rotation.y = time/50;


export { buildings };

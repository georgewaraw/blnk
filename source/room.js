import {
	Mesh,
	BoxGeometry,
	MeshPhongMaterial,
	BackSide,
	VideoTexture,
	DoubleSide
} from "three";
import { Utility } from "utility";
import { Shader } from "shader";

const uniforms = {
	uTime: 0,
	uSpeed: 1,
	uMorph: 0.1,
	uDistort: 0.1
};


const room = new Mesh( new BoxGeometry(32.5, 6, 92.5) );

room.geometry.center();
// right
room.geometry.faces[0].materialIndex = 0;
room.geometry.faces[1].materialIndex = 0;
// left
room.geometry.faces[2].materialIndex = 0;
room.geometry.faces[3].materialIndex = 0;
// top
room.geometry.faces[4].materialIndex = 1;
room.geometry.faces[5].materialIndex = 1;
// down
room.geometry.faces[6].materialIndex = 1;
room.geometry.faces[7].materialIndex = 1;
// back
room.geometry.faces[8].materialIndex = 0;
room.geometry.faces[9].materialIndex = 0;
// front
room.geometry.faces[10].materialIndex = 0;
room.geometry.faces[11].materialIndex = 0;


room.initialize = (video) => room.material = [
	Shader.set(
		new MeshPhongMaterial({
			side: BackSide,
			transparent: true,
			opacity: 0,
			map: new VideoTexture( video.windows )
		}),
		uniforms,
		"windows"
	),
	Shader.set(
		new MeshPhongMaterial({
			side: DoubleSide,
			transparent: true,
			opacity: 0,
			map: new VideoTexture( video.floorCeiling )
		}),
		uniforms,
		"floor_ceiling"
	)
];

room.fadeIn = Utility.once(() => (
	
	Utility.animate(
		0,
		0.3,
		2000,
		(v) => room.material[0].opacity = v
	),
	Utility.animate(
		0,
		0.7,
		2000,
		(v) => room.material[1].opacity = v
	)
));


export { room };

import {
	MeshPhongMaterial,
	Mesh,
	TextBufferGeometry
} from "three";
import { Shader } from "shader";

const Score = {
	initialize: null,
	get: null
};

const material = Shader.set(
	new MeshPhongMaterial({
		transparent: true,
		opacity: 0.6
	}),
	{
		uTime: 0,
		uSpeed: 0.1,
		uMorph: 0,
		uDistort: 0.02
	},
	"score"
);


Score.initialize = ( font, player ) => Score.get = () => {
	
	const mesh = new Mesh(
		new TextBufferGeometry(
`SCORE
${ ("....." + player.score()).slice(-5) }`,
			{
				font,
				size: 0.2,
				height: 0.1
			}
		),
		material
	);
	mesh.geometry.center();
	mesh.position.set( 0, 0, -1 );
	
	return mesh;
};


export { Score };

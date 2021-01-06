import {
	Color,
	AmbientLight,
	PointLight
} from "three";

let Light = {
	ambient: null,
	point: null
};

const color = new Color("pink");


Light.ambient = new AmbientLight( color, 0.25 );

Light.point = new PointLight( color, 2, 10, 2 );


Light = Object.freeze(Light);

export { Light };

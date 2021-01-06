let Shader = {
	get: null,
	set: null,
	update: null
};

const shaders = [];


Shader.get = (() => {
	
	const cache = {};
	
	return ( name="", again=false ) => (name)
		? cache[name] = !again && cache[name] || shaders.filter( (e) => e.name === name )[0]
		: shaders;
})();

Shader.set = (() => {
	
	const uniforms = `
		uniform float uTime;
		uniform float uSpeed;
		uniform float uMorph;
		uniform float uDistort;
	`,
		vertexShader = `
			vec3 transformed = position;
			
			float y = sin( position.y + uTime * uSpeed ) * uMorph;
			transformed.x += y / 2.0;
			transformed.y += y;
			transformed.z += y / 2.0;
			
			y = fract(
				sin(
					dot( position.y + uTime * uSpeed * 0.000001, (12.9898, 78.233) )
				) * 43758.5453123
			) * uDistort;
			transformed.x += y / 2.0;
			transformed.y += y;
			transformed.z += y / 2.0;
		`;
	
	return ( material, values, name=void(0) ) => (
		
		material.onBeforeCompile = (shader) => (
			
			shader.name = name,
			Object.keys(values).map( (e) => shader.uniforms[e] = { value: values[e] } ),
			shader.vertexShader = uniforms + shader.vertexShader,
			shader.vertexShader = shader.vertexShader.replace( "#include <begin_vertex>", vertexShader ),
			shaders.unshift(shader)
		),
		
		material
	);
})();

Shader.update = (time) => shaders.map( (e) => e.uniforms.uTime.value = time );


Shader = Object.freeze(Shader);

export { Shader };

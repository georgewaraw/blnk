import {
	FontLoader,
	AudioLoader
} from "three";
import { animate } from "popmotion";

let Utility = {
	once: null,
	times: null,
	random: null,
	font: null,
	audio: null,
	animate: null
};


Utility.once = (callback) => {
	
	let done = false;
	
	return function () {
		
		return !done && (
			
			done = true,
			callback.apply( this, arguments )
		);
	};
};

Utility.times = ( number, callback ) => [ ...Array(number) ].map(callback);

Utility.random = ( from, to=void(0) ) => (
	
	typeof(to)==="undefined" && (
		
		to = from,
		from = 0
	),
	
	Math.floor( Math.random() * (to - from) + from )
);

Utility.font = (() => {
	
	const cache = {},
		loader = new FontLoader();
	
	return (name) => cache[name] = cache[name] || new Promise( (font) => loader.load(`/build/assets/${name}.json`, font) );
})();

Utility.audio = (() => {
	
	const cache = {},
		loader = new AudioLoader();
	
	return (name) => cache[name] = cache[name] || new Promise( (buffer) => loader.load(`/build/assets/${name}.mp3`, buffer) );
})();

Utility.animate = ( from, to, duration, onUpdate, onComplete=()=>{}, type="spring" ) => animate({
	from,
	to,
	duration,
	onUpdate,
	onComplete,
	type
});


Utility = Object.freeze(Utility);

export { Utility };

import {
	AudioListener,
	Audio
} from "three";
import { Utility } from "utility";

let Sound = {
	initialize: null,
	play: null
};

let listener = null;


Sound.initialize = Utility.once(() => listener = new AudioListener() );

Sound.play = (() => {
	
	const cache = {};
	
	return ( buffer, loop=false, volume=1 ) => ( cache[buffer.name] )
		? !cache[buffer.name].isPlaying && cache[buffer.name].play()
		: (
			
			cache[ buffer.name ] = new Audio(listener),
			cache[ buffer.name ].setBuffer(buffer),
			cache[ buffer.name ].setLoop(loop),
			cache[ buffer.name ].setVolume(volume),
			cache[ buffer.name ].play()
		);
})();


Sound = Object.freeze(Sound);

export { Sound };

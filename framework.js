(function(global) {
	var starTrail = {
		version: '0.2.0'
	};

	if (global.starTrail) {
		throw new Error('starTrail is already defined');
	} else {
		global.starTrail = starTrail;
	}
	console.log(starTrail.version);

})(typeof window === 'undefined' ? this : window);

//phantomjs testing
phantom.exit();
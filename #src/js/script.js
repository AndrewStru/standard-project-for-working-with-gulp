// Importing other js files
//= my.js

// Import jQuery
//= ../../node_modules/jquery/dist/jquery.js

// Import Popper
//= ../../node_modules/popper.js/dist/umd/popper.js

// Importing the required Bootstrap 4 js files
//= ../../node_modules/bootstrap/js/dist/util.js
//= ../../node_modules/bootstrap/js/dist/alert.js
//= ../../node_modules/bootstrap/js/dist/button.js
//= ../../node_modules/bootstrap/js/dist/carousel.js
//= ../../node_modules/bootstrap/js/dist/collapse.js
//= ../../node_modules/bootstrap/js/dist/dropdown.js
//= ../../node_modules/bootstrap/js/dist/modal.js
//= ../../node_modules/bootstrap/js/dist/tooltip.js
//= ../../node_modules/bootstrap/js/dist/popover.js
//= ../../node_modules/bootstrap/js/dist/scrollspy.js
//= ../../node_modules/bootstrap/js/dist/tab.js
//= ../../node_modules/bootstrap/js/dist/toast.js


// Determine webp browser support
function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function() {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function(support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

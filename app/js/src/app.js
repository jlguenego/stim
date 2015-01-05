if (typeof String.prototype.startsWith != 'function') {
	// see below for better implementation!
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) == 0;
	};
}

(function() {
	var app = angular.module('stimergyNgApp',
		[ ]);

	app.controller('MainController', [ '$scope', function($scope) {
		console.log('MainController');
	}]);

})();
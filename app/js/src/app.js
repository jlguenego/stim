if (typeof String.prototype.startsWith != 'function') {
	// see below for better implementation!
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) == 0;
	};
}

//polyfill for Array.prototype.find
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

(function() {
	var app = angular.module('angular_cours_app',
		[ 'ngRoute', 'myLayout', 'myServices', 'angularMarkdownInclude']);

	app.directive('onFinishRender', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			link: function($scope, element, attr) {
				if ($scope.$last === true) {
					$timeout(function() {
						$scope.$emit(attr.onFinishRender);
					});
				}
			}
		};
	}]);

	app.controller('MyAppController',
		['$scope', '$rootScope', '$http', '$location', '$anchorScroll', '$timeout',
		'JsonFileService',
	function($scope, $rootScope, $http, $location, $anchorScroll, $timeout, JsonFileService) {

		$scope.list = {
			"products": JsonFileService.query({ name: "products" }),
			"services": JsonFileService.query({ name: "services" }),
			"informations": JsonFileService.query({ name: "informations" })
		};

		$scope.lesson_desc = {};
		$scope.chapter_previous = undefined;
		$scope.chapter_next = undefined;
		$scope.breadcrumb = undefined;
		$scope.hash = { 'cours': 'Cours' };
		$scope.location = $location;
		$scope.now = new Date();
		$scope.window = window;
		$scope.config = cours_angular_config;
		$rootScope.title = $scope.config.siteName;

		console.log($location.path());

		var hasToScroll = false;

		$scope.$on('$viewContentLoaded', function() {
			if (hasToScroll) {
				$scope.goToAnchor($location.hash());
				hasToScroll = false;
			}
			fixHeaderHeight();
		});

		$scope.goTo = function(url, anchor) {
			$location.path(url);
			if (anchor) {
				$location.hash(anchor);
				hasToScroll = true;
			}
		};

		$scope.goToAnchor = function(anchor) {
			if (anchor) {
				$location.hash(anchor);
			} else {
				anchor = $location.hash();
			}

			if (!anchor) {
				return;
			}

			var height = $('.header_breadcrumb').height() + $('header .navbar').height();
			window.scrollTo(0, $('#' + anchor).offset().top - height);
		};

		$scope.update_breadcrumb = function() {
			$scope.breadcrumb = $location.path().split('/').slice(1);
		}

		$scope.update_hash = function(lesson_desc) {
			for (var i = 0; i < lesson_desc.content.length; i++) {
				$scope.hash[lesson_desc.content[i].path] = lesson_desc.content[i].title;
			}
			$scope.hash[lesson_desc.path] = lesson_desc.title;
		}

		$scope.$on('$routeChangeStart', function(next, current) {
			//console.log('$routeChangeStart');
			$scope.update_breadcrumb();
			//console.log($scope.location);
		});

		$scope.breadcrumb_href = function(index) {
			return $scope.url('/' + $scope.breadcrumb.slice(0, index + 1).join('/'));
		};

		$scope.$on('fix-menu', function() {
			fixXsMenu();
		});

		$scope.scrollTop = function() {
			$(window).scrollTop(0);
		};

		$scope.url = function(url) {
			return '#' + cours_angular_config.hashPrefix + url;
		}
	}]);

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$locationProvider
			.html5Mode(cours_angular_config.html5Mode)
			.hashPrefix(cours_angular_config.hashPrefix);

		$routeProvider
			.when('/', {
				templateUrl: 'partials/cover.html'
			})
			.when('/sitemap', {
				templateUrl: 'partials/sitemap.html',
				controller: 'SitemapController'
			})
			.when('/products', {
				templateUrl: 'partials/layout_list.html',
				controller: 'ListController'
			})
			.when('/products/:name', {
				templateUrl: 'partials/layout_item.html',
				controller: 'ItemController'
			})
			.when('/services', {
				templateUrl: 'partials/layout_list.html',
				controller: 'ListController'
			})
			.when('/services/:name', {
				templateUrl: 'partials/layout_item.html',
				controller: 'ItemController'
			})
			.when('/informations', {
				templateUrl: 'partials/layout_list.html',
				controller: 'ListController'
			})
			.when('/informations/:name', {
				templateUrl: 'partials/layout_item.html',
				controller: 'ItemController'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);
})();
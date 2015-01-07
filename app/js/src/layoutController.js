(function() {
	var app = angular.module('myLayout', ['ngResource']);

	app.directive('myHeader', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/my_header.html'
		};
	});

	app.directive('mySidebar', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/my_sidebar.html'
		};
	});

	app.directive('myContent', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/my_content.html'
		};
	});

	app.directive('myFooter', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/my_footer.html'
		};
	});

	app.directive('myButtonNav', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/my_button_nav.html'
		};
	});

	app.directive('subChapter', function() {
		return {
			restrict: 'E',
			link: function(scope, element, attr, ctrl) {
				scope.anchor = attr.anchor;
			},
			transclude: true,
			template: '<div id="{{anchor}}" class="anchor"></div><h2 ng-transclude/>'
		};
	});

	app.directive('comments', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/comments.html',
			controller: ['$scope', '$http', function($scope, $http) {
				$scope.comments = [];

				if (!$scope.config.showComment) {
					return;
				}

				var chapterPath = $scope.breadcrumb.slice(1).join('/');

				$http
					.get('data/comments/' + chapterPath + '.json')
					.success(function(data) {
						$scope.comments = data;
					});
			}]
		};
	});

	app.directive('disqusComments', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/disqus_comments.html'
		};
	});

	app.directive('comment', function(){
		return {
			restrict: 'E',
			templateUrl: 'partials/comment.html',
			controller: function() {
				this.getRange = function(nbr) {
					nbr = nbr || 0;
					return new Array(nbr);
				};
			},
			controllerAs: 'commentCtrl'
		};
	});

	app.directive('commentForm', function(){
		return {
			restrict: 'E',
			templateUrl: 'partials/comment_form.html',
			controller: ['$scope', function($scope) {
				$scope.comment = {};

				this.addComment = function() {
					$scope.comments.push($scope.comment);
					$scope.comment = {};
				};
			}],
			controllerAs: 'addCommentCtrl'
		};
	});

	app.controller('SitemapController', ['$scope', '$resource',
		function($scope, $resource) {
			$scope.sitemap = $resource('sitemap.json').get();
			console.log('$scope.sitemap=', $scope.sitemap);
		}
	]);

	app.controller('ListController', ['$scope', '$rootScope', '$location', '$routeParams', 'JsonFileService',
		function($scope, $rootScope, $location, $routeParams, JsonFileService) {
			var key = $location.path().split("/")[1];
			$scope.json_file = JsonFileService.get({ name: key }, function(json_file) {
				console.log("start");
				console.log("json_file", json_file);
				$scope.update_hash(json_file);

				$rootScope.title = cours_angular_config.siteName + ' - ' + $scope.json_file.title;
			}, function(error) {
				console.log('error', error);
				$scope.pageNotFound = true;
			});
		}
	]);

	app.controller('ItemController', ['$scope', '$rootScope', '$location', '$routeParams', 'JsonFileService',
		function($scope, $rootScope, $location, $routeParams, JsonFileService) {
			console.log("ItemController");
			$scope.chapter = {};
			$scope.chapterPath = '';

			var path = $location.path();
			var array = path.split('/');
			array.shift();
			console.log("path", path);
			console.log("array", array);
			var key = array[0];
			var name = array[1];
			console.log("key", key);
			console.log("name", name);

			$scope.json_file = JsonFileService.get({ name: key }, function(json_file) {
				$scope.update_hash(json_file);
				console.log("json_file", json_file);
				$scope.currentItem = json_file.content.find(function(element, index, array) {
					return (element.path == name);
				});
				//TODO : manage when the item is not found.

				$scope.mdPath = 'data/' + $scope.currentItem.file;

				$rootScope.title = cours_angular_config.siteName + ' - '
					+ $scope.json_file.title + ' : '
					+ $scope.currentItem.title;
			});
		}
	]);
})();
angular.module('hello', [ 'ngRoute' ])
		.config(
				function($routeProvider, $httpProvider) {
					$routeProvider.when('/', {
						templateUrl : 'home.html',
						controller : 'home',
						controllerAs : 'controller'
					}).when('/login', {
						templateUrl : 'login.html',
						controller : 'navigation',
						controllerAs : 'controller'
					}).otherwise('/');
					$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
				}).controller('home', function($scope, $http) {
					var self = this;					
					$scope.isActive = function (viewLocation) { 
					   return viewLocation === $location.path();
					};					

					$http.get('http://localhost:9000/resource').success(function(data) {
						self.greeting = data;
					})
				}).controller('navigation',function($scope, $rootScope, $http, $location) {
					var self = this
					$scope.isActive = function (viewLocation) { 
					   return viewLocation === $location.path();
					}					

					var authenticate = function(credentials, callback) {
						var headers = credentials ? {
							authorization : "Basic "
									+ btoa(credentials.username + ":"
											+ credentials.password)
						} : {};
						$http.get('http://localhost:9000/user', {
							headers : headers
						}).success(function(data) {
							if (data.name) {
								$rootScope.authenticated = true;
							} else {
								$rootScope.authenticated = false;
							}
							callback && callback();
						}).error(function() {
							$rootScope.authenticated = false;
							callback && callback();
						});
					}
					authenticate();
					self.credentials = {};
					self.login = function() {
						authenticate(self.credentials, function() {
							if ($rootScope.authenticated) {
								$location.path("/");
								self.error = false;
							} else {
								$location.path("/login");
								self.error = true;
								self.errorMessage = "invalid username or password";
							}
						});
					};
					self.logout = function() {
						  $http.post('logout', {}).success(function() {
						    $rootScope.authenticated = false;
						    $location.path("/");
						  }).error(function(data) {
						    $rootScope.authenticated = false;
						  });
						}

				});

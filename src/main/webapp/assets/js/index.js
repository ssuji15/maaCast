var app = angular.module('maacast', []);
app.controller('container', function($scope) {
	$scope.setName = function(arg) {
		$scope.usertype = arg;
	}
  
});

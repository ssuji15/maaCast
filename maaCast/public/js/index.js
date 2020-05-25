var app = angular.module('maacast', []);
app.controller('container', ['$scope', function($scope,$http) {
    $scope.spice = 'very';

    $scope.setName = function(arg) {
        $scope.usertype= arg;
    };

    /*$scope.loginController = function() {
    };*/

    $scope.loginController = function($event){
		$scope.alert="text-danger"
	    console.log($scope.formData.uname)

	    if($scope.formData.uname=='prasanna' && $scope.formData.password=='prasanna')
		window.location.href="http://localhost:8081/consumer.html";
		else
			$scope.loginStatus = "Please check username or password";
	}

	$scope.registrationController = function ($event) {

		console.log($scope.formData);
	//Call the services

	/*$http.post('/api/users/post', JSON.stringify(formData)).then(function (response) {

	if (response.data)

	$scope.msg = "Post Data Submitted Successfully!";

	}, function (response) {

	console.log(response.data);

	});*/

	};
  	
}]);
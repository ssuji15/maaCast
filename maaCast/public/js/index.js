var app = angular.module('maacast', []);
app.controller('container', ['$scope', function($scope,$http) {
    $scope.contact_pattern = /^\+?\d{10}$/;
    $scope.email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    $scope.names_pattern=/^[a-zA-Z ]{1,20}$/;
    $scope.username_pattern=/^[a-zA-Z0-9]{1,20}$/;
    $scope.pincode_pattern=/^[0-9]{1,6}$/;
    $scope.password_pattern=/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{6,20}$/
//$("#regRestaurantModal").modal('show');
   // alert(sessionStorage.getItem('session'));

   var session;
   var user;
   $.ajax(
    {
        url: "/users/sessionCheck",
        type: "GET",
        dataType: 'json',
        contentType : "application/json",
        async:false,
        success: function (response){
        	if(response.flag==true)
        	{
        		session="YES";
	        	user=response.obj;
	            console.log(response);
	            localStorage.setItem('user',JSON.stringify(user));
        	}
        	else
        	{
        		alert("Please login");
        	}
        },
        error: function (response){
        	session="NO";
            console.log(response);
        }
    });
  // alert(localStorage.getItem('user'));

   if(session=="YES")
   {

    	if(user.userType=="User")
    		window.location.href="/consumer.html";
    	else if(user.userType=="Delivery Executive")
    		window.location.href="/deliver-exec.html";
    	else if(user.userType=="Restaurant")
    		window.location.href="/restaurant.html";
    	else
    		window.location.href="/NGO.html";
    }
    else
    {

    	$scope.setName = function(arg) {
        $scope.usertype= arg;
	    };


	    $scope.loginController = function($event){

			$scope.alert="text-danger"
		   // console.log($scope.formData);

		    $.ajax(
	        {
	            url: "/users/login",
	            type: "POST",
	            dataType: 'json',
	            contentType : "application/json",
	            data :JSON.stringify($scope.formData),
	            async:false,
	            success: function (response){
	            	//alert(JSON.stringify(response.obj));
	                console.log(response.obj);
	                localStorage.setItem('user',JSON.stringify(response.obj));
	               // sessionStorage.setItem('username',JSON.stringify(response).firstN);
	                if(response.flag==true)
	                {
	                	if(response.obj.userType=="User")
	                		window.location.href="/consumer.html";
	                	else if(response.obj.userType=="Delivery Executive")
	                		window.location.href="/delivery-exec.html";
	                	else if(response.obj.userType=="Restaurant")
	                		window.location.href="/restaurant.html";
	                	else
	                		window.location.href="/NGO.html";

	                }
	                else
	                {
	                	$scope.loginStatus=response.message;	
	                }
	            },
	            error: function (response){
	            	$scope.loginStatus=response.message;
	            	alert(response);
	            }
	        });

		   /* if($scope.formData.uname=='prasanna' && $scope.formData.password=='prasanna')
			
			else
				$scope.loginStatus = "Please check username or password";
			sessionStorage.setItem('username','Prasanna kumar');

			var profile={
				username:"Prasanna Kumar",
				email:"p123@gmail.com",
				contactNumber:"9876544321"
			};
			var address={ 
				city:"Uravakonda",
				flatNumber:"1-23",
				pinCode:"515822",
				street:"Colony",
	            state:"Andhra pradesh",
	            landmark:"Raghavendra complex"
	    	};
	    	sessionStorage.setItem('profile',JSON.stringify(profile));
	    	sessionStorage.setItem('address',JSON.stringify(address));*/
		}

		$scope.registrationController = function (formData) {

			formData.userType=$scope.usertype;
		 console.log(formData);
		 if($scope.usertype=="Delivery Executive")
		 {
		 	formData.vehicleType="Two-Wheeler";
		 	formData.vehicleNumber="AP 09 4123";
		 }
		//Call the services

		$.ajax(
	        {
	            url: "/users/register",
	            type: "POST",
	            dataType: 'json',
	            contentType : "application/json",
	            data :JSON.stringify(formData),
	            async:false,
	            success: function (response){
	            	if(response.flag==true)
	            	{
	            		alert("Registration is done Successfully.");
	            		if($scope.usertype=="Restaurant")
	            		{
		            		$("#signupModal").modal('hide');
		            		$("#regRestaurantModal").modal('show');
		            	}
		            	$("#signupModal").modal('hide');
		            	//location.reload();
	            		//location.reload();
	            	}
	            	else
	            	{
	            		alert(response.message);
	            		location.reload();
	            	}
	                console.log(response);
	            },
	            error: function (response){
	            	$scope.loginStatus=response.message;
	            	console.log(response);
	            }
	        });

		};
		$scope.regRestaurantController = function (formData,userid) {
			formData.userid=userid;
			formData.latitude="50.232";
			formData.longitude="92893.23";
			formData.gstinnumber="9289323234";
		 console.log(formData);
		//Call the services

		$.ajax(
	        {
	            url: "/restaurant/create",
	            type: "POST",
	            dataType: 'json',
	            contentType : "application/json",
	            data :JSON.stringify(formData),
	            async:false,
	            success: function (response){
	            	if(response.flag==true)
	            	{
	            		alert("Restaurant is created successfully.Please login again");
	            		location.reload();
	            	}
	                console.log(response);
	            },
	            error: function (response){
	            	$scope.loginStatus=response.message;
	            	console.log(response);
	            }
	        });


		};

    }


    
  	
}]);
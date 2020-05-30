function checkSession()
{
   $.ajax(
    {
        url: "/users/sessionCheck",
        type: "GET",
        dataType: 'json',
        contentType : "application/json",
        async:false,
        success: function (response){
        	if(response.flag==false)
        	{
        		//alert("Please login again");
                window.location.href="/";
        	}
        },
        error: function (response){
        	//alert("Please login again");
        	//console.log(response);
            window.location.href="/";
        }
    });
}

function logout()
{
        $.ajax(
        {
            url: "/users/logout",
            type: "GET",
            dataType: 'json',
            contentType : "application/json",
            success: function (response){
                console.log(response);
                	localStorage.clear();
                    window.location.href="/";
            },
            error: function (response){
                console.log(response);
            }
        });
  }
   
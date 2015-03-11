var host = "http://"+window.location.host;

app.controller('main_control',function($scope,$http){
	load_companies();
	function load_companies(){
		$http.get(host+"/company").success(function(data){
			$scope.loaded_companies=data;
		})
	}
});
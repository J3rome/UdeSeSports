function matchesController($scope,$http) {
	$http.get("json/match.json")
		.success(function(response){
			$scope.match = response;
	});

	$http.get("json/items.json")
		.success(function(response){
			$scope.items = response;
	});	

	$http.get("json/champions.json")
		.success(function(response){
			$scope.champions = response;
	});

	$http.get("json/summonerspells.json")
		.success(function(response){
			$scope.summonerspells = response;
	});
}
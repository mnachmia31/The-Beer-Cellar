var app = angular.module('myCraftBeerCellar', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
	.state('home', {
      url: '/home',
      templateUrl: '/home.html'
	})
    .state('view', {
      url: '/craftbeers',
      templateUrl: '/craftbeers.html',
      controller: 'MainCtrl',
      resolve: {
       craftBeerPromise: ['craftBeers', function(craftBeers){
       return craftBeers.getAll();
      }]
    }})
	.state('add', {
      url: '/addcraftbeer',
      templateUrl: '/addcraftbeer.html',
      controller: 'MainCtrl',
      resolve: {
       craftBeerPromise: ['craftBeers', function(craftBeers){
       return craftBeers.getAll();
      }]
    }})
	.state('modify', {
      url: '/craftbeers/{id}',
      templateUrl: '/modifycraftbeer.html',
      controller: 'UpdateCtrl',
      resolve: {
         craftBeer: ['$stateParams', 'craftBeers', function($stateParams, craftBeers) {
         return craftBeers.get($stateParams.id);
		}]
	}})
    .state('comments', {
     url: '/craftbeers/{id}/comments',
     templateUrl: '/comments.html',
     controller: 'UpdateCtrl',
	 resolve: {
         craftBeer: ['$stateParams', 'craftBeers', function($stateParams, craftBeers) {
         return craftBeers.getComments($stateParams.id);
		}]
	}});

	$urlRouterProvider.otherwise('home');
}]);

app.factory('craftBeers', ['$http', function($http){
  var o = {
    craftBeers: []
  };

  o.getAll = function() {
    return $http.get('/craftbeers').success(function(data){
      angular.copy(data, o.craftBeers);
    });
  };
  
  o.get = function(id) {
    return $http.get('/craftbeers/' + id).then(function(res){
      return res.data;
  })};

  o.create = function(craftBeer) {
    return $http.post('/craftbeers', craftBeer).success(function(data){
      o.craftBeers.push(data);
    });
  };
  
  o.update = function(id, craftBeer) {
    return $http.put('/craftbeers/' + id, craftBeer);
  };
  
  o.delete = function(id) {
    return $http.delete('/craftbeers/' + id);
  };
  
  o.getComments = function(id) {
    return $http.get('/craftbeers/' + id + '/comments').then(function(res){
      return res.data;
  })};

  o.addComment = function(id, comment) {
    return $http.post('/craftbeers/' + id + '/comments', comment);
  };

  return o;
}]);

app.controller('MainCtrl', [
'$scope',
'$location',
'craftBeers',
function($scope, $location, craftBeers){
  $scope.craftBeers = craftBeers.craftBeers;

  $scope.addCraftBeer = function(){
   if(!$scope.name || $scope.name === '') { return; }
   if(!$scope.brewery || $scope.brewery === '') { return; }
   if(!$scope.year || $scope.year === '') { return; }
   if(!$scope.type || $scope.type === '') { return; }
   if(!$scope.notes || $scope.notes === '') { return; }
   if(!$scope.abv || $scope.abv === '') { return; }
   if(!$scope.inventory || $scope.inventory === '') { return; }
   if(!$scope.beeradvocate || $scope.beeradvocate === '') { return; }

   craftBeers.create({ 
	name : $scope.name, 
	brewery : $scope.brewery, 
	type : $scope.type, 
	abv: $scope.abv, 
	year : $scope.year, 
	notes : $scope.notes, 
	beeradvocate : $scope.beeradvocate, 
	inventory : $scope.inventory
   });
   
   $location.path('/craftbeers');
  };
}]);

app.controller('UpdateCtrl', [
'$scope',
'$location',
'craftBeers',
'craftBeer',
function($scope, $location, craftBeers, craftBeer){
   $scope.craftBeer = craftBeer;
   
   $scope.updateCraftBeer = function(){
	   if(!$scope.name || $scope.name === '') { return; }
	   if(!$scope.brewery || $scope.brewery === '') { return; }
	   if(!$scope.year || $scope.year === '') { return; }
	   if(!$scope.type || $scope.type === '') { return; }
	   if(!$scope.notes || $scope.notes === '') { return; }
	   if(!$scope.abv || $scope.abv === '') { return; }
	   if(!$scope.inventory || $scope.inventory === '') { return; }
	   if(!$scope.beeradvocate || $scope.beeradvocate === '') { return; }

	   craftBeers.update(craftBeer._id, { 
		name : $scope.name, 
		brewery : $scope.brewery, 
		type : $scope.type, 
		abv: $scope.abv, 
		year : $scope.year, 
		notes : $scope.notes, 
		beeradvocate : $scope.beeradvocate, 
		inventory : $scope.inventory
	   });
	   
	   $location.path('/craftbeers');
	};
   
   $scope.removeCraftBeer = function () {
	 craftBeers.delete(craftBeer._id);
	 
	 $location.path('/craftbeers');
   };

   $scope.addComment = function(){
     if(!$scope.body === '' || $scope.body === '') { return; }
	 if(!$scope.author === '' || $scope.author === '') { return; }
	 
     craftBeers.addComment(craftBeer._id, {
       body: $scope.body,
       author: $scope.author,
     }).success(function(comment) {
       $scope.craftBeer.comments.push(comment);
     });
     
     $scope.body = '';
	 $scope.author = '';
   };

}]);
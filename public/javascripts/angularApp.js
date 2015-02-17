var app = angular.module('myCraftBeerCellar', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
       craftBeerPromise: ['craftBeers', function(craftBeers){
       return craftBeers.getAll();
      }]
    }})
    .state('craftBeers', {
     url: '/craftbeers/{id}',
     templateUrl: '/craftbeers.html',
     controller: 'CraftBeersCtrl',
	resolve: {
         craftBeer: ['$stateParams', 'craftBeers', function($stateParams, craftBeers) {
         return craftBeers.get($stateParams.id);
    }]
  }
  });

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

  o.create = function(craftBeer) {
    return $http.post('/craftbeers', craftBeer).success(function(data){
      o.craftBeers.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/craftbeers/' + id).then(function(res){
      return res.data;
  })};

  o.addComment = function(id, comment) {
    return $http.post('/craftbeers/' + id + '/comments', comment);
  };

  return o;
}]);

app.controller('MainCtrl', [
'$scope',
'craftBeers',
function($scope, craftBeers){
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

   $scope.name = '';
   $scope.brewery = '';
   $scope.year = '';
   $scope.type = '';
   $scope.notes = '';
   $scope.abv = '';
   $scope.inventory = '';
   $scope.beeradvocate = '';
  };
}]);

app.controller('CraftBeersCtrl', [
'$scope',
'craftBeers',
'craftBeer',
function($scope, craftBeers, craftBeer){
   $scope.craftBeer = craftBeer;

   $scope.addComment = function(){
     if($scope.body === '') { return; }
     craftBeers.addComment(craftBeer._id, {
       body: $scope.body,
       author: 'user',
     }).success(function(comment) {
       $scope.craftBeer.comments.push(comment);
     });
     
     $scope.body = '';
   };

}]);
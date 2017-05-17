angular.module('conFusion.controllers', [])

    .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$localStorage','dishes', 'favorites',function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $localStorage, dishes, favorites) {
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
            $scope.dishes = dishes;
             console.log($scope.dishes);
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        
           $scope.addFavorite = function (index) {
               console.log("index is " + index);
               favoriteFactory.addToFavorites(index);
               console.log(favoriteFactory.getFavorites());
               $localStorage.storeObject('favorites', favorites);
               console.log($localStorage.getObject('favorites'));
               $ionicListDelegate.closeOptionButtons();
            }
        }])

     .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

     .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

     .controller('DishDetailController', ['$scope', '$stateParams', 'dish','menuFactory', 'baseURL', '$ionicPopover', 'favoriteFactory', '$ionicModal',function($scope, $stateParams, dish, menuFactory, baseURL, $ionicPopover,favoriteFactory,$ionicModal) {
            
            $scope.baseURL = baseURL;
            $scope.dish = dish;
            $scope.feedback = {rating:5, comment:"", author:"", date:""};
            $scope.showDish = false;
            $scope.message="Loading ...";
            
            $scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );

              $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                    scope: $scope
                    }).then(function(popover) {
                    $scope.popover = popover;
                });
            
              $scope.openPopover = function($event) {
                $scope.popover.show($event);
                };
            
            $scope.closePopover = function() {
          $scope.popover.hide();
         };
            
             $scope.addFavorite = function () {
             console.log("La La Land");
              console.log("index is " + $scope.dish.id);
              favoriteFactory.addToFavorites($scope.dish.id);
                 $scope.closePopover();
            }
             
             
             $ionicModal.fromTemplateUrl('templates/dish-comment.html',{
                scope: $scope
            }).then(function(modal){
               $scope.modal = modal;
                    });
             
            $scope.toComment = function(){
                $scope.modal.show();
            } 
            
             $scope.closeComment = function(){
                 $scope.modal.hide();
             }
             
             $scope.submitComment = function () {
                
                $scope.feedback.date = new Date().toISOString();
                console.log($scope.feedback);
                
                $scope.dish.comments.push($scope.feedback);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                $scope.feedback = {rating:5, comment:"", author:"", date:""};
                 $scope.closeComment();
                 $scope.closePopover();
            }
             
        }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here
       .controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL','dish', 'leader',function ($scope, menuFactory, promotionFactory, corporateFactory, baseURL, dish,leader) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;

    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = dish;

    $scope.promotion = promotionFactory.get({
        id: 0
    });

}])

        .controller('AboutController', ['$scope', 'corporateFactory', 'leaders', 'baseURL',function($scope, corporateFactory, leaders, baseURL) {
              
                 $scope.baseURL=baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
                    console.log(leaders);
                    }])
       
       .controller('FavoritesController', ['$scope', 'dishes','favorites','favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

            $scope.baseURL = baseURL;
           $scope.shouldShowDelete = false;
           $scope.favorites = favorites;
           $scope.dishes = dishes;

    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    };

    $scope.deleteFavorite = function (index) {
        
         var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
                console.log(favorites);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;


    };
       
       }])


        .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$localStorage', function($scope, $ionicModal, $timeout, $localStorage){
            
            $scope.reservation = {};
            $scope.loginData=$localStorage.getObject('userinfo','{}');

             // Create the reserve modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html',{
                scope: $scope
            }).then(function(modal){
                    $scope.modal = modal;
                    });
            
            $ionicModal.fromTemplateUrl('templates/reserve.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.reserveform = modal;
            });

            // Triggered in the reserve modal to close it
            $scope.closeLogin = function(){
                $scope.modal.hide();
            }
            
            $scope.closeReserve = function() {
                $scope.reserveform.hide();
            };

            // Open the reserve modal
            $scope.login = function(){
                $scope.modal.show();
            }
            $scope.reserve = function() {
            $scope.reserveform.show();
            };

            
            $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);
                
         $timeout(function() {
      $scope.closeLogin();
    }, 1000);

     };
            // Perform the reserve action when the user submits the reserve form
            $scope.doReserve = function() {
                console.log('Doing reservation', $scope.reservation);

                // Simulate a reservation delay. Remove this and replace with your reservation
                // code if using a server system
       $timeout(function() {
      $scope.closeReserve();
    }, 1000);
   };    
            
        }])
.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }});;
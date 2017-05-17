angular.module('conFusion.controllers', [])

//.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage){
	
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera,$cordovaImagePicker) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  
//$scope.loginData = {};

$scope.loginData = $localStorage.getObject('userinfo','{}');
		 $scope.reservation = {};
	$scope.registration = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };




  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
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
	
	
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
	  $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

	 // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
	
	$ionicPlatform.ready(function() {
        var optionsCordovaCamera = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

         $scope.takePicture = function() {
      $cordovaCamera.getPicture(optionsCordovaCamera).then(function(imageData) {

                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;

            }, function(err) {

                console.log(err);

            });
            $scope.registerform.show();

        };

        var optionsCordovaImagePicker = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
            };

        $scope.openGallery = function () {

    $cordovaImagePicker.getPictures(optionsCordovaImagePicker)
            .then(function (results) {
              $scope.registration.imgSrc = results[0];
            }, function(error) {
              console.log(error);
            });
        };
    });
  })	

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";           
	$scope.dishes = dishes;
             
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
        $ionicListDelegate.closeOptionButtons();
	
		
	$ionicPlatform.ready(function () {
		
		$cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

		  
			$cordovaToast
                  .show("Added Favorite "+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                       //console.log("The toast was shown");
                  }, function (error) {
       console.log("The toast was not shown due to " + error);
                  });
	

		});
		
		
	
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

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal','$cordovaToast','$cordovaLocalNotification','$ionicPlatform', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal,$cordovaToast,$cordovaLocalNotification,$ionicPlatform) {

    $scope.baseURL = baseURL;


 $scope.dish = dish;
	
	$ionicModal.fromTemplateUrl('templates/dish-comment.html', {

    scope: $scope

  }).then(function (modal) {
    $scope.commentForm = modal;
  });
  // close comment modal
  $scope.closeComment = function () {
    $scope.commentForm.hide();
  };
  // open comment modal
  $scope.openComment = function () {
    $scope.commentForm.show();

  };
	
	 $scope.addComment = function () {

    $scope.openComment();
		 
    $scope.closePopover();

  };

	
$ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {

    scope: $scope

  }).then(function (popover) {

    $scope.popover = popover;

  });

  $scope.openPopover = function ($event) {

    $scope.popover.show($event);

  };

  $scope.closePopover = function () {

    $scope.popover.hide();


  };

	 $ionicPlatform.ready(function () {

            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dish.name
            }).then(function () {
                console.log('Added Favorite '+$scope.dish.name);
            }, function () {
                console.log('Failed to add Notification ');
            });

            $cordovaToast
              .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
              .then(function (success) {
                  // success
              }, function (error) {
                  // error
              });

        });

	
	
	$scope.addFavorite = function (index) {

        console.log("index is " + index);

        favoriteFactory.addToFavorites(index);

        $scope.dishDetailPopover.hide();

        $ionicPlatform.ready(function () {

            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dish.name
            }).then(function () {
                console.log('Added Favorite '+$scope.dish.name);
            }, function () {
                console.log('Failed to add Notification ');
            });

            $cordovaToast
              .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
              .then(function (success) {
                  // success
              }, function (error) {
                  // error
              });

        });

    };
	
	
	/*
	
	$scope.addFavorite = function () {

    favoriteFactory.addToFavorites($scope.dish.id);

    $ionicLoading.show({

      template: 'Added to favorites!',

      noBackdrop: true,

      duration: 1000
    });

    $scope.closePopover();
  };

 
  //Cleanup the popover when we're done with it!

  $scope.$on('$destroy', function () {

    $scope.popover.remove();

  });

    //  $scope.dish = dish;
           
	 //$scope.mycomment = {};      
	
	*/
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


.controller('IndexController', ['$scope', 'leader','promotion','dish', 'baseURL', function ($scope, leader,promotion, dish, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;

    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = dish.$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.promotion = promotion;
       
}])

.controller('AboutController', ['$scope','leaders', 'baseURL', function($scope,leaders,baseURL) {
                    $scope.baseURL=baseURL;
                    $scope.leaders = leaders;
                    //console.log($scope.leaders);
            
                    }])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$ionicPlatform','$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout,$ionicPlatform,$cordovaVibration) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;

    $scope.dishes = dishes;
    
    console.log($scope.dishes,$scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }
	

     $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

		 
		 $ionicPlatform.ready(function (){
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
				$cordovaVibration.vibrate(1000); 

            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

		 })
}}])
								   
								

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

    }})

;

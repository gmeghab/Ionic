angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage){
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  
//$scope.loginData = {};
$scope.loginData = $localStorage.getObject('userinfo','{}');
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

	 $scope.reservation = {};

  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve_courses.html', {
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
})

.controller('MenuController', ['$scope', 'courses','favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',function ($scope,courses, favoriteFactory, baseURL, $ionicListDelegate,$ionicPopup, $ionicLoading, $timeout) {


            $scope.baseURL = baseURL;            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
           
	$scope.courses = courses;
     $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
    };         
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "Core";
                }
                else if (setTab === 3) {
                    $scope.filtText = "ProgrammingConcentration";
                }
                else if (setTab === 4) {
                    $scope.filtText = "CyberDefenseConcentration";
                }
				 else if (setTab === 5) {
                    $scope.filtText = "Elective";
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

.controller('DishDetailController', ['$scope', '$stateParams', 'course', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', function ($scope, $stateParams, course, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {

  $scope.baseURL = baseURL;

 $scope.course = course;
	
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

         
	
$ionicPopover.fromTemplateUrl('templates/dish-detail-popover_courses.html', {

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

  $scope.addFavorite = function () {

    favoriteFactory.addToFavorites($scope.course.id);

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

   
        
	$scope.mycomment = {rating:5, comment:"", author:"", date:""};

  $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.course.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.course.id},$scope.course);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
	
            
  }])

   .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.course.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.course.id},$scope.course);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here


.controller('IndexController', ['$scope', 'professor','promotion','course', 'baseURL', function ($scope, professor,promotion, course, baseURL) {

    $scope.baseURL = baseURL;
    $scope.professor = professor;

    $scope.showCourse = false;
    $scope.message = "Loading ...";

    $scope.course = course.$promise.then(
            function (response) {
                $scope.course = response;
                $scope.showCourse = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.promotion = promotion;
       
}])

.controller('AboutController', ['$scope','professors', 'baseURL', function($scope,professors,baseURL) {
                    $scope.baseURL=baseURL;
                    $scope.professors = professors;
                   
            
                    }])

.controller('FavoritesController', ['$scope', 'courses', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, courses, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;

    $scope.courses = courses;
    
    console.log($scope.courses,$scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }
	

     $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

    }
}])
								   
								

.filter('favoriteFilter', function () {
    return function (courses, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < courses.length; j++) {
                if (courses[j].id === favorites[i].id)
                    out.push(courses[j]);
            }
        }
        return out;

    }})

;

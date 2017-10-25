(function (angular, _) { // eslint-disable-line func-names
    angular.module('app.controllers.home', [
        'app.services.businessInputs'
    ])
    .controller('app.controllers.homeController', homeController);

    homeController.$inject = [
        '$scope','app.services.businessInputs.form','sil.oauth2.authConfig',
        'UserService', '$ionicPlatform', '$state', '$ionicModal', 'apiBackend',
    ];

    function homeController($scope, frmService, authConfig, UserService, $ionicPlatform,
        $state, $ionicModal, callApi) {
        $scope.title = 'My Businesses';
        $scope.createFields = frmService.createBusiness();
        // $scope.user = authConfig.getUser();
        $ionicPlatform.ready(function () {
            UserService.getLoggedInUsers().then(function (results) {
                if (results.rows.length > 0) {
                    $scope.user = results.rows.item(0);
                    $scope.user_token = $scope.user.token;
                }
            }, function (error) {
                NotificationService.showError(error);
            });
        });
        // create modal
        $scope.openModal = function($event) {
            $scope.biz_modal.show($event);
        };
        $scope.closeModal = function() {
            $scope.biz_modal.hide();
        };
        $scope.createModal = function() {
            $ionicModal.fromTemplateUrl('templates/add_business.html', {
                id: 1,
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.biz_modal = modal;
                console.log($state.current.name);
                if ($state.current.name === 'businesses.list.new_business'){
                    $scope.openModal();
                }
            });
        };
        $scope.createModal();
        $scope.$on('$destroy', function() {
            $scope.biz_modal.remove();
        });
        $scope.logOutUser = function() {
            console.log("Called");
            UserService.logoutUser().then(function (results) {
                if (results.rows.length > 0 || results.rows.length === 0) {
                    $state.go('login');
                }
            }, function (error) {
                NotificationService.showError(error);
            });
        };
    }
}(window.angular, window._));

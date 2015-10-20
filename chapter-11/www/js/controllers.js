angular.module('secureApp.controllers', ['secureApp.services'])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, AuthFactory) {

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            AuthFactory.login($scope.loginData.username, $scope.loginData.password)
                .then(function () {
                    $scope.closeLogin();
                });
        };
    });

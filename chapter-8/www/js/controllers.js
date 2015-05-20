angular.module('phonebook.controllers', [])
    .controller('ContactsCtrl', function ($scope, contactsFactory) {

        // List of contacts
        $scope.contacts = [];

        $scope.doRefresh = function () {
            contactsFactory.all().then(
                function (contacts) {
                    $scope.contacts = contacts;
                    $scope.$broadcast('scroll.refreshComplete')
                },
                function (error) {
                    alert(error);
                    $scope.$broadcast('scroll.refreshComplete')
                },
                function (notify) {
                    console.log("Just notifying");
                });
        };
    });

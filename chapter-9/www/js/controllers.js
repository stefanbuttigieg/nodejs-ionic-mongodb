/**
 * Created by csvan on 28/05/15.
 */
angular.module('supernav.controllers', [])
    .controller('MapCtrl', function ($scope) {
        $scope.mapCreated = function (map) {
            $scope.map = map;
        };

        $scope.centerOnUser = function () {
            console.log("Centering on user");
            if (!$scope.map) {
                return;
            }

            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };
    });


angular.module('secureApp',
    [
        'ionic',
        'secureApp.services',
        'secureApp.controllers'
    ])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show
            // the accessory bar above the keyboard for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html"
                    }
                }
            })

            .state('app.private', {
                url: "/private",
                views: {
                    'menuContent': {
                        templateUrl: "templates/private.html",
                        resolve: {
                            isAuthenticated: function ($q, AuthFactory) {
                                if (AuthFactory.isAuthenticated()) {
                                    return $q.when();
                                } else {
                                    $timeout(function () {
                                        $state.go('app.home')
                                    });
                                    return $q.reject()
                                }
                            }
                        }
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

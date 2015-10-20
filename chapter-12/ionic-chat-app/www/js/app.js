angular.module('ionic-chat-app',
    [
        'ionic',
        'ionic-chat-app-services',
        'ionic-chat-app-controllers'
    ])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Configure the routing
        $stateProvider.
            state('app', {
                url: "/app",
                abstract: true,
                templateUrl: 'index.html'
            })
            .state('app.chat', {
                url: '/chat',
                templateUrl: 'templates/app-chat.html',
                controller: 'ChatController'
            });
        $urlRouterProvider.otherwise('/app/chat');
    });

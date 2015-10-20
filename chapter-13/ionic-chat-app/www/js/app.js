angular.module('ionic-chat-app',
    [
        'ionic',
        'ionic-chat-app-services',
        'ionic-chat-app-controllers',
        'ionic-chat-app-directives'
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
        $stateProvider

            // Each tab has its own nav history stack:
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            .state('app.node', {
                url: '/node',
                views: {
                    'node-view': {
                        templateUrl: 'templates/app-chat.html',
                        controller: 'ChatController',
                        resolve: {
                            chatRoom: function () {
                                return 'node';
                            }
                        }
                    }
                }
            })

            .state('app.javascript', {
                url: '/javascript',
                views: {
                    'javascript-view': {
                        templateUrl: 'templates/app-chat.html',
                        controller: 'ChatController',
                        resolve: {
                            chatRoom: function () {
                                return 'javascript';
                            }
                        }
                    }
                }
            })

            .state('app.haskell', {
                url: '/haskell',
                views: {
                    'haskell-view': {
                        templateUrl: 'templates/app-chat.html',
                        controller: 'ChatController',
                        resolve: {
                            chatRoom: function () {
                                return 'haskell';
                            }
                        }
                    }
                }
            })

            .state('app.erlang', {
                url: '/erlang',
                views: {
                    'erlang-view': {
                        templateUrl: 'templates/app-chat.html',
                        controller: 'ChatController',
                        resolve: {
                            chatRoom: function () {
                                return 'erlang';
                            }
                        }
                    }
                }
            })

            .state('app.scala', {
                url: '/scala',
                views: {
                    'scala-view': {
                        templateUrl: 'templates/app-chat.html',
                        controller: 'ChatController',
                        resolve: {
                            chatRoom: function () {
                                return 'scala';
                            }
                        }
                    }
                }
            });

        $urlRouterProvider.otherwise('/app/node');
    })

    .directive('Chat', function (ChatService) {
        console.log('Loverzxcr');

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/app-chat.html',
            scope: {
                'chatRoom': "="
            },
            controller: function ($scope, ChatService) {

                console.log('love');

                var connection = ChatService.connect($scope.chatRoom);

                // The chat messages
                $scope.messages = [];

                // Notify whenever a new user connects
                ChatService.on.userConnected(function (user) {
                    $scope.messages.push({
                        name: 'Chat Bot',
                        text: 'A new user has connected!'
                    });
                    $scope.$apply();
                });

                // Whenever a new message appears, append it
                ChatService.on.messageReceived(function (message) {
                    message.external = true;
                    $scope.messages.push(message);
                    $scope.$apply();
                });

                $scope.inputMessage = '';
                $scope.onSend = function () {
                    $scope.messages.push({
                        name: 'Me',
                        text: $scope.inputMessage
                    });
                    // Send the message to the server
                    ChatService.emit({
                        name: 'Anonymous',
                        text: $scope.inputMessage
                    });
                    // Clear the chatbox
                    $scope.inputMessage = '';
                }
            }
        }
    });

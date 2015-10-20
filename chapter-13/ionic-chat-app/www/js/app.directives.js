angular.module('ionic-chat-app-directives',
    [
        'ionic-chat-app-services'
    ])

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

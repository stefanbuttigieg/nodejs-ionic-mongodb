angular.module('ionic-chat-app-controllers', [])

    .controller('ChatController', function ($scope, ChatService) {

        // The chat messages
        $scope.messages = [];

        // Notify whenever a new user connects
        ChatService.on.userConnected(function (user) {
            $scope.messages.push({
                name: 'Chat Bot',
                text: 'A new user has connected!'
            });
        });

        // Whenever a new message appears, append it
        ChatService.on.messageReceived(function (message) {
            message.external = true;
            $scope.messages.push(message);
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
    });

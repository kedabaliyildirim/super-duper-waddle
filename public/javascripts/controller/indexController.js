app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    $scope.messages = []
    $scope.players = {}

    $scope.init = () => {
        const userName =prompt('Enter your username');
        if (userName) {
            initSocket(userName);
        }
        else {
            return false;
        };
    }
    function initSocket(userName) {
        const connectionOptions = {
            reconnectionAttempts: 2,
            reconnectionDelay: 300
        }
        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket) =>{
            socket.emit('newUser', {userName})

            socket.on('initPlayers', (players) => {
                $scope.players= players;
                $scope.$apply();

            })


            socket.on('newUser', (data)=> {
                const messageData = {
                    type: {
                        code: 0, //code 0 = [SERVER] message
                        message: 1 //connection status 1 = logged in
                    },
                    userName:data.userName
                }
                //pushing the messages
                $scope.messages.push(messageData)
                $scope.$apply();
            })
            socket.on('disUser', (data) => {
                const messageData = {
                    type: {
                        code: 0, //code 0 = [SERVER] message
                        message: 0 //connection status 0 = logged out
                    },
                    
                    userName: data.userName
                };
                //pushing the messages
                $scope.messages.push(messageData)
                $scope.$apply();
            })
            
        }).catch((err) =>{
            console.log();
        })
        
    }



}])
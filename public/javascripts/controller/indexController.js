app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

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
        }).catch((err) =>{
            console.log();
        })
        
    }



}])
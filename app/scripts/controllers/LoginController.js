(function () {
angular.module('Monorythm')
    .controller('LoginController',['$scope','$state','AppState','$mdToast','AuthService','$q','$timeout',function ($scope,$state, AppState,$mdToast,AuthService,$q,$timeout) {
        $scope.user = {name:'',pass:'',save:true};


        $scope.onEnter = function () {

            if($scope.enterForm.$valid){

                $scope.loadingPromise = $q(function (resolve) {

                    AuthService.auth($scope.user.name,$scope.user.pass,$scope.user.save)
                        .then(function (res) {
                            console.log('авторизация выполнена успешно');
                            $timeout(function () {
                                $state.go('catalog.home');
                            },0);
                            resolve();
                        },function (err) {
         
                            resolve();
                            switch(err){
                                case 'config':
                                    $mdToast.show( $mdToast.simple()
                                        .textContent('Неверно настроен файл конфигурации. Обратитесь к администратору!')
                                        .position('top right' )
                                        .hideDelay(3000) );
                                    break;
                                case 'unathorized':
                                    $mdToast.show( $mdToast.simple()
                                        .textContent('Логин или пароль указаны неверно')
                                        .position('top right' )
                                        .hideDelay(3000) );
                                    break;
                                case 'network':
                                    $mdToast.show( $mdToast.simple()
                                        .textContent('Отсуствует сетевое подключение. Повторите при наличии сетевого подключения.')
                                        .position('top right' )
                                        .hideDelay(3000) );
                                    break;
                                case 'server':
                                    $mdToast.show( $mdToast.simple()
                                        .textContent('Произошла неизвестная ошибка, попробуйте повторить позднее')
                                        .position('top right' )
                                        .hideDelay(3000) );
                                    break;
                                default:
                                    console.log('неизвестная ошибка',err);
                            }

                        });
                });


                
            }else{
                $mdToast.show( $mdToast.simple()
                                    .textContent('Укажите логин и пароль!')
                                    .position('top right' )
                                    .hideDelay(3000) );
            }

        }
    }])
})();
(function () {
angular.module('Monorythm')
    .controller('SignupController',['$scope','$state','SignupService','$timeout','$mdToast','$q',function ($scope,$state,SignupService,$timeout,$mdToast,$q) {

        $scope.fields = [];
        $scope.values = {
            login:'',
            properties:{}
        };

        $scope.signup = function () {

            if($scope.registrationForm.$invalid){
                $mdToast.show( $mdToast.simple()
                    .textContent('Проверьте корректность заполнения формы рагистрации.')
                    .position('top right' )
                    .hideDelay(3000) );
            }else{


                // Объект для регистрации
                var regObject = {
                    name: $scope.values.login,
                    properties:[]
                };

                for(key in $scope.values.properties){
                    if($scope.values.properties.hasOwnProperty(key)){
                        var newProp = {id:Number(key),value:$scope.values.properties[key]};
                        regObject.properties.push(newProp);
                    }
                }

                $scope.loadingPromise = $q(function (loadingRes) {
                    SignupService.signup(regObject)
                        .then(function (res) {
                            loadingRes();
                            $state.go('signupsuccess');

                        },function (err) {

                            var msg = "При регистрации произошла ошибка, попробуйте повторить позднее";

                            switch(err.status){
                                case -1:
                                    msg = "Отсуствует подключение к сети. Повторите при появлении сетевого подключения";
                                    break;
                                default:
                            }

                            $mdToast.show($mdToast.simple()
                                .textContent(msg)
                                .position('top right' )
                                .hideDelay(3000));

                            loadingRes(); // Убираем индикатор загрузки
                        });
                });

            }


        };

    }]);
})();
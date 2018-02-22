/**
 * Даже у страницы сообщения об успехе оформления заказа есть свой отдельный контроллер
 */

(function () {
angular.module('Monorythm')
    .controller('OrderSuccessController',['$stateParams','$scope',function ($stateParams,$scope) {

        console.log('Параметры',$stateParams);
        $scope.orderNumber = $stateParams.orderNumber;
    }])
})();

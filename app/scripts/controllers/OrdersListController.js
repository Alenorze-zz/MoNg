(function () {
angular.module('Monorythm')
    .controller('OrdersListController',['$scope','$mdDialog','AppState','$state','$timeout','OrdersService','$cookies',function ($scope,$mdDialog,AppState,$state,$timeout,OrdersService,$cookies) {
        

        // Слушаем обновление заказов
        $scope.$on('mnOrdersLoaded',function () {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.orders =  OrdersService.getShowOrderList();
                    console.log('Заказы обновлены');
                });

            },0);
        });


        $scope.clickOrdersFilter = function (ev) {

                $mdDialog.show({
                    controller: 'OrdersFilterController',
                    templateUrl: 'views/personal.orders.filter.dlg.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function(answer) {
                       console.log('фильтр открылся');
                    }, function() {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

        $scope.getFilterState = function () {
            return AppState.getField('ordersFilterSet');
        };

        $scope.clickOrder = function (id) {

            $state.go('personal.orderDetails',{orderId:id});
        };

        $scope.clickMore = function () {
            console.log('Click More');
        };
        
        $scope.getDateFromState = function () {
            return AppState.getField('ordersFilterSet') && AppState.getField('ordersFilter').dateFrom;
        };

        $scope.getDateFrom = function () {
           var myDate = AppState.getField('ordersFilter').dateFrom;
           return myDate.getDate()+'/'+(myDate.getMonth()+1) + '/' + myDate.getFullYear();
        };

        $scope.getDateToState = function () {
            return AppState.getField('ordersFilterSet') && AppState.getField('ordersFilter').dateTo;
        };

        $scope.getDateTo = function () {
            var myDate = AppState.getField('ordersFilter').dateTo;
            return myDate.getDate()+'/'+(myDate.getMonth()+1) + '/' + myDate.getFullYear();
        };
    }])
})();
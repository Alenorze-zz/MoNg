(function () {
angular.module('Monorythm')
    .controller('OrdersFilterController',['$scope','$mdDialog','AppState','$mdToast','$cookies','OrdersService',function ($scope,$mdDialog,AppState,$mdToast,$cookies,OrdersService) {


        var cDate = new Date();
        cDate.setHours(0,0,0,1);
        var monthBefore = new Date();
        monthBefore.setMonth(cDate.getMonth()-1);
        monthBefore.setHours(0,0,0,1);

        // Проверяем: если фильтр установлен - получаем фильтр,
        // Если не установлен - получаем фильтр по умолчанию
        if(AppState.getField('ordersFilterSet')){
            $scope.filterData = AppState.getField('ordersFilter');
        }else{
            $scope.filterData = {
                dateFrom: monthBefore,
                dateTo: cDate,
                requests: true,
                orders: true,
                closed: true
            };
          //  console.log('Создали новый фильтр',$scope.filterData);
        }


        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.isFilterSet = function () {
            return AppState.getField('ordersFilterSet');
        };

        $scope.setFilter = function () {

            $scope.filterData.dateFrom.setHours(0,0,0,1);
            $scope.filterData.dateTo.setHours(0,0,0,1);

            // Установленный фильтра аналогичен предыдущему
            if(JSON.stringify($scope.filterData) == JSON.stringify({
                    dateFrom: monthBefore,
                    dateTo: cDate,
                    requests: true,
                    orders: true,
                    closed: true
                })){
               // console.log('аналогичен дефолтному');
               // Сообщаем что Фильтр снят: параметры фильтра равны параметрам по умолчанию

                if(AppState.getField('ordersFilterSet'))
                    $mdToast.show( $mdToast.simple()
                        .textContent('Фильтр снят: параметры фильтра равны параметрам по умолчанию.')
                        .position('top right' )
                        .hideDelay(3000) );
                else
                    $mdToast.show( $mdToast.simple()
                        .textContent('Фильтр не установлен: параметры фильтра равны параметрам по умолчанию.')
                        .position('top right' )
                        .hideDelay(3000) );

                $scope.unsetFilter();


            }else{
              $scope.updateFilter();
            }
            
        };

        $scope.unsetFilter = function () {
            AppState.setField('ordersFilterSet',false);
            $cookies.putObject('ordersFilter',null);
            OrdersService.loadOrderList();
            $mdDialog.hide();
        };

        $scope.updateFilter = function () {
            AppState.setField('ordersFilterSet',true);
            AppState.setField('ordersFilter',$scope.filterData);

            $cookies.putObject('ordersFilter',JSON.stringify($scope.filterData));
            console.log('Сохранение фильтра',JSON.stringify($scope.filterData));
            OrdersService.loadOrderList();
            $mdDialog.hide();
        }
    }])
})();
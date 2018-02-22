(function () {
angular.module('Monorythm').controller('PaymentsFilterController',['$scope','$mdDialog','AppState','$mdToast','$cookies','PaymentsService','$timeout',function ($scope,$mdDialog,AppState,$mdToast,$cookies,PaymentsService,$timeout) {

    var cDate = new Date();
    cDate.setHours(0,0,0,1);
    var monthBefore = new Date();
    monthBefore.setMonth(cDate.getMonth()-1);
    monthBefore.setHours(0,0,0,1);

    // Если фильтр установлен: выставляем его
    if( AppState.getField('paymentsFilterSet')){
        $scope.filterData = AppState.getField('paymentsFilter');
    }else{ // Если фильтр не установлен - выставляем дефолтные значения
        $scope.filterData = {
            dateFrom:monthBefore,
            dateTo:cDate
        }
    }



    $scope.cancel = function () {
        $mdDialog.hide();
    };

    $scope.isFilterSet = function () {
        return AppState.getField('paymentsFilterSet');
    };

    $scope.setFilter = function () {

        // Если устанавливаемый фильтр равен фильтру по умолчанию
        if(JSON.stringify($scope.filterData) == JSON.stringify({
                dateFrom:monthBefore,
                dateTo:cDate
            })){

            $mdToast.show( $mdToast.simple()
                .textContent('Фильтр снят - параметры равны отображению по умолчанию.')
                .position('top right' )
                .hideDelay(3000) );
            $scope.unsetFilter();


        }else{

            $scope.filterData.dateFrom.setHours(0,0,0,1);
            $scope.filterData.dateTo.setHours(0,0,0,1);

            AppState.setField('paymentsFilterSet',true);
            AppState.setField('paymentsFilter',$scope.filterData);
            $cookies.putObject('paymentsFilter',$scope.filterData);

            $timeout(PaymentsService.loadPayments(),0);
            $mdDialog.hide();
        }

    };

    $scope.unsetFilter = function () {
        AppState.setField('paymentsFilterSet',false);
        $cookies.putObject('paymentsFilter',null);
        $timeout(PaymentsService.loadPayments(),0);
        $mdDialog.hide();
    }
}]);
})();
(function () {
angular.module('Monorythm')
    .controller('PaymentsController',['$scope','AppState','$mdDialog','PaymentsService','$timeout',function ($scope,AppState,$mdDialog,PaymentsService,$timeout) {


        $scope.payments = null; // Тут будет объект с платежами

        // Обновляем данные при перезагрузке платежей
        $scope.$on('mnPaymentsLoaded',function () {
            $timeout(function () {
                $scope.payments = PaymentsService.getPayments();
                $scope.$apply();
            },0);
        });

        $scope.getDocDate = function (dateStr) {

            var months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];

            var dDate = new Date(dateStr);

            var res = dDate.getDate()+' '+months[dDate.getMonth()] + ' '+dDate.getFullYear();

            return res;
        };

        $scope.getAmount = function (doc) {

            res = '';

            if(doc.hideOperationCurrencyInDocument){ // Глобальная валюта
                if(doc.incomeInOperationCurrency){ // операция поступления
                    res += doc.incomeInOperationCurrency + ($scope.payments.currency=='RUR'?' p. ':' '+$scope.payments.currency)
                }else if(doc.outgoInOperationCurrency){ // операция расхода (с минусом)
                    res += '-'+doc.outgoInOperationCurrency + ($scope.payments.currency=='RUR'?' p. ':' '+$scope.payments.currency)
                }

            }else{ // Валюта документа
                if(doc.incomeInOperationCurrency){ // операция поступления
                    res += doc.incomeInOperationCurrency + (doc.operationCurrency=='RUR'?' p. ':' '+doc.operationCurrency)
                }else if(doc.outgoInOperationCurrency){ // операция расхода (с минусом)
                    res += '-'+doc.outgoInOperationCurrency + (doc.operationCurrency=='RUR'?' p. ':' '+doc.operationCurrency)
                }
                res +=', курс: '+doc.currencyRatio;

            }

            return res;
        };

        $scope.getBalanceCurr = function () {

            if($scope.payments){
                if($scope.payments.currency == 'RUR')
                    return 'р.';
                else
                    return $scope.payments.currency;
            }else{
                return '';
            }
        };

        $scope.clickPaymentsFilter = function (ev) {

            $mdDialog.show({
                controller: 'PaymentsFilterController',
                templateUrl: 'views/personal.payments.filter.dlg.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = ('фильтр принят');
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.getFilterState = function () {
            return AppState.getField('paymentsFilterSet');
        };

        $scope.getDateFromState = function () {
            return AppState.getField('paymentsFilterSet') && AppState.getField('paymentsFilter').dateFrom;
        };

        $scope.getDateFrom = function () {
            var myDate = AppState.getField('paymentsFilter').dateFrom;
            return myDate.getDate()+'/'+(myDate.getMonth()+1) + '/' + myDate.getFullYear();
        };

        $scope.getDateToState = function () {
            return AppState.getField('paymentsFilterSet') && AppState.getField('paymentsFilter').dateTo;
        };

        $scope.getDateTo = function () {
            var myDate = AppState.getField('paymentsFilter').dateTo;
            return myDate.getDate()+'/'+(myDate.getMonth()+1) + '/' + myDate.getFullYear();
        };
    }])
})();
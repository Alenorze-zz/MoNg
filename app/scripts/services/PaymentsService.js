/**
 *  Сервис для работы с платежами
 */

(function () {
angular.module('Monorythm')
    .service('PaymentsService',['$rootScope','$http','AuthService','AppState','$timeout','$cookies',function ($rootScope,$http,AuthService,AppState,$timeout,$cookies) {

        var payments = null;

        var getPaymentsUrl = AppState.getField('baseApiUrl')+'/api/settlements';

        var savedFilter = $cookies.getObject('paymentsFilter');

        // console.log('Сохраненный фильтр',savedFilter);
        if(typeof savedFilter !='undefined' && savedFilter){

         //   console.log('Фильтр платежей',savedFilter);
            AppState.setField('paymentsFilterSet',true);

            // var parsedFilter  = JSON.parse(savedFilter);
            var parsedFilter = {};
            parsedFilter.dateFrom = new Date(savedFilter.dateFrom);
            parsedFilter.dateTo = new Date(savedFilter.dateTo);
           //  console.log('Распарсеный фильтр',parsedFilter);
            AppState.setField('paymentsFilter',parsedFilter);
        }

        var loadPayments = function (fromTimeout) {

            // Если пришли из таймаута, тогда обходим защиту от повторного запуска интервала
            if(typeof fromTimeout != 'undefined' && fromTimeout);
                AppState.setField('paymentsLoading',false);

            // Платежи можно загрузить только если пользователь авторизован
            if(AppState.getField('authorized') && !AppState.getField('paymentsLoading')){

                AppState.setField('paymentsLoading',true);

                var cDate = new Date();
                cDate.setHours(0,0,0,1);
                var monthBefore = new Date();
                monthBefore.setMonth(cDate.getMonth()-1);
                monthBefore.setHours(0,0,0,1);

                var filter = {
                  dateFrom: monthBefore,
                  dateTo: cDate
                };

                // Если фильтр устанавливаем - ставим его
                if(AppState.getField('paymentsFilterSet')){
                    filter = AppState.getField('paymentsFilter');
                }

                // Фильтр дат
                var params = {
                    from: filter.dateFrom.getFullYear()+'-'+(filter.dateFrom.getMonth()+1)+'-'+filter.dateFrom.getDate(),
                    to: filter.dateTo.getFullYear()+'-'+(filter.dateTo.getMonth()+1)+'-'+filter.dateTo.getDate()
                };

              //  debugger;

                var url = getPaymentsUrl+'?from='+params.from+'&to='+params.to;

                var config = {headers: {
                    'Authorization': 'Bearer '+AuthService.getBearer()
                }};

                $http.get(url,config)
                    .then(function (res) {
                        console.log('Платежи загружены',res);

                        payments = res.data;
                        AppState.setField('paymentsLoading',false);
                        $rootScope.$broadcast('mnPaymentsLoaded');
                        AppState.setField('paymentsLoaded',true);
                    })
                    .catch(function (err) {

                        // Если ошобка авторизации - прекращаем попытки загрузки
                        if(err.status = 403){
                            AppState.setField('paymentsLoading',false);
                            AuthService.exit();
                        }else{ // При любых других ошибках - грузим, пока не загрузится
                            $timeout(function () {
                                loadPayments(true);
                            },300);

                        }
                        console.log('Ошибка при загрузке платежей',err)
                    })
            }
        };

        // сразу после авторизации загружаем платежи по данному клиенту
        $rootScope.$on('JustAuthorized',function () {
            loadPayments();
        });

        return {
            loadPayments:loadPayments,
            getPayments:function () {
                return payments;
            }
        }
    }])
})();

/**
 * Директива отображающая платежи в личном кабинете
 */

(function () {
angular.module('Monorythm')
    .directive('mnOrdersPayments',['AppState','$timeout','$compile','PaymentsService',function (AppState,$timeout,$compile,PaymentsService) {
        var myScope;
        var myElement;

        var mainTemlate = '<div class="content-view">\
            <md-toolbar class="md-whiteframe-z2 content-toolbar">\
            <div class="md-toolbar-tools"> Взаиморасчеты\
            <div ng-if="getDateFromState()"> &nbsp;c: {{getDateFrom()}}</div>\
        <div ng-if="getDateToState()"> &nbsp;по: {{getDateTo()}}</div>\
        <div flex></div>\
        <md-button class="md-icon-button" aria-label="Orders Filter" ng-click="clickPaymentsFilter($event)">\
            <md-tooltip md-direction="left" >Фильтр расчетов</md-tooltip>\
        <div class="fa fa-filter" ng-class="getFilterState()?\'text-warn\':\'\'" ></div>\
            </md-button>\
            </div>\
            </md-toolbar>\
\
            <md-content flex mn-fix-height="100">\
\
            <p class="md-padding">Сальдо на начало: <b>{{payments.openingBalance}} {{getBalanceCurr()}}</b> <br>Сальдо на конец: <b>{{payments.closingBalance}} {{getBalanceCurr()}}</b></p>\
\
        <md-list flex>\
\
        <md-list-item class="md-3-line md-long-text" ng-click="null" ng-repeat="doc in payments.documents">\
            <div layout="row">\
            <div class="md-padding" hide-xs>#{{doc.number}}</div>\
        <div class="md-list-item-text">\
            <h3><span hide-gt-xs>#{{doc.number}} </span>{{doc.type}}</h3>\
        <p>\
        Дата: {{getDocDate(doc.date)}}\
        </p>\
        </div>\
        <div class="md-secondary">\
            {{getAmount(doc)}}\
        </div>\
\
        </div>\
        </md-list-item>\
\
        </md-list>\
\
        <br><br>\
        </md-content>\
        </div>';

        // Загрузка данных по платежам
        var loadScopeData = function () {
            // Если платежи зугружены
            if(AppState.getField('paymentsLoaded')){
                // Загружаем платежи в scope
                myScope.payments = PaymentsService.getPayments();
                // Компилируем основной шаблон и отображаем на странице

                $compile(mainTemlate)(myScope,function (elt,scp) {
                   myElement.empty();
                   myElement.append(elt);
                });

                PaymentsService.loadPayments();

            }else{  // Платежи не загружены
                
                // Если процедура загрузки инициирована - просто ждем
                if(AppState.getField('paymentsLoading')){
                    $timeout(loadScopeData,300);
                }else{ // Инициируем процедуру загрузки асинхронно и ждем
                    PaymentsService.loadPayments();
                    $timeout(loadScopeData,300);
                }
            }

        };

        return {
            restrict: 'E',
            template: '<md-content flex class="content-blocks"><div class="loading-center"><md-progress-circular md-diameter="96"></md-progress-circular></div></md-content>',
            link: function (scp,elt,attr) {
                myScope = scp;
                myElement = elt;

                loadScopeData();

            }
        }
    }])
})();

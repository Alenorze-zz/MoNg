/**
 * Директива отображающая список заказов
 */

(function () {
angular.module('Monorythm')
    .directive('mnOrdersList',['AppState','$timeout','$compile','OrdersService',function (AppState,$timeout,$compile,OrdersService) {

        var headerTemplate = '<md-content flex mn-fix-height="100">\
            <md-list flex>\
        <md-list-item class="md-3-line md-long-text" ng-repeat="order in orders" ng-click="clickOrder(order.id)">\
            <div layout="row">\
            <div class="md-padding" hide-xs>#{{order.number}}</div>\
        <div class="md-list-item-text">\
            <h3><span hide-gt-xs>#{{order.number}} </span>{{order.title}}</h3>\
        <p>\
       {{order.content}}\
        </p>\
        </div>\
\
        </div>\
        </md-list-item>\
\
        <br><br>\
\
        </md-list>\
\
        </md-content>';

        var myScope;
        var myElement;

        var showOrders = function () {
            // Если заказы загружены, ждем когда будут загружены
            if(AppState.getField('ordersLoaded')){
                
                var resTmpl = headerTemplate;

                // массив с заказами из сервиса

                myScope.orders = OrdersService.getShowOrderList();

                $compile(resTmpl)(myScope,function (elt,scope) {
                    myElement.empty();
                    myElement.append(elt);
                });

                OrdersService.loadOrderList();
            }else{
                $timeout(showOrders,300);
            }
        };

        return {
            restrict: 'E',
            template: '<div class="mn-orders-list"><div class="loading-center"><md-progress-circular md-diameter="96"></md-progress-circular></div></div>',
            link: function (scp,elt,attr) {
                myScope = scp;
                myElement = elt;
                showOrders();
            }
        }
    }])
})();

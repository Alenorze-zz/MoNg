/**
 * Директива со страницей карточки заказа
 */

(function () {
angular.module('Monorythm')
    .directive('mnOrdersDetails',['$stateParams','OrdersService','$timeout','AppState','$compile',function ($stateParams,OrdersService,$timeout,AppState,$compile) {

        var myScope;
        var myElement;

        var mainTemplate = '<md-toolbar class="md-whiteframe-z2 content-toolbar">\
            <div class="md-toolbar-tools"> Заказ №{{details.properties.number}} {{details.properties.name}}\
        <div flex></div>\
        <md-button class="md-icon-button" aria-label="Отправить счет по почте" ng-show="isEmail()" ng-click="sendInvoice()">\
            <md-tooltip md-direction="left" >Отправить счет по почте</md-tooltip>\
        <div class="fa fa-envelope-o "></div>\
            </md-button>\
            <md-button class="md-icon-button" aria-label="Отправить счет по почте" ng-click="loadInvoice()">\
            <md-tooltip md-direction="left" >Распечатать счет</md-tooltip>\
        <div class="fa fa-print "></div>\
            </md-button>\
            </div>\
            </md-toolbar>\
             <div cg-busy="{promise:detailsLoadingPromise,templateUrl:\'views/progress-linear.tmpl.html\',wrapperClass: \'cg-busy\'}" class="loading-control"></div>\
\
            <md-content flex class="content-blocks" mn-fix-height="100">\
\
            <p>\
            Дата заказа: {{getCreationDate()}}\
        </p>\
        <h3>Файлы заказа</h3>\
\
        <div class=" param-block files-block" ng-show="details.files.detials.length > 0" ng-repeat="detail in details.files.detials">\
\
            <md-toolbar>\
\
            <div class="md-toolbar-tools">\
            {{detail.name}}\
            <div flex></div>\
\
        <md-button class="md-icon-button" ng-click="clickAddFile(detail.id,orderId)">\
            <md-tooltip md-direction="left">Добавить файл</md-tooltip>\
        <i class="fa fa-plus"></i>\
            </md-button>\
            </div>\
\
            </md-toolbar>\
\
            <md-list class="md-whiteframe-z1" ng-show="detail.files.length > 0">\
            \
            <md-list-item ng-click="null" class="order-item" ng-repeat="file in detail.files">\
            Файл: {{file.fileName}} , Комментарий: {{file.comment}}\
        <div class="md-secondary">\
            <md-menu>\
            <md-button class="md-icon-button" ng-click="$mdMenu.open()">\
            <md-icon class="md-icon-button">more_vert</md-icon>\
            </md-button>\
\
            <md-menu-content width="4">\
            <md-menu-item >\
            <md-button ng-click="clickEditFile(detail.id,file.fileName)" >\
            Изменить\
            </md-button>\
            </md-menu-item>\
            <md-menu-item >\
            <md-button ng-click="clickDeleteFile(detail.id,file.fileName)">\
            Удалить\
            </md-button>\
            </md-menu-item>\
            </md-menu-content>\
            </md-menu>\
            </div>\
            </md-list-item>\
\
            \
            </md-list>\
\
            </div>\
\
            \
\
            <h3 ng-show="details.documents.length > 0">Документы заказа</h3>\
\
        <div class=" param-block files-block" ng-show="details.documents.length > 0">\
            <md-list class="md-whiteframe-z1">\
            <md-list-item ng-click="null" ng-repeat="doc in details.documents">\
           {{doc.name}} от {{getDate(doc.creationDate)}}. Cумма {{doc.sum}} {{getCurr(doc.currency)}} \
        </md-list-item>\
\
        </md-list>\
\
        </div>\
\
        <br><br>\
\
        </md-content>';

        //  Функция получает объект с деталями заказа в scope
        //   компилирует и вставляет основной шаблон
        var showDetails = function () {
            myScope.details = OrdersService.getOrderDetails(myScope.orderId);
            console.log('Детали заказа',myScope.details);

            $compile(mainTemplate)(myScope,function (elt,scp) {
                myElement.empty();
                myElement.append(elt);
            })
        };

        var waitLoading = function () {
            // Если заказы еще не загружены - ждем
            if(!AppState.getField('ordersLoaded'))
                $timeout(waitLoading,300);
            else{
                var ordersDetails = OrdersService.getOrdersDetails();
              //  debugger;

                if(ordersDetails[myScope.orderId].loaded){ // Если карточка уже загружена показываем детали
                    showDetails();
                }
                else{ // Ждем еще
                    $timeout(waitLoading,300);
                }
            }


        };


        return {
            restrict: 'E',
            template: '<md-content flex class="content-blocks"><div class="loading-center"><md-progress-circular md-diameter="96"></md-progress-circular></div></md-content>',
            link: function (scp,elt,attr) {
                myScope = scp;
                myElement = elt;
                
                console.log('Карточка товара: ',$stateParams.orderId);
                scp.orderId = Number($stateParams.orderId);

                if(scp.orderId){ // Если указан входной параметр
                    var ordersDetails = OrdersService.getOrdersDetails();

                    if(ordersDetails[scp.orderId.loaded]){ // Если карточка уже загружена
                        // Сразу отображаем шаблон карточки

                        showDetails();
                       // console.log('Первая ветка',ordersDetails[scp.orderId]);
                        // Запускаем обновление карточки на всякий случай
                        OrdersService.loadOrderDetails(scp.orderId);
                        
                    }else{
                        // Запускаем обновление карточки
                       // console.log('Вторая ветка');
                        OrdersService.loadOrderDetails(scp.orderId);
                        // Ожидаем пока карточка не обновиться - крутим колесико,
                        waitLoading();
                    }
                }

            }
        }
    }])
})();

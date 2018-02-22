
/**
 *  Сервис который хранит в себе информацию о заказах
 */
(function () {
angular.module('Monorythm')
    .service('OrdersService',['$rootScope','AuthService','AppState','$http','$cookies','$timeout','$q',function ($rootScope,AuthService,AppState,$http,$cookies,$timeout,$q) {

        var savedFilter = $cookies.getObject('ordersFilter');

        console.log('Сохраненный фильтр',savedFilter);
        if(typeof savedFilter !='undefined' && savedFilter){
            AppState.setField('ordersFilterSet',true);

            var parsedFilter  = JSON.parse(savedFilter);
            parsedFilter.dateFrom = new Date(parsedFilter.dateFrom);
            parsedFilter.dateTo = new Date(parsedFilter.dateTo);
            // console.log('Распарсеный фильтр',parsedFilter);
            AppState.setField('ordersFilter',parsedFilter);
        }

        // Список полей заказов (как оно приходит)
        var orderFields,orderList = [];

        //  Поля заказа для отображения
        var showOrderList = [];

        // Хэш - карточки заказов по ID
        var orderDetails = [];


        var getOrdersPropertiesUrl = AppState.getField('baseApiUrl')+'/api/orders/properties'; // URL API получения свойств заказов
        var getOrdersUrl = AppState.getField('baseApiUrl')+'/api/orders'; // URL API для загрузки списка заказов


        // Сразу после авторизации загружаем список свойств заказов и список заказов
        $rootScope.$on('JustAuthorized',function () {
           loadOrderList();
        });
        // Отправка счета на Email
        var sendInvoice = function (orderId) {
            return $q(function (resolve,reject) {
                url = getOrdersUrl + '/' + orderId + '/invoice/send';

                var config = {headers: {
                    'Authorization': 'Bearer '+AuthService.getBearer()
                }};

                $http.get(url,config)
                    .then(function (res) {
                        resolve(res);
                    })
                    .catch(function (err) {

                        var msg;
                        switch(err.status){
                            case -1:
                                msg = 'network';
                                break;
                            case 403:
                                msg = 'auth';
                                break;
                            default:
                                msg = 'undefined';

                        }

                        reject(msg);
                    });

            });
        };

        // Функция загружает список полей заказов и список заказов
        var loadOrderList = function () {
            var cDate = new Date();
            var oldDate = new Date(cDate.setMonth(cDate.getMonth()-1));
            var orderParams = { // Фильтр по умолчанию
                fromStr: oldDate.getFullYear()+'-'+(oldDate.getMonth()+1)+'-'+oldDate.getDate(),
                toStr: cDate.getFullYear()+'-'+(cDate.getMonth()+1)+'-'+cDate.getDate(),
                bids: true,
                orders: true,
                closed: true
            };

            if(AppState.getField('ordersFilterSet')){
                var savedFilter = AppState.getField('ordersFilter');

                orderParams.fromStr = savedFilter.dateFrom.getFullYear() + '-'+(savedFilter.dateFrom.getMonth()+1)+'-'+savedFilter.dateFrom.getDate();
                orderParams.toStr = savedFilter.dateTo.getFullYear() + '-'+(savedFilter.dateTo.getMonth()+1)+'-'+savedFilter.dateTo.getDate();
                orderParams.bids = savedFilter.requests;
                orderParams.orders = savedFilter.orders;
                orderParams.closed = savedFilter.closed;
            }

            console.log('Получились параметры',orderParams);


            // Ключ номера и заголовка заказа в списке должны быть указаны в настройках
            var orderNumKey = AppState.getConfField('orderNumberKey');
            var orderTitleKey = AppState.getConfField('orderTitleKey');

            if(typeof orderNumKey == 'undefined' || !orderNumKey || typeof orderTitleKey == 'undefined' ||!orderTitleKey ){
                console.error('В настройках приложения не указаны ключи номера или названия заказа - невозможно отобразить список заказов');
                return;
            }
            

            var config = {headers: {
                'Authorization': 'Bearer '+AuthService.getBearer()
            }};

            // TODO временно заглушенные данные
            var getOrdersReq = getOrdersUrl+"?";
            getOrdersReq += 'from='+orderParams.fromStr;
            getOrdersReq += '&to='+orderParams.toStr;
            //getOrdersReq += 'from=2000-01-01';
            //getOrdersReq += '&to=2020-12-31';
            getOrdersReq += '&bids='+orderParams.bids;
            getOrdersReq += '&orders='+orderParams.orders;
            getOrdersReq += '&closed='+orderParams.closed;

            console.log('Запрос',getOrdersReq);

            Promise.all([$http.get(getOrdersPropertiesUrl,config),
                $http.get(getOrdersReq,config)])
                    .then(function (fields) {

                        orderFields = fields[0].data;
                        orderList = fields[1].data;

                        // Формируем хэш с названиями полей
                        var fieldsHash = {};

                        for(var k=0; k< orderFields.length; k++){

                            fieldsHash[orderFields[k].columnName] = orderFields[k].displayName;
                        }

                    //  console.log('Хэш с названиями полей',fieldsHash);
                        // список заказов для отображения
                        showOrderList = [];

                        // хэш с карточками заказов
                        orderDetails = {};

                        // Для каждого из полученных заказов
                        for(var i=0; i<orderList.length; i++){

                            var orderItem = {
                                id: orderList[i].id,
                                status: orderList[i].status,
                                number: orderList[i].values[orderNumKey],
                                title: orderList[i].values[orderTitleKey],
                                content: 'Тип заказа: '+(orderList[i].status == 1?'заказ':'заявка')+', '

                            };


                            // Для каждого из ключей объекта
                            for(key in orderList[i].values){
                                if(orderList[i].values.hasOwnProperty(key)){
                                    if(key != orderNumKey &&  key != orderTitleKey && orderList[i].values[key] != null ){
                                        orderItem.content += fieldsHash[key]+': ';
                                        orderItem.content += orderList[i].values[key]+', ';
                                    }
                                }
                            }

                            if(orderItem.content){
                                orderItem.content = orderItem.content.slice(0,-2);
                            }

                            showOrderList.push(orderItem);

                            // карточка заказа
                            orderDetails[orderList[i].id] = {
                                loaded: false,
                                properties: {},
                                files: {},
                                documents: {}
                            }

                        }
                        console.log('Детальные карточки заказов',orderDetails);
//                            console.log('ЗАказы для отображения',showOrderList);
                        AppState.setField('ordersLoaded',true);
                        $rootScope.$broadcast('mnOrdersLoaded');
                    // console.log('Поля заказа',fields);
                    })
                    .catch(function (err) {
                        console.log('Ошибка загрузки полей заказа',err);
                    });
    

        };

        // Функция загружает детальную информацию по заказу
        // var loadOrderDetails = function (orderId) {

        //     if(AppState.getField('ordersLoaded')){
        //         if(AppState.getField('authorized')){

        //             var config = {headers: {
        //                 'Authorization': 'Bearer '+AuthService.getBearer()
        //             }};

        //             var urlProps = getOrdersUrl+'/'+orderId;
        //             var urlDocs = urlProps+'/documents';
        //             var urlFiles =  urlProps+'/files';

        //             Promise.all([$http.get(urlProps,config),
        //                 $http.get(urlFiles,config),$http.get(urlDocs,config)])
        //                 .then(function (res) {

        //                     orderDetails[orderId].properties = res[0].data;
        //                     orderDetails[orderId].files = res[1].data;
        //                     orderDetails[orderId].documents = res[2].data;
        //                     orderDetails[orderId].loaded = true;
        //                     $rootScope.$broadcast('OrderLoaded',{orderId:orderId});
        //                     // console.log('Детали заказа загружены',res);
        //                 })
        //                 .catch(function (err) {
        //                     console.log('Ошибка при загрузке деталей заказа',err);
        //                 })
        //         }
        //     }else{
        //         $timeout(function () {
        //             loadOrderDetails(orderId)
        //         },300);
        //     }


        // };

        // return {
        //     loadOrderList:loadOrderList,
        //     getShowOrderList: function () {
        //         return showOrderList;
        //     },
        //     getOrdersDetails: function () {
        //         return orderDetails;
        //     },loadOrderDetails:loadOrderDetails,
        //     getOrderDetails: function (orderId) {
        //         return orderDetails[orderId];
        //     },
        //     sendInvoice:sendInvoice,
        //     initOrderDetails: function (orderId) {
        //         orderDetails[orderId] = {
        //             loaded: false,
        //             properties: {},
        //             files: {},
        //             documents: {}
        //         }
        //     }

        // }


    }]);
})();

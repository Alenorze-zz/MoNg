(function () {
    angular
        .module('Monorythm')
        .service('AppState', function () {
            var cDate = new Date();
            var monthBefore = new Date();
            monthBefore.setMonth(cDate.getMonth()-1);

            var state = {
              authorized: false, // true - если пользователь авторизован в приложении
              ordersFilterSet: false, // true - если установлен фильтр в списке заказов
              ordersFilter: {}, // Поле для сохранения установленного фильтра заказа
              paymentsFilterSet: false, // true - если установлен фильтр в списке расчетов
              paymentsFilter: {}, // объект с фильтром платежей
              orderCalculated: false, // заказ рассчитан и готов к заказу
              orderFields: "", // калькулированные поля заказа как JSON
              calcObject: {}, // обхект отпрвляемый на расчет
              baseApiUrl: "http://localhost:3001", // Базовый URL для API
              productsLoaded: false, // Флаг - Статус загрузки каталога продуктов
              ordersLoaded: false, // Флаг - Статус загрузки полей заказа текущего пользователя
              paymentsLoaded: false, //  Флаг - статус загрузки списка платежей
              paymentsLoading: false, // Флаг что бы несколько раз не запускать процесс загрузки
              baseSettings: null, // Здесь должен быть объект с основными настройками
              settingsLoaded: false, // загрузили настойки из API
              stopChangeState: false  // ошидаем загрузки всего в Auth блоке
            };

            var config = {};

            if(typeof mnConfigData != 'undefined'){
                for(var k in mnConfigData){
                    if(mnConfigData.hasOwnProperty(k)){
                        config[k]=mnConfigData[k];
                    }
                }

                if(config.baseApiUrl)
                        state.baseApiUrl = config.baseApiUrl;
            }
            
            return {
                getField: function (field) {
                    return state[field];
                },
                setField: function (field,value) {
                    state[field] = value;
                },
                getConfField: function (field) {
                    return config[field];
                }
            }
        })
})();
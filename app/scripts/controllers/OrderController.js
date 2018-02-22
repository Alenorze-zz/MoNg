(function () {
angular.module('Monorythm')
    .controller('OrderController',['$scope','$mdToast','AppState','$mdDialog','$state',function ($scope,$mdToast,AppState,$mdDialog,$state) {

        // Перечисляем все поля формы для того что бы в JSON они всегда были в нужном порядке для сравнения
        $scope.order = {
            amount: undefined,
            urgency: undefined,
            sourceMaterials: undefined,
            coverFormat: undefined,
            beautifulness: undefined,
            beautifulness1: undefined,
            beautifulness2: undefined,
            beautifulness3: undefined,
            happinesDay: new Date()
        };

        $scope.formatStates = [
                {   id: 0,
                    display: "A0 841x1189",
                    short: "841x1189"},
            {   id: 1,
                display: "A1 594x891",
                short: "594x891"},
            {   id: 2,
                display: "A1+ 700x1000",
                short: "700x1000"},
            {   id: 3,
                display: "A2 420x594",
                short: "420x594"},
            {   id: 4,
                display: "A3 247x420",
                short: "247x420"},
            {   id: 5,
                display: "A3+ 360x505",
                short: "360x505"},
            {   id: 6,
                display: "A4 210x297",
                short: "210x297"},

            ];

        $scope.createFilterFor = function (query){


            var lowercaseQuery = angular.uppercase(query);

            var filterFn =function(state) {

                return (!(state.display.indexOf(lowercaseQuery) == -1));
            };

            return $scope.formatStates.filter(filterFn);

        };

        $scope.showErrors = false;

        // Закрытие окна диалога без действия
        $scope.cancel = function () {
            $mdDialog.hide();
        };

        // Функция перехода на заданное состояние
        $scope.goState = function (state) {
            $state.go(state);
        };

        // пользователь авторизован или нет
        $scope.isAuthorized = function () {
            return AppState.getField('authorized');
        };

        // Нажатие на кнопку Заказать не авторизованного
        $scope.makeOrderNoauth = function (ev) {
            $mdDialog.show({
                controller: 'OrderController',
                templateUrl: 'views/catalog.order.sendnoauth.dlg.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };
        
        // Нажатие на кнопку Заказать авторизованного
        $scope.makeOrderAuth = function (ev) {
                  $mdDialog.show({
                      controller: 'OrderController',
                      templateUrl: 'views/catalog.order.sendauth.dlg.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                  });
        };


        // Сброс заказа в $scope и в сервисе
        $scope.resetOrder = function () {
            $scope.order = {
                amount: undefined,
                urgency: undefined,
                sourceMaterials: undefined,
                coverFormat: undefined,
                beautifulness: undefined,
                beautifulness1: undefined,
                beautifulness2: undefined,
                beautifulness3: undefined
            };

            $scope.showErrors = false;

            AppState.setField('orderCalculated',false);
            AppState.setField('orderFields','');
        };

        // отправка заказа из диалога авторизованного пользователя
        $scope.sendOrderAuth = function () {
            $mdDialog.hide();
            $scope.resetOrder();
            $state.go('personal.orderDetails')
        };

        // отправка заказа из диалога не авторизованного пользователя
        $scope.sendOrderNoAuth = function () {
            $mdDialog.hide();
            $scope.resetOrder();
            $state.go('ordersuccess')
        };


        // Нажатие на кнопку "Рассчитать"
        $scope.calculate = function () {

           // console.log($scope.orderForm);
            $('#orderContent').scrollTop(0);

            if($scope.orderForm.$invalid){
                $scope.showErrors = true;
            }else{
                $scope.showErrors = false;
                AppState.setField('orderFields',JSON.stringify($scope.order)); // сохраняем рассчитаный заказ в сервисе

                AppState.setField('orderCalculated',true);
            }
        };


        // Изменился ли заказ по сравнению с тем, что в сервисе
        $scope.isOrderChanged = function () {

          var newOrder = JSON.stringify($scope.order);
          var oldOrder = AppState.getField('orderFields');

          return newOrder === oldOrder;


        };

        // Управление свертыванием/развертыванием на странице
        $scope.toggles = {
            calculation:false,
            calculationBlock1:false,
            calculationBlock2:false
        };

        // Рассчитан ли заказ?

        $scope.priceMustShow = function () {

          return AppState.getField('orderCalculated') && $scope.isOrderChanged();
        };

        // Срочность
        $scope.urgencies = [
            {
                id: '0',
                name: 'Не срочно'
            },
            {
                id: '1',
                name: 'Побыстрее бы'
            },
            {
                id: '2',
                name: 'Срочно'
            },
            {
                id: '3',
                name: 'Очень срочно'
            },
        ];

        // TODO затолкать в сервис
        // Исходные материалы
       
        $scope.sources = [
            {
                id: 0,
                name: 'Оригинал-макет'
            },
            {
                id: 0,
                name: 'Веревка и мыло'
            },

            {
                id: 0,
                name: 'Топор, вода и крупа'
            }
        ];

        // TODO затолкать в сервис
        // Формат обложки
        $scope.coverFormats = [
            {
                id: 0,
                name: '210 x 297'
            },
            {
                id: 1,
                name: '10 x 12'
            },
            {
                id: 2,
                name: '5 x 6'
            },
            {
                id: 3,
                name: '3 x 4'
            }
        ]

    }]);
})();
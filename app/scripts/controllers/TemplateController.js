/*
* Контроллер формы заказа продукта
* */

(function () {
angular.module('Monorythm')
    .controller('TemplateController',['$scope','$stateParams','Products','$q','AppState','$mdDialog','$timeout','$state','$mdToast',function ($scope,$stateParams,Products,$q,AppState,$mdDialog,$timeout,$state,$mdToast) {

        $scope.myOrder = {
            name:'',
            phone:'',
            email: '',
            note: ''
        };

        $scope.cost = {};
        $scope.toggles = {
            calculation:false,
            calculationBlock:{}
        };
        $scope.errors =[];
        $scope.showValidationErrors = false;

        $scope.disableOrderButton = function () {

          var res;

          // если пользователь не авторизован или в настройках запрещен заказ неавторизованному пользовтелю
          // возвращает true ()

          return !AppState.getField('authorized') && !AppState.getField('baseSettings').allowSaveAnonymousCalculation ;
        };

        // Удобочитаемые рубли и другие валюты
        $scope.getCurrency = function (src) {

            if(src = 'RUR')
                src = 'р.';

            return src;
        };

        $scope.noAuthorized = function () {
            return !AppState.getField('authorized');
        };

        // Отмена диалога заказа
        $scope.cancelOrder = function () {
          $mdDialog.cancel();
        };

        // Оформление заказа с авторизацией
        $scope.doAuthOrder = function () {

          var note = $scope.myOrder.note;

           // даже если нет коммента - надо что бы он был true что бы правильно сразботала функция сохранения
          if(!note){
              note = ' ';
          }

          $mdDialog.hide(note);
            
        };


        // Отображение вопросов по формату в зависимости от вопросов анкеты
        $scope.showFormatQuestion = function (questionId) {
            var showRes = true;

            if(typeof $scope.template.formatQuestionsHash[questionId] != 'undefined'){
                // Для каждого из связанных вопросов анкеты
                for(var k=0; k<$scope.template.formatQuestionsHash[questionId].length; k++){
                    var link = $scope.template.formatQuestionsHash[questionId][k];

                    var showQuestion = link.hideWhen?!$scope.order.formAnswers[link.id]:$scope.order.formAnswers[link.id];

                    showRes = showQuestion && showRes;
                }
            }

            return showRes
        };

        // Отображение вопросов по количеству печатных листов в зависимости от вопросов анкеты
        $scope.showPrintedPageQuestion = function (questionId) {

          var showRes = true;

          if(typeof $scope.template.printedPagesQuestionsHash[questionId] != 'undefined'){

              // Для каждого из связанных вопросов анкеты
              for(var k=0; k<$scope.template.printedPagesQuestionsHash[questionId].length; k++){
                  var link = $scope.template.printedPagesQuestionsHash[questionId][k];

                  var showQuestion = link.hideWhen?!$scope.order.formAnswers[link.id]:$scope.order.formAnswers[link.id];

                  showRes = showQuestion && showRes;
              }
          }

          return showRes;

        };

        // Отображеие вопросов по бумаге в зависимости от вопросов анкеты
        $scope.showPaperQuestion = function (sheetId) {

            var showRes = true;

         //   console.log('Данные по связанным вопросам с дистами',$scope.template.linkedSheetsHash);

            if(typeof $scope.template.linkedSheetsHash[sheetId] != 'undefined'){
               // console.log('шаблон ',$scope.template,' лист ',sheetId,' связанный вопрос анкеты ',$scope.template.linkedSheetsHash[sheetId]);

                // Для каждого из связанных вопросов анкеты
                for(var k=0; k<$scope.template.linkedSheetsHash[sheetId].length; k++){
                    var link = $scope.template.linkedSheetsHash[sheetId][k];

                    var showQuestion = link.hideWhen?!$scope.order.formAnswers[link.id]:$scope.order.formAnswers[link.id];

                    showRes = showQuestion && showRes;
                }
            }

            return showRes;
        };

        // Отображение вопроса по цвету в зависимости от повросов анкеты
        $scope.showColorQuestion = function (questionId) {

            // Объект определяющий связи с вопросами анкеты $scope.template.colorQuestionHash

            var showRes = true;
            // Если связей с вопросами анкеты нет - всегда true
            if(typeof $scope.template.colorQuestionHash[questionId] != 'undefined'){
                // console.log('Связи',questionId,$scope.template.colorQuestionHash[questionId]);

                // Для каждой из имеющихся связей, находим вопрос анкеты
                for(var k=0; k< $scope.template.colorQuestionHash[questionId].length; k++){
                    // объект связи
                     var link = $scope.template.colorQuestionHash[questionId][k];

                    var showQuestion = link.hideWhen?!$scope.order.formAnswers[link.id]:$scope.order.formAnswers[link.id];

                    showRes = showQuestion && showRes;
                }
            }
            return showRes;
        };
        
        // Отображение вопроса по количеству деталей в зависимости от вопросов анкеты
        $scope.showDetailQuestion = function (questionId) {

            // Объект определяющий связи с вопросами анкеты $scope.template.colorQuestionHash

            var showRes = true;
            // Если связей с вопросами анкеты нет - всегда true
            if(typeof $scope.template.detailsQuestionsHash[questionId] != 'undefined'){
                // console.log('Связи',questionId,$scope.template.colorQuestionHash[questionId]);

                // Для каждой из имеющихся связей, находим вопрос анкеты
                for(var k=0; k< $scope.template.detailsQuestionsHash[questionId].length; k++){
                    // объект связи
                    var link = $scope.template.detailsQuestionsHash[questionId][k];

                    var showQuestion = link.hideWhen?!$scope.order.formAnswers[link.id]:$scope.order.formAnswers[link.id];

                    showRes = showQuestion && showRes;
                }
            }
            return showRes;
        };

        // Отображение вопроса по операциям в зависимости от вопросов анкеты
        $scope.showOperationsQuestion = function (questionId) {

            // Объект определяющий связи с вопросами анкеты $scope.template.colorQuestionHash

            var showRes = true;
            // Если связей с вопросами анкеты нет - всегда true
            if(typeof $scope.template.linkedDetailOperationsHash[questionId] != 'undefined'){
                // console.log('Связи',questionId,$scope.template.colorQuestionHash[questionId]);

                // Для каждой из имеющихся связей, находим вопрос анкеты
                for(var k=0; k< $scope.template.linkedDetailOperationsHash[questionId].length; k++){
                    // объект связи
                    var link = $scope.template.linkedDetailOperationsHash[questionId][k];

                    var showQuestion = link.hideWhen?!$scope.order.formAnswers[link.id]:$scope.order.formAnswers[link.id];

                    showRes = showQuestion && showRes;
                }
            }
            return showRes;
        };

        
        $scope.doNonAuthOrder = function () {
            if($scope.sendOrderNoauthForm.$invalid){
                // console.log('Форма содержит ошибки');
            }else{
                /*Значения обязательных полей конкатенируются в строку
                * Имя: {значение_имени}\r\n
                 Телефон: {значение_телефона}\r\n
                 Email: {значение_email}\r\n
                 {значение комментария}”и передаются в качестве примечания.
                 */

               var res = "Имя: "+$scope.myOrder.name+"\r\n"+
                       "Телефон: "+$scope.myOrder.phone+"\r\n"+
                       "Email: "+$scope.myOrder.email+"\r\n"+
                       "Комментарий: "+ $scope.myOrder.note;

              $mdDialog.hide(res);
            }
        };

        $scope.makeOrder = function () {


            if(AppState.getField('authorized')){
                $mdDialog.show({
                    controller: 'TemplateController',
                    templateUrl: 'views/catalog.order.sendauth.dlg.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function (note) {
                        $scope.loadingPromise = $q(function (resolve) {
                           Products.postCalculation(null,note)
                               .then(function (res) {

                                       OrdersService.initOrderDetails(res.data.orderId);
                                       $timeout(function () {
                                          OrdersService.loadOrderDetails(res.data.orderId);
                                       },0);
                                        $timeout(function () {
                                           $state.go('personal.orderDetails',{orderId: res.data.orderId});
                                        },0);
                                   
                                    console.log('Заказ  успешно оформлен',res);
                                    resolve();
                                   }
                                   ,function (err) {
                                   // console.log('Ошибки при сохранении заказа',err);
                                   switch(err.status){
                                       case -1:
                                           $mdToast.show( $mdToast.simple()
                                               .textContent('Нет сети. Повторите после подключения к сети Интернет.')
                                               .position('top right' )
                                               .hideDelay(3000) );
                                           break;
                                       default:
                                           $mdToast.show( $mdToast.simple()
                                               .textContent('Произошла неизвестная ошибка при оформлении заказа!')
                                               .position('top right' )
                                               .hideDelay(3000) );
                                   }

                                   resolve();
                               })
                        });

                    },function () {
                        console.log('Отмена заказа');
                    });
                
            }else{
                $mdDialog.show({
                    controller: 'TemplateController',
                    templateUrl: 'views/catalog.order.sendnoauth.dlg.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                }).then(function (res) {
                    // В res пришел массив для note
                    console.log('Оформляем заказ:',res);
                    $scope.loadingPromise = $q(function (resolve) {
                        Products.postCalculation(null,res)
                            .then(function (res) {
                                $timeout(function () {
                                    $state.go('ordersuccess',{orderNumber:res.data.orderNumber});
                                },0);
                                resolve();
                            },function (err) {
                                // console.log('Ошибки при сохранении заказа',err);
                                switch(err.status){
                                    case -1:
                                        $mdToast.show( $mdToast.simple()
                                            .textContent('Нет сети. Повторите после подключения к сети Интернет.')
                                            .position('top right' )
                                            .hideDelay(3000) );
                                        break;
                                    default:
                                        $mdToast.show( $mdToast.simple()
                                            .textContent('Произошла неизвестная ошибка при оформлении заказа!')
                                            .position('top right' )
                                            .hideDelay(3000) );
                                }

                                resolve();
                            });
                    });



                },function () {
                    console.log('Отмена заказа')
                });
            }


        };


        // Инициализация всяких начальных флагов
        $scope.initForm = function () {
            // Расчет не делали
            AppState.setField('orderCalculated',false);
            AppState.setField('orderFields','');
        };

        // Функция отображать или нет поля с калькуляцией
        $scope.showPrice = function () {
            return AppState.getField('orderCalculated') && $scope.isOrderNotChanged();
        };

        $scope.isOrderNotChanged = function () {
            var newOrder = JSON.stringify($scope.order);
            var oldOrder = AppState.getField('orderFields');

            return newOrder === oldOrder;
        };

        //  модель - значения параметров формы
        $scope.order={
            properties: {},
            formAnswers: {},
            formatAnswers: {},
            colorAnswers: {},
            printedPagesAnswers: {},
            detailAnswers: {},
            paperAnswers: {},
            operationParameterAnswers: {}
        };

        // ID шаблона которое пришло в параметре
        $scope.templateId = $stateParams.templateId;
        // загруженный шаблон для отображения данных в форме, инициализиуется
        // в директиве mnProductForm
        $scope.template = {};

        // Нажатие на кнопку Расчитать
        $scope.calculate = function () {

            $('#orderContent').scrollTop(0);

            console.log('Форма заказа',$scope.orderForm);


            if($scope.orderForm.$invalid){
                $scope.showValidationErrors = true;
                return;
            }

            // Формируем JSON который надо отправить для расчета/заказа
            var a = { // Объект - JSON который будет отправлен на сервер
                save:false, // просто расчитать
                templateId: Number($scope.templateId),
                count: Number($scope.order.count),
                properties: [],
                formAnswers: [],
                formatAnswers: [],
                colorAnswers:[],
                printedPagesAnswers:[],
                detailAnswers:[],
                paperAnswers:[],
                operationParameterAnswers:[]
            };

            // Значения параметров
            for (var k in $scope.order.properties){
                if ($scope.order.properties.hasOwnProperty(k)) {
                    // console.log("Key is " + k + ", value is" + $scope.order.properties[k]);

                    a.properties.push({
                        id:Number(k),
                        value:$scope.order.properties[k]
                    });
                }
            }

            // Значения ответов на вопросы анкеты
            for(k in $scope.order.formAnswers){
                if($scope.order.formAnswers.hasOwnProperty(k)){
                    a.formAnswers.push({
                        id:Number(k),
                        answer: Boolean($scope.order.formAnswers[k])
                    });
                }
            }

            // Значения ответов на вопросы по формату
            for(k in $scope.order.formatAnswers){
                if($scope.order.formatAnswers.hasOwnProperty(k)){
                    a.formatAnswers.push({
                        id:Number(k),
                        width:Number($scope.order.formatAnswers[k].width),
                        height:Number($scope.order.formatAnswers[k].height)
                    })
                }
            }

            // Значения ответов на вопросы по цвету
            for(k in $scope.order.colorAnswers){
                if($scope.order.colorAnswers.hasOwnProperty(k)){
                    a.colorAnswers.push({
                        id:Number(k),
                        faceColor:Number($scope.order.colorAnswers[k].faceColor),
                        backColor:Number($scope.order.colorAnswers[k].backColor)
                    })
                }
            }

            // Значения ответов на вопросы о количестве печатных полос
            for(k in $scope.order.printedPagesAnswers){
                if($scope.order.printedPagesAnswers.hasOwnProperty(k)){
                    a.printedPagesAnswers.push({
                        id:Number(k),
                        count:Number($scope.order.printedPagesAnswers[k])
                    });
                }
            }

            // Значения ответов на вопросы о количестве деталей
            for(k in $scope.order.detailAnswers){
                if($scope.order.detailAnswers.hasOwnProperty(k)){
                    a.detailAnswers.push({
                        id:Number(k),
                        count:Number($scope.order.detailAnswers[k])
                    })
                }
            }

            // Значения ответов на вопросы по бумаге
            for(k in $scope.order.paperAnswers){
                if($scope.order.paperAnswers.hasOwnProperty(k)){
                    a.paperAnswers.push({
                        sheetId:Number(k),
                        paperId:Number($scope.order.paperAnswers[k])
                    });
                }
            }

            // Значения параметров операций
            for(k in $scope.order.operationParameterAnswers){
                if($scope.order.operationParameterAnswers.hasOwnProperty(k)){
                    a.operationParameterAnswers.push({
                        id:Number(k),
                        value:$scope.order.operationParameterAnswers[k]
                    });
                }
            }

            // Сохраняем образец параметров успешного расчета
            AppState.setField('orderFields',JSON.stringify($scope.order));

            $scope.loadingPromise = $q(function (resolve) {
                Products.postCalculation(a)
                    .then(function (res) {

                        if(res.data.errors.length > 0){ // Ошибки
                            $scope.errors = res.data.errors;
                            AppState.setField('orderCalculated',false);
                            AppState.setField('orderFields','');
                        }else{

                            $scope.errors = [];
                            console.log('Успешно посчитали',res.data.cost);

                            // Отображаем панельку с результатами расчета
                            AppState.setField('orderCalculated',true);
                            $scope.cost = res.data.cost;

                        }
                        resolve(); // убираем загрузку

                    },function (err) {
                        console.log("Не посчитали",err);
                        resolve();
                    });

             //  console.log('Модель для расчета',$scope.order);
                console.log('Объект расчета',a);
            });


        };
    }])
})();
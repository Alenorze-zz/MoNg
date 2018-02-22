/*
* Главная директива формы продукта - ожидает загрузки данных шаблона продукта, а затем собирает
* и отображает форму продукта
* */

(function () {
angular.module('Monorythm')
    .directive('mnProductForm',['Products','$interval','$q','$compile','ValidProductService',function (Products,$interval,$q,$compile,ValidProductService) {

        var templateChecker;
        var templateId;
        var myScope; // scope который пришел с функцией link
        var myElement; // element который пришел с функцией link
        
        // Элементы для сблоки шаблона
        // Заголовок формы продукта
        var tmplHeader = '<div class="content-view">\
            <md-toolbar class="md-whiteframe-z2 content-toolbar">\
            <div class="md-toolbar-tools"> Параметры заказа Брошюры > {{template.name}}\
        <div flex> </div>\
\
        <md-button hide-xs class="md-raised md-primary button-move-left" ng-click="calculate()">\
            <md-tooltip md-direction="left">\
            Рассчитать\
            </md-tooltip>\
            Рассчитать\
            </md-button>\
            <md-button hide-gt-xs class="quadro-icon-button md-raised md-primary" ng-click="calculate()">\
            <md-tooltip md-direction="left">\
            Рассчитать\
            </md-tooltip>\
            <div class="fa fa-calculator"></div>\
            </md-button>\
\
\
            </div>\
            </md-toolbar>\
            \
            <div cg-busy="{promise:loadingPromise,message:\'Расчет\',templateUrl:\'views/progress-linear.tmpl.html\',wrapperClass: \'cg-busy\'}" class="loading-control"></div>\
            \
            <md-content id="orderContent" flex class="content-blocks" mn-fix-height="95">\
       \
            ';

        // Панель ошибок заполнения формы
        var tmplErrorsValidation = '<div class="md-whiteframe-2dp error-block md-padding" ng-show="showValidationErrors&&orderForm.$invalid">\
\
            <h3>Ошибки заполнения формы заказа</h3>\
        <ul class="validation-errors">\
         </ul>\
         </div>\
        ';

        // Панель ошибок расчета
        var tmplErrorsCalculation = ' <div class="md-whiteframe-2dp error-block md-padding" ng-show="errors.length > 0">\
\
            <h3>Ошибки при расчете заказа</h3>\
        <ul>\
            <li ng-repeat="error in errors">{{error.description}}</li>\
         </ul>\
         </div>';

        // Отображение результатов расчета заказа
        var tmplCalcHeader = '<div layout-gt-xs="row" layout-align="center center" ng-show="showPrice()" >\
            <h3 class="calculated-price">Стоимость заказа: {{cost.cost}} {{getCurrency(cost.currency)}}</h3>\
\
        <md-button class="md-raised md-primary md-button-toggle" ng-click="toggles.calculation = !toggles.calculation">\
            Подробнее\
            <span aria-hidden="true" class="md-toggle-icon">\
            <md-icon ng-class="{toggled:toggles.calculation}">keyboard_arrow_down</md-icon>\
            </span>\
            </md-button>\
\
            <md-button class="md-raised md-warn" ng-disabled="disableOrderButton()" ng-click="makeOrder()">\
            Заказать\
            </md-button>\
        </div>\
        \
         <div class="md-whiteframe-2dp calculated-price-details" ng-show="toggles.calculation && showPrice()">\
         \
         <div ng-repeat="(key,group) in cost.groups">\
              <md-list-item class="mn-button-toggle" ng-click="toggles.calculationBlock[key] = !toggles.calculationBlock[key]">\
                <div  class="md-list-item-text">\
                <h3>{{group.name}}  <span aria-hidden="true" class="md-toggle-icon">\
                <md-icon ng-class="{toggled:toggles.calculationBlock[key]}" ng-show="group.elements.length > 0">keyboard_arrow_down</md-icon>\
                </span></h3>\
                </div>\
                <div class="md-secondary">{{group.cost}} {{getCurrency(group.currency)}}</div>\
            </md-list-item>\
            \
             <div ng-show="toggles.calculationBlock[key] && group.elements.length > 0" >\
                     <md-divider></md-divider>\
                     <md-list-item class="md-2-line" ng-repeat="elt in group.elements">\
                           <div class="md-list-item-text">\
                             <h3>{{elt.name}}</h3>\
                                <p>\
                                {{elt.orderItem}}\
                                </p>\
                           </div>\
                        <div class="md-secondary">{{elt.cost}} {{getCurrency(elt.currency)}}</div>\
                      </md-list-item>\
             </div>\
         </div>\
         \
         \
         \
         </div>\
         ';

        // Комментарий к продукту
        var tmplTemplateMessage = '<mn-order-template-message></mn-order-template-message>';

        // Параметры заказа
        var tmplOrderParams = '<form name="orderForm"><mn-order-params></mn-order-params>';

        // Раздел Детали и листы
        var tmplOrderDetaisSheets = '<mn-order-detail-sheets></mn-order-detail-sheets>';

        // Раздел Бумага
        var tmplOrderPaper = '<mn-order-paper></mn-order-paper>';

        // Раздел Анкета
        var tmplOrderQuestionary = '<mn-order-questionary></mn-order-questionary>'

        // Раздел Операции
        var tmplOrderOperations = '<mn-order-operations></mn-order-operations>'

        // Футер формы продуктов
        var tmplFooter = '</form><br><br>' +
            '</md-content></div>';

        // Проверка загрузки шаблона директивы
        function chechTemplateLoaded() {
            var templates = Products.getTemplates();

            if(typeof templates[templateId] == 'object' && templates[templateId].loaded){
                if(typeof templateChecker != 'undefined'){

                    $interval.cancel(templateChecker);
                }

                myScope.template = templates[templateId];


                // Подготовка и вставка шаблона в страницу
                prepareTemplate();

            }
        }

        // Функция осуществляет составление шаблона из того, из чего его надо составить
        function prepareTemplate() {

            // Флаг Отображать ли раздел с деталями?
            var showDetaisSheets = myScope.template.data.formatQuestions.length ||
                myScope.template.data.colorQuestions.length ||
                myScope.template.data.printedPagesQuestions.length ||
                myScope.template.data.detailsQuestions.length;

            // Флаг Отображать ли раздел Бумага?
            var showOrderPaper = myScope.template.data.paperQuestions.length;

            // Флаг Отображать ли раздел Анкета?
            var showQuestionary = myScope.template.data.formQuestions.length;

            // Флаг Отобразить операции
            var showOperations = myScope.template.data.operationParameterQuestions.length;

            var resTemplate = tmplHeader
                + tmplCalcHeader
                +tmplErrorsCalculation
                +tmplErrorsValidation
                /*+tmplErrors +tmplCalcHeader +tmplCalcBody*/
                + tmplTemplateMessage
                + tmplOrderParams
                + (showQuestionary?tmplOrderQuestionary: '')
                + (showDetaisSheets ? tmplOrderDetaisSheets : '')
                + (showOrderPaper?tmplOrderPaper : '')
                +(showOperations?tmplOrderOperations:'')
                + tmplFooter;

            // очистка шаблона валидации
            ValidProductService.clear();

            // компиляция и вставка основного шаблона
            var res = $compile(resTemplate)(myScope, function (elt, scp) {
                myElement.empty();
                myElement.append(elt);
            });

            // вставляем и компилируем шаблон валидации

            var validTEmplate = ValidProductService.get();

            if(validTEmplate){

                $compile(ValidProductService.get())(myScope,function (elt,scp) {

                    // console.log('Шаблон валидации',ValidProductService.get());

                    var row = angular.element(document.querySelector('.validation-errors')); // контейнер панели ошибок расчета

                    row.append(elt);
                })
            }



        }

        return {
            restrict: 'E',
            template: ' <div class="loading-center"><md-progress-circular md-diameter="96"></md-progress-circular></div>',
            link: function (scope, element, attrs) {
                // ID шаблона установлен из родительского scope директивы
                myScope = scope;
                myElement = element;
                templateId = scope.templateId;
                templateChecker = $interval(chechTemplateLoaded,200);

                // Сбрасываем флаги
                scope.initForm();

            },
            transclude: true

        }
    }]);
})();
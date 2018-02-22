
/*
* Контрол - список без дополнения аттрибуты
* mn-title - отображаемое имя списка
*
* !!! Ключ в массиве опций value значение в массиве опций visibleValue
*
* */
(function () {
angular.module('Monorythm')
    .directive('mnListClosed',['ValidProductService','$compile',function (ValidProductService,$compile) {
        return {
            restrict: 'E',
            template: '<md-input-container class="md-block" flex-gt-sm>\
\
            <label>{{mnTitle}}</label>\
            <md-select name="ctrl{{mnCtrlId}}" ng-model="mnModel" ng-required="isRequired">\
        <md-option ng-repeat="option in myOptions" value="{{option.value}}">\
            {{option.visibleValue}}\
        </md-option>\
        </md-select>\
<md-icon class="mn-info" ng-show="mnComment && mnComment !=\'null\'">info\
   <md-tooltip md-direction="left">\
           {{mnComment}}\
   </md-tooltip>\
   </md-icon>\
        <div ng-messages="mnParentForm[\'ctrl\'+mnCtrlId].$error">\
            <div ng-message="required">{{mnTitle}} - обязательное поле.</div>\
        </div>\
        </md-input-container>',

            scope: {
                mnTitle: '@', // Отображаемое имя списка
                mnOptions: '@', // массив с возможными значениями списка
                mnCtrlId: '@', // Идентификатор контрола
                mnModel: '=', // Модель
                mnParentForm: '<', // Форма из родительского scope что бы ошибка корректно отображалась
                mnDefault: '@',
                mnComment: '@',
                mnRequired: '@'
            },
            link: function (scp,elem,attr) {

                scp.isRequired = true;

                scp.$on('$destroy',function () {
                  //  console.log('Убирается контрол ',scp.mnTitle);
                    var validator = angular.element(document.querySelector('#cv'+scp.mnCtrlId));
                    validator.remove();
                });

              //   console.log('Создается контрол ',scp.mnTitle);

                if(typeof scp.mnRequired != 'undefined'){
                    if(scp.mnRequired == 'true'){
                        scp.isRequired = true;
                    }else if(scp.mnRequired == 'false'){
                        scp.isRequired = false;
                    }
                    scp.isRequired = true;
                }

                //  console.log('Добавляетс валидация для ',scp.mnTitle);

                // валидация
                var validTmpl = ' <div id="cv'+scp.mnCtrlId+'" ng-messages="orderForm.ctrl'+scp.mnCtrlId+'.$error">\
                        <div ng-message="required"><li>'+scp.mnTitle+' - обязательное поле.</li></div>\
                    </div>';

                // debugger;

                $compile(validTmpl)(scp.$parent,function (elt,scope) {

//                    console.log('Добавляем валидатор',validTmpl,elt);
                   // ищем по классу .validation-errors
                    var row = angular.element(document.querySelector('.validation-errors')); // контейнер панели ошибок расчета
                    row.append(elt);
                });

                // ValidProductService.add(validTmpl);

                // console.log('Набор валидваторов',ValidProductService.get());

                /*$compile(ValidProductService.get())(scp.$parent,function (elt,scp) {

                    // console.log('Шаблон валидации',ValidProductService.get());

                    var row = angular.element(document.querySelector('.validation-errors')); // контейнер панели ошибок расчета

                    row.empty();
                    row.append(elt);
                });*/

                // возможные значения прилетают к нам как JSON
                scp.myOptions = JSON.parse(scp.mnOptions);

                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    scp.mnModel = scp.mnDefault;
                }
            }
        }

    }])
})();
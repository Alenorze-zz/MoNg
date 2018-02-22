/* Контрол для отображения бумаги - сделан на основе основного закрытого выпадающего списка но
 *  отличается от него, именованием в списке опций и именованием идентификатора контрола на основе листа
  *
  * */


(function () {
    angular.module('Monorythm')
        .directive('mnListPaper',['ValidProductService','$compile',function (ValidProductService,$compile) {
            return {
                restrict: 'E',
                template: '<md-input-container class="md-block" flex-gt-sm>\
\
            <label>{{mnTitle}}</label>\
            <md-select name="sheet{{mnCtrlId}}" ng-model="mnModel" required>\
        <md-option ng-repeat="option in myOptions" value="{{option.id}}">\
            {{option.name}}\
        </md-option>\
        </md-select>\
\
        <div ng-messages="mnParentForm[\'sheet\'+mnCtrlId].$error">\
            <div ng-message="required">{{mnTitle}} - обязательное поле.</div>\
        </div>\
        </md-input-container>',

                scope: {
                    mnTitle: '@', // Отображаемое имя списка
                    mnOptions: '@', // массив с возможными значениями списка
                    mnCtrlId: '@', // Идентификатор контрола
                    mnModel: '=', // Модель
                    mnParentForm: '<', // Форма из родительского scope что бы ошибка корректно отображалась
                    mnDefaultPaper: '@'
                },
                link: function (scp,elem,attr) {

                    scp.$on('$destroy',function () {
                        //  console.log('Убирается контрол ',scp.mnTitle);
                        var validator = angular.element(document.querySelector('#sh'+scp.mnCtrlId));
                        validator.remove();
                    });

                    var validTmpl = '<div id="sh'+scp.mnCtrlId+'" ng-messages="orderForm.sheet'+scp.mnCtrlId+'.$error">\
            <div ng-message="required"><li>'+scp.mnTitle+' - обязательное поле.</li></div>\
        </div>';

                    $compile(validTmpl)(scp.$parent,function (elt,scope) {

//                    console.log('Добавляем валидатор',validTmpl,elt);
                        // ищем по классу .validation-errors
                        var row = angular.element(document.querySelector('.validation-errors')); // контейнер панели ошибок расчета
                        row.append(elt);
                    });

                    // ValidProductService.add(validTmpl);

                    // возможные значения прилетают к нам как JSON
                    scp.myOptions = JSON.parse(scp.mnOptions);
                   // scp.mnModel = Number(scp.mnDefaultPaper);

                    if(typeof scp.mnDefaultPaper != 'undefined' && scp.mnDefaultPaper ){
                        scp.mnModel = scp.mnDefaultPaper
                    }
                }
            }

        }])
})();
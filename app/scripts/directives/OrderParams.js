/*
* Директива отображает раздел "Параметры заказа" на форме заказа
*
* */

(function () {
angular.module('Monorythm')
    .directive('mnOrderParams',['$compile','ValidProductService',function ($compile,ValidProductService) {

        return {
            restrict: 'E',
            template: ' \
            <div class=" param-block">\
\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
            Параметры заказа\
        </div>\
        </md-toolbar>\
\
        <div class="frame1 param-frame md-whiteframe-z1">\
\
            <div flex layout-gt-sm="row">\
        <md-input-container class="md-block" flex-gt-sm >\
            <label>Тираж</label>\
         <input ng-model="order.count" type="number" required name="orderAmount" min="1" max="1000000000000" ng-pattern="/^\\d+$/" >\
\
               <div ng-messages="orderForm.orderAmount.$error">\
               <div ng-message="required">Тираж - обязательное поле.</div>\
              <div ng-message="md-maxlength">Тираж должен быть не длиннее 8 символов.</div>\
                <div ng-message="pattern">Тираж должен содержать только цифры.</div>\
                  <div ng-message="min">Минимальный тираж 1</div>\
               <div ng-message="max">Слишком большой тираж</div>\
         </div>\
        </md-input-container>\
\
        </div>\
\
        </div>\
\
\
        </div>',
            link: function (scope, elem, attr) {


                // Добавляем тираж к валидации
                var countValidationTemplate = '<div ng-messages="orderForm.orderAmount.$error">\
               <div ng-message="required"><li>Тираж - обязательное поле.</li></div>\
              <div ng-message="md-maxlength"><li>Тираж должен быть не длиннее 8 символов.</li></div>\
                <div ng-message="pattern"><li>Тираж должен содержать только цифры.</li></div>\
               <div ng-message="min"><li>Минимальный тираж 1</li></div>\
               <div ng-message="max"><li>Слишком большой тираж</li></div>\
         </div>';

                ValidProductService.add(countValidationTemplate);

                console.log("Шаблон",scope.template.data);

                if(typeof scope.template.data.count != 'undefined' && scope.template.data.count)
                    scope.order.count = scope.template.data.count;
                else
                    scope.order.count = 1;

                console.log('p1');

                var props = scope.template.data.properties;
                var eltsTemplate = ''; // Шаблон с контролами раздела Параметры
                var colNum = 1; // Нумерация столбцов  - от 1 до 3

                console.log('p2',props.length);

                if(props.length) {
                    // Читае массив Properties и последовательно вставляем контролы
                    for (var i = 0; i < props.length; i++) {

                        // Если свойство name не инициализировано, тогда используем fullName для названия поля
                        var propName = '';
                        if (typeof props[i].name != 'undefined' && props[i].name) {
                            propName = props[i].name;
                        } else {
                            propName = props[i].fullName;
                        }

                        // Разметка столбцов - начало
                        switch (colNum) {
                            case 1: // Если первый столбец
                                eltsTemplate += '<div flex layout-gt-sm="row">'
                                break;
                            default:
                        }

                        /*
                         * 1, 4, 5, 6 - input type=«text"
                         3 - дата
                         2  - input type=«number"
                         7,8 - input type =«tel"
                         9 - input type=«email"
                         * */
                        switch (props[i].listType) {
                            case 1: // без списка

                                switch (props[i].dataType) {
                                    case 1:
                                    case 4:
                                    case 5:
                                    case 6: // Контрол - поде ввода типа строка
                                        eltsTemplate += '<mn-input-text class="ctrl-padding" flex ' +
                                            'mn-title="' + propName + '" ' +
                                            'mn-model="order.properties[' + props[i].id + ']" ' +
                                            'mn-default="' + props[i].value + '" ' +
                                            'mn-ctrl-id="p' + props[i].id + '"></mn-input-text>';
                                        break;
                                    case 2: // Контрол поле ввода типа число
                                        eltsTemplate += '<mn-input-number class="ctrl-padding" flex ' +
                                            'mn-parent-form="orderForm"  ' +
                                            'mn-model="order.properties[' + props[i].id + ']" ' +
                                            'mn-title = "' + propName + '"' +
                                            'mn-ctrl-id="p' + props[i].id + '"  ' +
                                            'mn-default="' + props[i].value + '" ' +
                                            'mn-min="' + props[i].minimalValue + '" ' +
                                            'mn-max="' + props[i].maximalValue + '" ' +
                                            '></mn-input-number>';
                                        break;
                                    case 3: // Контрол - поле ввода типа дата
                                        eltsTemplate += '<mn-input-date class="ctrl-padding" flex ' +
                                            'mn-title="' + propName + '" ' +
                                            'mn-model="order.properties[' + props[i].id + ']" ' +
                                            'mn-default="' + props[i].value + '" ' +
                                            '></mn-input-date>';
                                        break;
                                    case 7:
                                    case 8: // Контрол - поле ввода типа телефон
                                        eltsTemplate += '<mn-input-tel class="ctrl-padding" ' +
                                            'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                                            'mn-ctrl-id="p' + props[i].id + '"  ' + // идентификатор контрола
                                            'mn-model="order.properties[' + props[i].id + ']" ' + // модель для передачи значения в основной scope
                                            'mn-title="' + propName + '" ' + // название контрола
                                            'mn-default="' + props[i].value + '" ' +
                                            'flex></mn-input-tel>';
                                        break;
                                    case 9: // Контрол - поле ввода типа email
                                        eltsTemplate += '<mn-input-email class="ctrl-padding" ' +
                                            'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                                            'mn-ctrl-id="p' + props[i].id + '"  ' + // идентификатор контрола
                                            'mn-model="order.properties[' + props[i].id + ']" ' + // модель для передачи значения в основной scope
                                            'mn-title="' + propName + '" ' + // название контрола
                                            'mn-default="' + props[i].value + '" ' +
                                            'flex ></mn-input-email>';
                                        break;
                                }

                                break;
                            case 2: // список без дополнения

                                // возможные значения props[i].possibleValues
                                //          props[i].possibleValues[0].value передаваемое значение
                                //          props[i].possibleValues[0].visibleValue видимое значение
                                //
                                eltsTemplate += '<mn-list-closed ng-if="true" class="ctrl-padding" ' + // контрол закрытого списка
                                    'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                                    'mn-ctrl-id="p' + props[i].id + '"  ' + // идентификатор контрола
                                    'mn-model="order.properties[' + props[i].id + ']" ' + // модель для передачи значения в основной scope
                                    'mn-title="' + propName + '" ' + // название контрола
                                    'mn-options="{{template.data.properties[' + i + '].possibleValues}}" ' + // возможные значения выпадающего списка
                                    'mn-default="' + props[i].value + '" ' +
                                    'flex ></mn-list-closed>'; // визуализация

                                break;
                            case 3: // список с дополнением
                                eltsTemplate += '<mn-list-open class="ctrl-padding" ' +
                                    'mn-title="' + propName + '" ' +
                                    'mn-options="{{template.data.properties[' + i + '].possibleValues}}"' + // возможные значения выпадающего списка
                                    'mn-default="' + props[i].value + '" ' +
                                    'mn-model="$parent. order.properties[' + props[i].id + ']" flex></mn-list-open>';

                                break;
                            default:
                        }

                        // Разметка столбцов - конец
                        switch (colNum) {
                            case 1:
                            case 2:
                                colNum++;
                                break;
                            case 3: // Если первый столбец
                                eltsTemplate += '</div>';
                                colNum = 1;
                                break;
                            default:

                        }
                    }


                    // Закрываем тег строки если он не закрыт
                    if (colNum != 1) {
                        eltsTemplate += '</div>';
                    }

                    console.log('p3', eltsTemplate);


                    // компиляция и вставка шаблона
                    var res = $compile(eltsTemplate)(scope, function (elt, scp) {

                        console.log('p4');
                        //
                        var row = angular.element(document.querySelector('.frame1')); // контейтенр с контролами

                        row.append(elt);

                        console.log('p5');

                        /* myElement.empty();
                         myElement.append(elt);*/
                    });

                }

            }
        }
    }])
})();
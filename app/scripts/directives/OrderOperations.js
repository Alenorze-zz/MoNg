/* Директива блока Операции Шаблона продукта */
(function () {
angular.module('Monorythm')
    .directive('mnOrderOperations',['$compile',function ($compile) {
        return {
            restrict: 'E',
            template: '<div class=" param-block">\
\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
            Операции\
        </div>\
        </md-toolbar>\
\
        <div class="frame5 param-frame md-whiteframe-z1">\
        \
        </div>\
        \
                        <br><br>\
            <div flex layout="row" layout-align="center center">\
                <md-button class="md-raised md-primary" ng-click="calculate()">Рассчитать</md-button>\
            </div>\
            <br hide-gt-xs>\
        <br hide-gt-xs>\
        <br hide-gt-xs>\
        <div>',
            link: function (scp,elt,attr) {

                var eltsTemplate = '<div></div>'; // что-то надо в шаблоне что бы компилятор ангуляра не ругался
                var question, i;
                var colNum = 1; // Нумерация столбцов  - от 1 до 3

                // Если есть, добавляем Операции
                for(i =0; i < scp.template.data.operationParameterQuestions.length; i++) {
                    // Разметка столбцов - начало
                    switch (colNum) {
                        case 1: // Если первый столбец
                            eltsTemplate += '<div flex layout-gt-sm="row">';
                            break;
                        default:
                    }

                    // Текущая операция
                    question = scp.template.data.operationParameterQuestions[i];

                    /*
                     * 1, 4, 5, 6 - input type=«text"
                     3 - дата
                     2  - input type=«number"
                     7,8 - input type =«tel"
                     9 - input type=«email"
                     * */
                    switch(question.listType){
                        case 1: // без списка

                            switch(question.dataType){
                                case 1:
                                case 4:
                                case 5:
                                case 6: // Контрол - поде ввода типа строка
                                    eltsTemplate += '<mn-input-text ng-if="showOperationsQuestion('+question.id+')" class="ctrl-padding" flex ' +
                                        'mn-title="'+question.question+'" ' +
                                        'mn-model="order.operationParameterAnswers['+question.id+']" ' +
                                        'mn-default="'+question.value+'" ' +
                                        'mn-comment="'+question.comment+'" ' +
                                        'mn-ctrl-id="op'+question.id+'"></mn-input-text>';
                                    break;
                                case 2: // Контрол поле ввода типа число

                                    eltsTemplate += '<mn-input-number ng-show="showOperationsQuestion('+question.id+')" class="ctrl-padding" flex ' +
                                        'mn-parent-form="orderForm"  ' +
                                        'mn-model="order.operationParameterAnswers['+question.id+']" ' +
                                        'mn-title="'+question.question+'"'+
                                        'mn-default="'+question.value+'" ' +
                                        'mn-comment="'+question.comment+'" ' +
                                        'mn-ctrl-id="op'+question.id+'"  ' +
                                        '></mn-input-number>';
                                    break;
                                case 3: // Контрол - поле ввода типа дата
                                    eltsTemplate += '<mn-input-date ng-show="showOperationsQuestion('+question.id+')" class="ctrl-padding" flex ' +
                                        'mn-title="'+question.question+'" ' +
                                        'mn-model="order.operationParameterAnswers['+question.id+']" ' +
                                        'mn-default="'+question.value+'" ' +
                                        '></mn-input-date>';
                                    break;
                                case 7:
                                case 8: // Контрол - поле ввода типа телефон
                                    eltsTemplate += '<mn-input-tel ng-show="showOperationsQuestion('+question.id+')" class="ctrl-padding" ' +
                                        'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                                        'mn-ctrl-id="op'+question.id+'"  ' + // идентификатор контрола
                                        'mn-model="order.operationParameterAnswers['+question.id+']" ' + // модель для передачи значения в основной scope
                                        'mn-default="'+question.value+'" ' +
                                        'mn-comment="'+question.comment+'" ' +
                                        'mn-title="'+question.question+'" ' + // название контрола
                                        'flex></mn-input-tel>';
                                    break;
                                case 9: // Контрол - поле ввода типа email
                                    eltsTemplate += '<mn-input-email ng-show="showOperationsQuestion('+question.id+')" class="ctrl-padding" ' +
                                        'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                                        'mn-ctrl-id="op'+question.id+'"  ' + // идентификатор контрола
                                        'mn-model="order.operationParameterAnswers['+question.id+']" ' + // модель для передачи значения в основной scope
                                        'mn-default="'+question.value+'" ' +
                                        'mn-comment="'+question.comment+'" ' +
                                        'mn-title="'+question.question+'" ' + // название контрола
                                        'flex ></mn-input-email>';
                                    break;
                                default:
                            }

                            break;
                        case 2: // список без дополнения

                            // возможные значения props[i].possibleValues
                            //          props[i].possibleValues[0].value передаваемое значение
                            //          props[i].possibleValues[0].visibleValue видимое значение
                            //
                            eltsTemplate += '<mn-list-closed ng-if="showOperationsQuestion('+question.id+')" flex class="ctrl-padding"' + // контрол закрытого списка
                                'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                                'mn-ctrl-id="op'+question.id+'"  ' + // идентификатор контрола
                                'mn-model="$parent.order.operationParameterAnswers['+question.id+']" ' + // модель для передачи значения в основной scope
                                'mn-title="'+question.question+'" ' + // название контрола
                                'mn-default="'+question.value+'" ' +
                                'mn-comment="'+question.comment+'" ' +
                                'mn-options="{{template.data.operationParameterQuestions['+i+'].possibleValues}}" ' + // возможные значения выпадающего списка
                                'flex ></mn-list-closed>'; // визуализация

                            break;
                        case 3: // список с дополнением
                            eltsTemplate += '<mn-list-open  ng-show="showOperationsQuestion('+question.id+')" flex class="ctrl-padding"' +
                                'mn-title="'+question.question+'" ' +
                                'mn-default="'+question.value+'" ' +
                                'mn-comment="'+question.comment+'" ' +
                                'mn-options="{{template.data.operationParameterQuestions['+i+'].possibleValues}}"' + // возможные значения выпадающего списка
                                'mn-model="order.operationParameterAnswers['+question.id+']"></mn-list-open>';

                            break;
                        default:
                    }

                    // Разметка столбцов - конец
                    switch(colNum){
                        case 1:
                        case 2:
                            colNum++;
                            break;
                        case 3: // Если первый столбец
                            eltsTemplate +='</div>';
                            colNum=1;
                            break;
                        default:

                    }

                }

                // Закрываем тег строки если он не закрыт
                if(colNum != 1){
                    eltsTemplate +='</div>';
                }

                $compile(eltsTemplate)(scp,function (elt) {
                    var row = angular.element(document.querySelector('.frame5')); // контейтенр с контролами
                    row.append(elt);
                });

            }
        }
    }]);
})();
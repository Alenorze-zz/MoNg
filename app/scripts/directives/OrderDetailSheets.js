/* Сборка шаблона раздела Детали и листы формы заказа */
(function () {
angular.module('Monorythm')
    .directive('mnOrderDetailSheets',['$compile',function ($compile) {
        return {
            restrict: 'E',
            template: '<div class=" param-block">\
\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
            Детали и листы\
        </div>\
        </md-toolbar>\
\
        <div class="frame2 param-frame md-whiteframe-z1">\
        \
        </div><div>',
            link: function (scp,elt,attr) {

                var eltsTemplate = '<div></div>'; // что-то надо в шаблоне что бы компилятор ангуляра не ругался
                var question, i;
                var colNum = 1; // Нумерация столбцов  - от 1 до 3

                // Если есть, добавляем вопросы по формату
                for(i =0; i < scp.template.data.formatQuestions.length; i++){
                    // Разметка столбцов - начало
                    switch(colNum){
                        case 1: // Если первый столбец
                            eltsTemplate +='<div flex layout-gt-sm="row">';
                            break;
                        default:
                    }

                    // Текущий вопрос по формату
                    question = scp.template.data.formatQuestions[i];

                    eltsTemplate += '<mn-format-question ng-show="showFormatQuestion('+question.id+')" class="ctrl-padding" flex ' +
                        'mn-parent-form="orderForm" ' +
                        'mn-title="'+question.question+'" ' +
                        'mn-ctrl-id="fm'+question.id+'" ' +
                        'mn-model="order.formatAnswers['+question.id+']" ' +
                        'mn-default-width="'+question.width+'" ' +
                        'mn-default-height="'+question.height+'" ' +
                        'mn-possible-formats="{{template.data.possibleFormats}}" ' +
                        'mn-comment="'+question.comment+'"></mn-format-question>';

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

                // Если есть, добавляем вопросы по красочности
                for(i=0; i < scp.template.data.colorQuestions.length; i++){

                    // Текущий вопрос по красочности
                    question = scp.template.data.colorQuestions[i];

                    // Разметка столбцов - начало
                    switch(colNum){
                        case 1: // Если первый столбец
                            eltsTemplate +='<div flex layout-gt-sm="row">';
                            break;
                        default:
                    }

                    eltsTemplate += '<mn-input-color  ng-show="showColorQuestion('+question.id+')" class="ctrl-padding" flex ' +
                        'mn-parent-form="orderForm" ' +
                        'mn-title="'+question.question+'" ' +
                        'mn-ctrl-id="co'+question.id+'" ' +
                        'mn-model="order.colorAnswers['+question.id+']" ' +
                        'mn-face-color="'+question.faceColor+'" ' +
                        'mn-back-color="'+question.backColor+'" ' +
                        'mn-comment="'+question.comment+'" ' +'></mn-input-color>';

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


                // Если есть, добавляем вопросы про количество печатных полос
                for(i = 0; i < scp.template.data.printedPagesQuestions.length; i++){
                    question = scp.template.data.printedPagesQuestions[0];

                    // Разметка столбцов - начало
                    switch(colNum){
                        case 1: // Если первый столбец
                            eltsTemplate +='<div flex layout-gt-sm="row">';
                            break;
                        default:
                    }

                    eltsTemplate += '<mn-input-number  ng-show="showPrintedPageQuestion('+question.id+')" class="ctrl-padding" flex ' +
                        'mn-parent-form="orderForm" ' +
                        'mn-title="'+question.question+'" ' +
                        'mn-ctrl-id="pp'+question.id+'" ' +
                        'mn-model="order.printedPagesAnswers['+question.id+']" ' +
                        'mn-default="'+question.count+'" ' +
                        'mn-comment="'+question.comment+'" ' +
                        '></mn-input-number>';

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

                // Если есть, добавляем вопросы про количество деталей
                for(i = 0; i < scp.template.data.detailsQuestions.length; i++){

                    question = scp.template.data.detailsQuestions[0];

                    // Разметка столбцов - начало
                    switch(colNum){
                        case 1: // Если первый столбец
                            eltsTemplate +='<div flex layout-gt-sm="row">';
                            break;
                        default:
                    }


                    eltsTemplate += '<mn-input-number  ng-show="showDetailQuestion('+question.id+')" class="ctrl-padding" flex ' +
                        'mn-parent-form="orderForm" ' +
                        'mn-title="'+question.question+'" ' +
                        'mn-ctrl-id="cd'+question.id+'" ' +
                        'mn-model="order.detailAnswers['+question.id+']" ' +
                        'mn-comment="'+question.comment+'" ' +
                        'mn-default="'+question.count+'" ' +
                        '></mn-input-number>';

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
                    var row = angular.element(document.querySelector('.frame2')); // контейтенр с контролами
                    row.append(elt);
                });

            }

        }
    }])
})();
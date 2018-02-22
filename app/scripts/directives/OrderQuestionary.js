/* Директива шаблона заказа с блоком Анкета */
(function () {
angular.module('Monorythm')
    .directive('mnOrderQuestionary',['$compile',function ($compile) {
        return {
            restrict: 'E',
            template: '<div class=" param-block">\
\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
            Анкета\
        </div>\
        </md-toolbar>\
\
        <div class="frame4 param-frame md-whiteframe-z1">\
        \
        </div><div>',
            link: function (scp,elt,attr) {

                var eltsTemplate = '<div></div>'; // что-то надо в шаблоне что бы компилятор ангуляра не ругался
                var question, i;
                var colNum = 1; // Нумерация столбцов  - от 1 до 3

                // Если есть, добавляем вопросы анкеты
                for(i =0; i < scp.template.data.formQuestions.length; i++) {
                    // Разметка столбцов - начало
                    switch (colNum) {
                        case 1: // Если первый столбец
                            eltsTemplate += '<div flex layout-gt-sm="row">';
                            break;
                        default:
                    }

                    // Текущий вопрос анкеты
                    question = scp.template.data.formQuestions[i];

                    eltsTemplate += '<mn-checkbox ' +
                        'mn-title="'+question.question+'" ' +
                        'mn-model="order.formAnswers['+question.id+']" ' +
                        'mn-ctrl-id="qa'+question.id+'" ' +
                        'mn-checked="'+question.answer+'" ' +
                        'mn-comment="'+question.comment+'" '+
                        'flex></mn-checkbox>';

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
                    var row = angular.element(document.querySelector('.frame4')); // контейтенр с контролами
                    row.append(elt);
                });

            }
        }
    }])
})();
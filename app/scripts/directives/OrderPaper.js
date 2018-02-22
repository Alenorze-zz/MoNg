/* Раздел Бумага для формы продукта */
(function () {
 angular.module('Monorythm')
     .directive('mnOrderPaper',['$compile',function ($compile) {
         return {
             restrict: 'E',
             template: '<div class=" param-block">\
\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
            Бумага\
        </div>\
        </md-toolbar>\
\
        <div class="frame3 param-frame md-whiteframe-z1">\
        \
        </div><div>',
             link: function (scp,elt,attr) {

                 var eltsTemplate = '<div></div>'; // что-то надо в шаблоне что бы компилятор ангуляра не ругался
                 var question, i;
                 var colNum = 1; // Нумерация столбцов  - от 1 до 3

                 // Если есть, добавляем вопросы по бумаге
                 for(i =0; i < scp.template.data.paperQuestions.length; i++) {
                     // Разметка столбцов - начало
                     switch (colNum) {
                         case 1: // Если первый столбец
                             eltsTemplate += '<div flex layout-gt-sm="row">';
                             break;
                         default:
                     }

                     // Текущий вопрос по бумаге
                     question = scp.template.data.paperQuestions[i];

                     eltsTemplate += '<mn-list-paper ng-if="showPaperQuestion('+question.sheetId+')" ' +
                         'mn-parent-form="orderForm"  ' + // родительская форма для корректного отображения ошибки
                         'mn-ctrl-id="pa'+question.sheetId+'"  ' + // идентификатор контрола
                         'mn-model="$parent.order.paperAnswers['+question.sheetId+']" ' + // модель для передачи значения в основной scope
                         'mn-title="'+question.question+'" ' + // название контрола
                         'mn-options="{{template.data.paperQuestions['+i+'].possiblePaper}}" ' + // возможные значения выпадающего списк
                         'mn-default-paper="'+question.selectedPaperId+'" ' +
                         'flex class="ctrl-padding"></mn-list-paper>';

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
                     var row = angular.element(document.querySelector('.frame3')); // контейтенр с контролами
                     row.append(elt);
                 });
             }
         }
     }])
})();
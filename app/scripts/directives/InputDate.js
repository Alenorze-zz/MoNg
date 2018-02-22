/* Контрол - дата */

(function () {
angular.module('Monorythm')
    .directive('mnInputDate',[function () {
        return {
            restrict: 'E',
            template: '<md-input-container class="md-block" flex-gt-sm>\
            <label>{{mnTitle}}</label>\
            <md-datepicker  ng-model="modelInner"></md-datepicker>\
            </md-input-container>',
            scope: {
                mnTitle: '@',
                mnModel: '=',
                mnDefault: '@'
            },
            link: function (scp,elt,attr) {

                // Преобразуем дату в такой формат в котором его понимает API
                scp.$watch('modelInner',function (val) {
                    var f = val.getFullYear()+'-'+
                        (val.getMonth()<9?'0'+(val.getMonth()+1):val.getMonth()+1)+'-'+
                        (val.getDate()<10?'0'+val.getDate():val.getDate());

                    scp.mnModel = f;
                });

                // инициализируем дату на основе того в каком виде она пришла из API
                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    var arrDate = scp.mnDefault.split('.');

                    if(arrDate.length == 3){
                        scp.modelInner = new Date(Number(arrDate[2]),Number(arrDate[1])-1,Number(arrDate[0]));

                    }else{
                        scp.modelInner = new Date();
                    }

                }else{
                    scp.modelInner = new Date(); // Инициализация по умолчанию - сегодняшней датой
                }


            }
        }
    }])
})();
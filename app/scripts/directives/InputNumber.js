/* Контрол - число */

(function () {
angular.module('Monorythm')
    .directive('mnInputNumber',['ValidProductService',function (ValidProductService) {
        return {
          restrict: 'E',
          template: '<md-input-container class="md-block" flex-gt-sm>\
          <label>{{mnTitle}}</label>\
            <input name="ctrl{{mnCtrlId}}" ng-required="isRequired" min="{{mnMin}}" max="{{mnMax}}" ng-model="modelInn" type="number">\
\
<md-icon class="mn-info" ng-show="mnComment && mnComment != \'null\'">info\
   <md-tooltip md-direction="left">\
           {{mnComment}}\
   </md-tooltip>\
   </md-icon>\
\
            <div ng-messages="mnParentForm[\'ctrl\'+mnCtrlId].$error" ng-hide="showHints">\
             <div ng-message="number">В поле должно быть число</div>\
             <div ng-message="min">Минимальное значение {{mnMin}}</div>\
             <div ng-message="max">Максимальное значение {{mnMax}}</div>\
            </div>\
        </md-input-container>',
            scope:{
                mnTitle: "@",
                mnModel: "=",
                mnCtrlId: "@",
                mnParentForm: "<",
                mnDefault: "@",
                mnMin: "@",
                mnMax: "@",
                mnComment: '@',
                mnRequired: '@'
            },
            link: function (scp,elt,attr) {

                scp.isRequired = false;

                if(typeof scp.mnRequired != 'undefined' && scp.mnRequired == 'true'){
                    scp.isRequired = true;
                }

                var validTemplate = ' <div ng-messages="orderForm.ctrl'+scp.mnCtrlId+'.$error" ng-hide="showHints">\
             <div ng-message="number"><li>В поле '+scp.mnTitle+' должно быть число</li></div>\
             <div ng-message="min"><li>Минимальное значение поля '+scp.mnTitle+' '+scp.mnMin+'</li></div>\
             <div ng-message="max"><li>Максимальное значение поля '+scp.mnTitle+' '+scp.mnMax+'</li></div>\
            </div>';

                ValidProductService.add(validTemplate);

                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    scp.modelInn = Number(scp.mnDefault);

                }else{
                    scp.modelInn = 0;
                }

                scp.$watch('modelInn',function (val) {
                    scp.mnModel = scp.modelInn;
                })
            }
        };
    }]);
})();
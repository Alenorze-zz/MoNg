/* Директива с контролом красочности */
(function () {
angular.module('Monorythm')
    .directive('mnInputColor',['ValidProductService',function (ValidProductService) {
        return {
            restrict: 'E',
            template: '<md-input-container class="md-block" flex-gt-sm>\
            <label>{{mnTitle}}</label>\
            <input ng-model="colorCtrlModel"  ng-pattern="/\\d+[+]\\d+/" name="ctrl{{mnCtrlId}}"  >\
\
            <div ng-messages="mnParentForm[\'ctrl\'+mnCtrlId].$error">\
            \
                     <div ng-message="pattern">Красочность должна состоять из двух цифр через "+" например 4+4</div>\
              </div>\
              <md-icon class="mn-info" ng-show="mnComment != \'null\' && mnComment">info\
            <md-tooltip md-direction="left" >\
                    {{mnComment}}\
            </md-tooltip>\
            </md-icon>\
        </md-input-container>',
            scope: {
                mnTitle: '@',
                mnModel: '=',
                mnCtrlId: '@',
                mnParentForm: '<',
                mnFaceColor: '@',
                mnBackColor: '@',
                mnComment: '@'
            },
            link: function (scp,elt,attr) {

                ValidProductService.add('<div ng-messages="orderForm.ctrl'+scp.mnCtrlId+'.$error">\
            \
                     <div ng-message="pattern"><li>'+scp.mnTitle+' должна состоять из двух цифр через "+" например 4+4</li></div>\
              </div>');

                scp.$watch('colorCtrlModel',function (val) {
                    if(typeof scp.mnParentForm['ctrl'+scp.mnCtrlId]!= 'undefined' && scp.mnParentForm['ctrl'+scp.mnCtrlId].$valid){
                        var modelVal = val.split(/[+]/);
                        scp.mnModel = {faceColor: modelVal[0],backColor:modelVal[1]};
                    }
                });

                if(scp.mnFaceColor && scp.mnBackColor){
                  scp.colorCtrlModel = scp.mnFaceColor+'+'+scp.mnBackColor;
                }
            }
        }
    }])
})();
/* Контрол для ввода телефона */
(function () {
angular.module('Monorythm')
    .directive('mnInputTel',['ValidProductService',function (ValidProductService) {

        return {
            restrict: 'E',
            template: ' <md-input-container class="md-block" flex-gt-sm>\
            <label>{{mnTitle}}</label>\
            <input type="tel" name="ctrl{{mnCtrlId}}" ng-required="isRequired" ng-model="mnModel" ng-pattern="/^[+]7[0-9]{10}$/" />\
\
            <div ng-messages="mnParentForm[\'ctrl\'+mnCtrlId].$error" ng-hide="showHints">\
            <div ng-message="pattern">Телефон по шаблону: +7##########</div>\
            \
        </div>\
        </md-input-container>',
            scope: {
                mnTitle: '@',
                mnModel: '=',
                mnCtrlId: '@',
                mnParentForm: '<',
                mnDefault: '@',
                mnRequired: '@',
            },link: function (scp,etl,attr) {

                scp.isRequired = false;

                if(typeof scp.mnRequired != 'undefined' && scp.mnRequired == 'true'){
                    scp.isRequired = true;
                }

                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    var valTemplate = '<div ng-messages="orderForm.ctrl'+scp.mnCtrlId+'.$error" ng-hide="showHints">\
            <div ng-message="pattern"><li>Поле '+scp.mnTitle+' Телефон по шаблону: +7##########</li></div>\
        </div>';
                    ValidProductService.add(valTemplate);

                    scp.mnModel = scp.mnDefault;
                }

            }
        }
    }])
})();
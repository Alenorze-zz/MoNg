/* Контрол - текстовое поле без списка*/

(function () {
angular.module('Monorythm')
    .directive('mnInputText',[function () {
        return {
            restrict: 'E',
            template: '<md-input-container class="md-block" flex-gt-sm>\
            <label>{{mnTitle}}</label>\
            <input name="ctrl{{mnCtrlId}}" ng-required="isRequired" ng-model="mnModel" type="text">\
                \
        </md-input-container>',
            scope: {
                mnTitle: '@',
                mnModel: '=',
                mnCtrlId: '@',
                mnDefault: '@',
                mnRequired: '@'
            },
            link: function (scp,elt,attrs) {

                scp.isRequired = false;

                if(typeof scp.mnRequired != 'undefined' && scp.mnRequired == 'true'){
                    scp.isRequired = true;
                }

                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    scp.mnModel = scp.mnDefault;
                }
            }
        }
    }])
})();
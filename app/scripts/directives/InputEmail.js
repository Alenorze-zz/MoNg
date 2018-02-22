/* Контрол типа Email */
(function () {
angular.module('Monorythm')
    .directive('mnInputEmail',['ValidProductService',function (ValidProductService) {
        return {
            restrict: 'E',
            template: '<md-input-container class="md-block" flex-gt-sm>\
            <label>{{mnTitle}}</label>\
            <input name="ctrl{{mnCtrlId}}" ng-required="isRequired" ng-model="mnModel"\
        minlength="7" maxlength="100" /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/ />\
\
            <div ng-messages="mnParentForm[\'ctrl\'+mnCtrlId].$error" >\
            <div ng-message-exp="[\'minlength\', \'maxlength\', \'pattern\']">\
            Email должен быть длинной от 7 до 100 символов и выглядеть как email.\
        </div>\
        </div>\
        </md-input-container>',
            scope: {
                mnTitle: '@',
                mnModel: '=',
                mnCtrlId: '@',
                mnParentForm: '<',
                mnDefault: '@',
                mnRequired: '@'
            },
            link: function (scp,etc,attr) {

                scp.isRequired = false;

                if(typeof scp.mnRequired != 'undefined' && scp.mnRequired == 'true'){
                    scp.isRequired = true;
                }


                // Добавляем валидацию
                var validTemplate = '<div ng-messages="orderForm.ctrl'+scp.mnCtrlId+'.$error" >\
            <div ng-message-exp="[\'minlength\', \'maxlength\', \'pattern\']">\
           <li> Поле '+scp.mnTitle+' должно быть длинной от 7 до 100 символов и выглядеть как email.</li>\
        </div>\
        </div>';
                
                ValidProductService.add(validTemplate);
                
                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    scp.mnModel = scp.mnDefault;
                }

            }
        }
    }])
})();
/* Директива для отображения чекбоксов */
(function () {
angular.module('Monorythm')
    .directive('mnCheckbox',[function () {
        return {
            restrict: 'E',
            template: '<div style="white-space: nowrap;"><md-checkbox ng-model="mnModel" aria-label="Checkbox {{mnCtrlId}}">\
           {{mnTitle}}\
           <md-icon class="mn-info" ng-show="mnComment && mnComment!=\'null\'">info\
                   <md-tooltip md-direction="left">\
                           {{mnComment}}\
                   </md-tooltip>\
                   </md-icon></div>\
        </md-checkbox>',
            scope: {
               mnTitle: '@',
               mnModel: '=', 
               mnCtrlId: '@',
               mnChecked: '@',
               mnComment: '@'
                
            },
            link: function (scp,etl,attr) {
                scp.mnModel = scp.mnChecked=='true'?true:false;
            }
        }
    }])
})();
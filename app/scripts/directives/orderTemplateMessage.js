/*
* Директива отображает комментарий к продукту на форме продукта
* */

(function () {
angular.module('Monorythm')
    .directive('mnOrderTemplateMessage',[function () {
        return {
            restrict: 'E',
            template: '<p ng-bind-html="readyComment"></p>',
            link: function (scope, elt, attrs) {
                scope.readyComment = '';
                if(typeof scope.template.data.comment == 'string' && scope.template.data.comment){
                    scope.readyComment = scope.template.data.comment.replace(/\n/g,'<br>');
                }
            }
        }
    }])
})();

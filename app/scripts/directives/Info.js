/**
 * Директива отображающая информацию при наведении
 */

(function () {
angular.module('Monorythm')
    .directive('mnInfo',[function () {
        return {
            restrict: 'C',
            link: function (scp,elt,attr) {
               console.log('Увидели директиву с информацией');


            }
        }
    }])
})();

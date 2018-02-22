/**
 *
 * Сервис который при компиляции ормы продукта собирает данные для шаблона валидации,
 * а потом возвращает шаблон для его компиляции и вставки в форму продукта
 *
 * */

(function () {
angular.module('Monorythm')
    .service('ValidProductService',[function () {

        var template = '';
        return {
            clear: function () {
                template = '';
            },
            add: function (part) {
                template += part;
            },
            get: function () {
                return template;
             }
        }
    }])

})();
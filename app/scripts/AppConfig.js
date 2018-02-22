(function () {
angular.module('Monorythm')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('catalog',{
                url: '/catalog',
                templateUrl: 'views/catalog.tmpl.html',
                controller: 'CatalogController'
            })
            .state('catalog.template',{
                url: '/template/:templateId',
                templateUrl: 'views/catalog.template.tmpl.html',
                controller: 'TemplateController',
                needAuth:false,
                isCalculation: true
            });
    }])
    .config(['$mdDateLocaleProvider',function($mdDateLocaleProvider) {


        $mdDateLocaleProvider.months = ['январь', 'февраль', 'март', 'апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
        $mdDateLocaleProvider.shortMonths = ['янв', 'фев', 'мар', 'апр','май','июнь','июль','авг','сен','окт','ноя','дек'];
        $mdDateLocaleProvider.days = ['вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье','понедельник'];
        $mdDateLocaleProvider.shortDays = ['вс','пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

        $mdDateLocaleProvider.firstDayOfWeek = 1;

        $mdDateLocaleProvider.formatDate = function(date) {

            if(typeof date != 'undefined'){
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();

                return day + '/' + (monthIndex + 1) + '/' + year;
            }


        };

        $mdDateLocaleProvider.parseDate = function(dateString) {
            console.log('Парсинг даты');
            var m = moment(dateString, 'D/M/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }])

})();

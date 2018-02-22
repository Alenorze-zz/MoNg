/**
 * Сервис с настройками загружаемыми из API
 */
(function () {
angular.module('Monorythm')
    .service('SettingService',['AppState','$timeout','$http',function (AppState,$timeout,$http) {

        var settings;
        var getSettingsUrl = AppState.getField('baseApiUrl')+'/api/settings';

        var settingsLoadLoop = function () {
            if(!AppState.getField('settingsLoaded')){

                $http.get(getSettingsUrl)
                    .then(function (res) {
                        settings = res.data;
                        console.log('Получили настройки',res.data);
                        // settings.allowAnonymousCalculation = false;
                       // settings.allowSaveAnonymousCalculation = false;
                        AppState.setField('baseSettings',settings);
                        AppState.setField('settingsLoaded',true);
                    })
                    .catch(function () {
                        // При любой ошибке: повторяем
                        $timeout(settingsLoadLoop,500);
                    });
            }
        };

        settingsLoadLoop();

        return {
            getSettings: function () {
                return settings;
            }
        }
    }]);
})();

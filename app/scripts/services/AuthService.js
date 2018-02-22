/**
 * Сервис который хранит и делает все что связано с авторизацией
 * хранит в себе все необходимые ключи авторизации, загружает ключи автоизации при старте, при логине
 * управляет параметром AppState isAuthorised
 */

(function () {
angular.module('Monorythm')
    .service('AuthService',['AppState','$q','$http','$cookies','$rootScope','$timeout',function (AppState,$q,$http,$cookies,$rootScope,$timeout) {
        var getTokenUrl = AppState.getField('baseApiUrl')+'/connect/token'; // URL API получения токена
        var clientId = AppState.getConfField('clientId'); // нужно для запросов авторизации

        var accessToken = ''; // токен доступа
        var refreshToken = ''; // токен обновления токена доступа
        var decodedToken = null; // Декодированый токен с данными пользователя
        var expiresIn = 0; // время окончания действия токена достапа (актуально, если знать момент получения)
        var autoAuthFinished = false;

        // console.log('Декодированный токен',JSON.stringify(jwt_decode('eyJhbGciOiJSUzI1NiIsImtpZCI6IkREODA2QzI0NDQyODAzQ0ZGNDBGMDg1RTkzOTE2MkI1RkY3N0I2QkYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiIzWUJzSkVRb0E4XzBEd2hlazVGaXRmOTN0cjgifQ.eyJuYmYiOjE1MDAyMDA3MjAsImV4cCI6MTUwMDIwNDMyMCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJhcGlfdjEiXSwiY2xpZW50X2lkIjoiZnJvbnQtZW5kIiwic3ViIjoiOTAiLCJhdXRoX3RpbWUiOjE1MDAyMDA3MjAsImlkcCI6ImxvY2FsIiwibmFtZSI6ItCi0LXRgdGC0L7QstGL0Lkg0LrQu9C40LXQvdGCIiwiZW1haWwiOiJhc3lzdGVtX3dlYkBtb25vcmh5dGhtLnJ1Iiwic2NvcGUiOlsiYXBpX3YxIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.YATGL9xN1cF8rtHviFLuOYCmnhpeG9vVo_jxdPqWy2gusVR7TWCtqPf3Mwe158d6T9BN-BfdsjZob2cz7Wy_rW_HN72G8ZuXonJL_gzAFsV_j0jZHk_H_YU4_TLc8-n18k_bO4zsDqI74V3lwOqGoeC5IwIg1WLX716OqjZxqy2imeGUBVTZ-WzLrgFhJEJf6kTihydcQujSXW90CSkA--AbY57uYzJxqxJ4kTN7Cd5AMcJITFTVi6kYL4AVgAMn3h6CmDYPvbK3RfNBDmDVxiTsk9vCbpQPKET-XYSvsfecwlT0HMyPVOULQcB0WeTO_MYeoQmptTkfxUGBAuu2nA')));

        // Функция деавторизации
        var exit = function () {
            accessToken = '';
            refreshToken = '';
            expiresIn = 0;
            decodedToken = null;

            AppState.setField('authorized',false);
            // стереть логин/пароль в куке
            $cookies.putObject('cridentials',null);
        };

        /**
         * Функция обновления токена по рефреш-токену. Ничего не принимает - у нее все есть
         * если expiresIn = 0 - ничего не делает
         * после выполнения, автозапускает саму себя через новый Math.floor(expiresIn * 2/3)
         */
        function authRefleshToken() {
            // Проверяем наличие всего что бы не получить ошибку
            if(expiresIn  && refreshToken && typeof clientId != 'undefined' && clientId){
                var params = {
                    grant_type: 'refresh_token',
                    client_id: clientId,
                    refresh_token: refreshToken
                };

                $http({
                    method: 'POST',
                    url: getTokenUrl,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: params
                })
                    .then(function (res) {
                        console.log('Успешная авторизация по рефреш-токену',res);
                        // Данные в сервис
                        accessToken = res.data.access_token;
                        decodedToken = jwt_decode(accessToken);
                        expiresIn = res.data.expires_in;
                        refreshToken = res.data.refresh_token;

                        setTimeout(authRefleshToken,Math.floor(expiresIn * 2/3)*1000)
                    })
                    .catch(function (err) {
                        console.log('ошибка авторизации по рефреш-токену',err);
                        exit(); // Стираем все от греха
                    })
            }
        }

        /**
         *  Функция автоизация по логину паролю:
         * Возвращает промис с результатом, либо ошибку: код
         *
         * возможныйе коды ошибок:
         *   unuathorized - неверный логин пароль (если код такой, то сборазывается состояние приложения авторизовано и
         *        стираются из куки логин и пароль)
         *   network - нет сети
         *   server - неизвестная ошибка
         *   config - не настроен парамерт clientId в файле config.js
         *
         *  Пераметры:
         *    login - логин
         *    pass - пароль
         *    save - сохранять логин пароль (если true - при успешной авторизации логин и пароль сохраняются в куке)
         */

        var authLoginPass = function (login,pass,saveLoginPass) {




            return $q(function (resolve,reject) {


                if(typeof clientId != 'undefined' && clientId){ // проверили что корретно загружен параметр из файла конфигаруции

                    var params = {
                        grant_type: 'password',
                        username: login,
                        password: pass,
                        client_id: clientId
                    };

                    $http({
                        method: 'POST',
                        url: getTokenUrl,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: params
                    })
                        .then(function (res) {
                            // console.log('Успешная авторизация',res);

                            // Данные в сервис
                            accessToken = res.data.access_token;
                            decodedToken = jwt_decode(accessToken);
                            expiresIn = res.data.expires_in;
                            refreshToken = res.data.refresh_token;

                            // Состояние "Авторизовано"
                            AppState.setField('authorized',true);


                            // Данные в куку
                            if(saveLoginPass){
                                $cookies.putObject('cridentials',{login:login,pass:pass});
                            }

                            $rootScope.$broadcast('JustAuthorized');

                            // запустить автообновление токена авторизации Math.floor(expiresIn * 2/3)
                            setTimeout(authRefleshToken,Math.floor(expiresIn * 2/3)*1000);
                            resolve();
                        })
                        .catch(function (err) {
                            console.log('Ошибка авторизации',err);
                            if(err.status == 400){
                                exit();
                                reject('unathorized');
                            }else if(err.status == -1){
                                reject('network')
                            }else {
                                reject('server');
                            }

                        });

                }else{
                    reject('config');
                }

            });
            // AppState.setField('authorized',true);
        };

        // Автоматическая авторизация если в куке сохранен логин и пароль
        var crdntls;
        if(crdntls = $cookies.getObject('cridentials')){

            var authLoop = function () {
                authLoginPass(crdntls.login, crdntls.pass,true)
                    .then(function () {
                        autoAuthFinished = true;
                        console.log('Автоматически авторизовались');
                    },function (err) {
                        switch(err){
                            case 'auth':
                                autoAuthFinished = true;
                                console.log('Не авторизовано');
                                break;
                            default: // авторизуемся до посинения
                                $timeout(function () {
                                    console.log('Повторяем авторизацию');
                                    authLoop();
                                },1000);
                        }

                    });
            };

            authLoop();


        }else{
            autoAuthFinished = true;
            console.log('ничего не сохранено');
        }

        return {
            auth:authLoginPass,
            exit:exit,
            getUserName: function () {
                if(decodedToken){
                    return decodedToken.name;
                }else{
                    return '';
                }
            },
            getBearer: function () {
              return accessToken;
            },
            isAutoAuthFinished: function () {
                return autoAuthFinished;
        }
                ,getEmail: function () {
                
                return decodedToken?decodedToken.email:null;

            }
        }

    }])
})();

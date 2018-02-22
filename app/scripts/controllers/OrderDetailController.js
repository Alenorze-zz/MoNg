(function () {
angular.module('Monorythm')
    .controller('OrderDetailController',['$scope','$mdDialog','OrdersService','$timeout','$q','AppState','$http','AuthService','$mdToast','$window',function ($scope,$mdDialog,OrdersService,$timeout,$q,AppState,$http,AuthService,$mdToast,$window) {

        $scope.details = {};

        var month = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];

        $scope.loadInvoice = function () {
          $scope.detailsLoadingPromise = $q(function (resolve) {

              var url = AppState.getField('baseApiUrl')+'/api/orders/'+$scope.orderId + '/invoice';

              var config = {headers: {
                  'Authorization': 'Bearer '+AuthService.getBearer()
              },
                  responseType:'arraybuffer'};

              $http.get(url,config)
                  .then(function (res) {

                      console.log('Успешно получили счет',res);
                      var file = new Blob([res.data], {type: 'application/pdf'});
                      var fileURL = URL.createObjectURL(file);
                      $window.open(fileURL);
                      resolve();
                  })
                  .catch(function (err) {
                      console.log('ошибка при получении счета',err);
                  })

          })
        };

        $scope.sendInvoice = function () {

          $scope.detailsLoadingPromise = $q(function (resolve) {
              OrdersService.sendInvoice($scope.orderId)
                  .then(function (res) {
                      // console.log('Счет успешно отправлен');
                      $mdToast.show( $mdToast.simple()
                          .textContent('Счет успешно отправлен.')
                          .position('top right' )
                          .hideDelay(3000) );
                      resolve();
                  },function (err) {
                     //  console.log('Ошибка при отправлении счета');

                      switch (err){
                          case 'network':
                              $mdToast.show( $mdToast.simple()
                                  .textContent('Отсуствует сетевое подключение. Повторите после появления сети.')
                                  .position('top right' )
                                  .hideDelay(3000) );
                              break;
                          case 'auth':
                              $mdToast.show( $mdToast.simple()
                                  .textContent('Ошибка авторизации.')
                                  .position('top right' )
                                  .hideDelay(3000) );
                              AuthService.exit();
                              OrdersService.loadOrderDetails($scope.orderId);
                              break;
                          default:
                              $mdToast.show( $mdToast.simple()
                                  .textContent('произошла неизвестная ошибка: попробуйте повторить позднее.')
                                  .position('top right' )
                                  .hideDelay(3000) );
                              break;
                      }

                      resolve();
                  });
          });

        };

        $scope.isEmail = function () {

            // console.log('Проверка Email',AuthService.getEmail());
            return AuthService.getEmail();
        };

        $scope.getCreationDate = function () {
          var crDate = new Date($scope.details.properties.creationDate);

          return crDate.getDate()+' '+month[crDate.getMonth()]+' '+crDate.getFullYear();
        };

        $scope.getCurr = function (curr) {

            if(curr = 'RUR')
                curr = 'p.';

            return curr;
        };

        $scope.getDate = function (sDate){
            var dDate = new Date(sDate);

            return dDate.getDate() +' '+ month[dDate.getMonth()] + ' ' + dDate.getFullYear();
        };

        // Заказ обновлен - обновляем данные
        $scope.$on('OrderLoaded',function (event,data) {
            if($scope.orderId == data.orderId){ // Это именно тот заказ, который отображен
                // Данные обновились - обновляем scope

                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.details = OrdersService.getOrderDetails($scope.orderId);
                    });
                },0);

                // console.log('Поймали обновление',$scope.details);

            }
        });

        $scope.clickDeleteFile = function (detailId,fileName) {
          $scope.detailsLoadingPromise = $q(function (resolve) {

              // Выполняем удаление файла заказа
              var url = AppState.getField('baseApiUrl')+'/api/orders/'+$scope.orderId+'/files/'+detailId+'/'
                + fileName;

              var config = {headers: {
                  'Authorization': 'Bearer '+AuthService.getBearer()
              }};

              $http.delete(url,config)
                  .then(function (res) {
                      // console.log('Файл успешно удален',res);
                      $mdToast.show( $mdToast.simple()
                          .textContent('Файл успешно удален')
                          .position('top right' )
                          .hideDelay(3000) );
                      OrdersService.loadOrderDetails($scope.orderId);
                      resolve();

                  })
                  .catch(function (err) {
                      console.log('Ошибка удаления');

                      switch (err.status){
                          case -1:
                              $mdToast.show( $mdToast.simple()
                                  .textContent('Отсуствует сетевое подключение. Повторите после появления сети.')
                                  .position('top right' )
                                  .hideDelay(3000) );
                              break;
                          case 403:
                              $mdToast.show( $mdToast.simple()
                                  .textContent('Ошибка авторизации.')
                                  .position('top right' )
                                  .hideDelay(3000) );
                              AuthService.exit();
                              OrdersService.loadOrderDetails($scope.orderId);
                              break;
                          default:
                              $mdToast.show( $mdToast.simple()
                                  .textContent('произошла неизвестная ошибка: попробуйте повторить позднее.')
                                  .position('top right' )
                                  .hideDelay(3000) );
                              break;
                      }
                      console.log('Ошибка при удалении файла',err);
                      resolve()
                  })
          })
        };

        $scope.clickEditFile = function (detailId,fileName) {
            // console.log('Параметры функции',detailId,orderId);
            $mdDialog.show({
                controller: 'OrdersAddFileController',
                templateUrl: 'views/personal.order.addfile.dlg.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {detailId:detailId,orderId:$scope.orderId,actionCode: 'edit',fileName:fileName}
            })
                .then(function (res) {
                    console.log('Получили коммент',res.comment);

                    $scope.detailsLoadingPromise = $q(function (resolve) {
                        var config = {headers: {
                            'Authorization': 'Bearer '+AuthService.getBearer(),
                            'Content-Type': undefined
                        }};

                        var url = AppState.getField('baseApiUrl')+'/api/orders/'+$scope.orderId
                                + '/files/' + detailId +'/'+ encodeURI(fileName)+'/comment';

                        var formData = new FormData();

                        formData.append('comment',res.comment);

                        $http.post(url,formData,config)
                            .then(function (res) {
                                $mdToast.show($mdToast.simple()
                                    .textContent('Комментарий изменен.')
                                    .position('top right')
                                    .hideDelay(3000));

                                OrdersService.loadOrderDetails($scope.orderId);
                                resolve();
                            })
                            .catch(function (err) {
                                console.log('Ошибка при изменении комментария',err);

                                switch (err.status) {
                                    case -1:
                                        $mdToast.show($mdToast.simple()
                                            .textContent('Отсуствует сетевое подключение. Повторите после появления сети.')
                                            .position('top right')
                                            .hideDelay(3000));
                                        break;
                                    case 403:
                                        $mdToast.show($mdToast.simple()
                                            .textContent('Ошибка авторизации.')
                                            .position('top right')
                                            .hideDelay(3000));
                                        AuthService.exit();
                                        OrdersService.loadOrderDetails($scope.orderId);
                                        break;
                                    default:
                                        $mdToast.show($mdToast.simple()
                                            .textContent('произошла неизвестная ошибка: попробуйте повторить позднее.')
                                            .position('top right')
                                            .hideDelay(3000));
                                        break;
                                }
                            });
                    });

                },function() {
                    $scope.status = 'You cancelled the dialog.';
                })

        };

        $scope.clickAddFile = function (detailId,orderId) {

            // console.log('Параметры функции',detailId,orderId);
            $mdDialog.show({
                controller: 'OrdersAddFileController',
                templateUrl: 'views/personal.order.addfile.dlg.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {detailId:detailId,orderId:orderId,actionCode: 'add',fileName:null}
            })
                .then(function(answer) {

                    $scope.detailsLoadingPromise = $q(function (resolve) {
                        $http.post(answer.url, answer.formData, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined,'Authorization': 'Bearer '+AuthService.getBearer()}
                        }).then(function(result){
                            console.log('Успешно добавили файл',result);
                            $mdToast.show($mdToast.simple()
                                .textContent('Файл Успешно добавлен.')
                                .position('top right')
                                .hideDelay(3000));

                            OrdersService.loadOrderDetails($scope.orderId);
                            resolve();
                        },function(err){
                            console.log('Ошибка при добавлении файла',err);

                            switch (err.status) {
                                case -1:
                                    $mdToast.show($mdToast.simple()
                                        .textContent('Отсуствует сетевое подключение. Повторите после появления сети.')
                                        .position('top right')
                                        .hideDelay(3000));
                                    break;
                                case 403:
                                    $mdToast.show($mdToast.simple()
                                        .textContent('Ошибка авторизации.')
                                        .position('top right')
                                        .hideDelay(3000));
                                    AuthService.exit();
                                    OrdersService.loadOrderDetails($scope.orderId);
                                    break;
                                default:
                                    $mdToast.show($mdToast.simple()
                                        .textContent('произошла неизвестная ошибка: попробуйте повторить позднее.')
                                        .position('top right')
                                        .hideDelay(3000));
                                    break;
                            }
                            resolve();
                        });
                    });

                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };


    }]);
})();
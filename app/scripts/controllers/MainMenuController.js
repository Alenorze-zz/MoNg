(function () {
angular.module('Monorythm')
    .controller('MainMenuController',['$scope','$mdSidenav','$state','Products','AppState','$timeout','AuthService',function ($scope,$mdSidenav,$state,Products,AppState,$timeout,AuthService) {

       $scope.popular = [];
       $scope.catalog = [];


        // false - пункт меню свернут, true - пункт меню развернут
        $scope.menuCollapse = [];
        $scope.menuCategoryHeight = 57; // Высота одной категории для плавного развертывания

       function initProductMenue() {


           var selektor;

            if(AppState.getField('productsLoaded')){
                $scope.popular = Products.getPopular();
                $scope.catalog = Products.getCatalog();

                // Все меню свернуты. Количество меню = количество меню в каталоге + 1
                for(var i = 0; i <= $scope.catalog.length ; i++){
                    $scope.menuCollapse.push(false);
                }

                // Высота для плавного развертывания - популярные
                $('#popularMenu').css('height',$scope.menuCategoryHeight * $scope.popular.length);

              //  $scope.$apply();

                $timeout(function () {
                   $scope.$apply();
                },0);

            }else{
                setTimeout(initProductMenue,500)
            }
       };

       initProductMenue();


       $scope.ifGroupCollapse = function (groupId) {
            return $scope.menuCollapse[groupId];
       };

       $scope.clickCategory = function (catId) {
          $scope.menuCollapse[catId] = !$scope.menuCollapse[catId];
       };
        

       $scope.onClickMenu = function (itemId) {
           $mdSidenav('left')
               .toggle()
               .then(function(){
                   console.log('toggled');
               });
           $state.go('catalog.template',{templateId:itemId});

       }
    }])
})();
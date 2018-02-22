(function () {
    angular.module('Monorythm').controller('PersonalMenuController',['$scope','$mdSidenav','$state',function ($scope,$mdSidenav,$state) {
        // Фиксированная высота блока с меню что бы работал скролл
        var menueHeightDelta = 60;
        function setOrderMenueHeight() {
            $('#personalOrderMenue').css('height',$(window).height()-menueHeightDelta);
            $('#personalOrderMenue').css('max-height',$(window).height()-menueHeightDelta);
        }

        $(window).resize(function () {
            setOrderMenueHeight();
        });

        setOrderMenueHeight();

        $scope.onClickMenu = function (whereToGo) {
            $mdSidenav('left')
                .toggle()
                .then(function(){
                    console.log('toggled');
                });
            $state.go(whereToGo);

        }

    }]);
})();
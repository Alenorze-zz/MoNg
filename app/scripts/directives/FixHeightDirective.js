(function () {
angular.module('Monorythm')
    .directive('mnFixHeight',function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // Дельта высоты от vh
                var cHeightDiff = attrs.mnFixHeight;

                function setOrderHeight() {
                    $(element).css('height',$(window).height()-cHeightDiff);
                    $(element).css('max-height',$(window).height()-cHeightDiff);
                }
                
                $(window).resize(function () {
                     setOrderHeight();
                });
                setOrderHeight();


                element.on('$destroy', function () {
                    $(window).unbind('resize');
                })
            }
        }
    });
})();
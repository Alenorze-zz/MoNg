(function () {
angular.module('Monorythm')
    .directive('mnListOpen',[function () {
        return {
            restrict: 'E',
            template: '<md-autocomplete \
            ng-required="isRequired" \
            md-no-cache="true" \
            md-input-name="mySourceMaterials" \
            md-floating-label="{{mnTitle}}" \
            md-search-text="mnModel" \
            md-items="source in sources" \
            md-item-text="source.visibleValue" \
            md-min-length="0">\
                <md-item-template><span md-highlight-text="mySearchText">{{source.visibleValue}}</span></md-item-template>\
        </md-autocomplete>',
            scope: {
              mnTitle: '@', // Заголовок элемента
              mnOptions: '@', // Возможные значения
              mnModel: '=', // Модель - привязываем к тексту
              mnDefault: '@',
              mnRequired: '@'

            },
            link: function (scp,elt,attr) {

                scp.isRequired = false;

                if(typeof scp.mnRequired != 'undefined' && scp.mnRequired == 'true'){
                    scp.isRequired = true;
                }
                
                // Опции в выпадающем списке с дополнением
                scp.sources = JSON.parse(scp.mnOptions);

                if(typeof scp.mnDefault != 'undefined' && scp.mnDefault && scp.mnDefault != 'null'){
                    scp.mnModel = scp.mnDefault;
                }
            }
        }
    }])
})();
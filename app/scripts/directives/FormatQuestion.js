/* Контрол - вопрос по формату */
(function () {
angular.module('Monorythm')
    .directive('mnFormatQuestion',['ValidProductService',function (ValidProductService) {
        return {
            restrict: 'E',
            template: ' <div flex layout="row"><md-autocomplete flex \
            md-no-cache="true"\
            md-input-name="ctrl{{mnCtrlId}}"\
            md-selected-item="selectedItem"\
            md-search-text="searchText"\
            md-items="item in createFilterFor(searchText)"\
            md-item-text="item.short"\
            md-floating-label="{{mnTitle}}"\
        md-min-length="0"\
        ng-pattern="/^\\d+[xXхХ]\\d+$/"\
            >\
            <md-item-template>\
            <span md-highlight-text="searchText">{{item.name}} {{item.width}}x{{item.height}}</span>\
        </md-item-template>\
        <div ng-messages="getInputError()">\
            <div ng-message=\'pattern\' class="error-message">{{mnTitle}} должен соотвествовать шаблону 2323x3232</div>\
        </div></md-autocomplete><div>\
        <md-icon ng-show="mnComment && mnComment != \'null\'" class="mn-info mn-info-autocomplete" >info\
   <md-tooltip md-direction="left">\
           {{mnComment}}\
   </md-tooltip>\
   </md-icon></div></div>\
        ',
            scope: {
                mnTitle: '@',
                mnModel: '=',
                mnCtrlId: '@',
                mnParentForm: '<',
                mnDefaultWidth: '@',
                mnDefaultHeight: '@',
                mnPossibleFormats: '@',
                mnComment: '@'
            },
            link: function (scp,elt,attr) {

                // Валидации вопроса формата
                var valTemplate='<div ng-messages="orderForm.ctrl'+scp.mnCtrlId+'.$error">\
            <div ng-message=\'pattern\' class=""><li>'+scp.mnTitle+' должен соотвествовать шаблону 2323x3232</li></div>\
        </div>';

                ValidProductService.add(valTemplate);

                if(scp.mnDefaultWidth && scp.mnDefaultHeight && scp.mnDefaultWidth != 'null' && scp.mnDefaultHeight != 'null'){
                    scp.searchText=scp.mnDefaultWidth+'x'+scp.mnDefaultHeight;
                }

                // При компиляции еще нет нужного идентификатора контрола, поэтому получаем его в рантайме
                scp.getInputError = function () {
                    if(typeof scp.mnParentForm['ctrl'+scp.mnCtrlId] != 'undefined')
                     return scp.mnParentForm['ctrl'+scp.mnCtrlId].$error;
                    else return 0;
                };

                // Изменение модели при изменении значения контрола
                scp.$watch('searchText',function (val) {
                    //console.log('Значение формата',val,scp.mnParentForm['ctrl'+scp.mnCtrlId]);
                    // Валидная ли форма?
                    if(typeof scp.mnParentForm['ctrl'+scp.mnCtrlId] != 'undefined' && scp.mnParentForm['ctrl'+scp.mnCtrlId].$valid ){
                       // console.log('Форма валидная',val.split(/[xXхХ]/));
                      //  console.log('Формат присвоен');
                        var arrVals = val.split(/[xXхХ]/);
                        scp.mnModel = {width:arrVals[0],height:arrVals[1]};

                    }

                    // Контрол не появился в форме, но хочется присвоить дефолтное значение
                    if(typeof scp.mnParentForm['ctrl'+scp.mnCtrlId] == 'undefined'){
                      //  console.log('Формат присвоен1');
                        var arrVals = val.split(/[xXхХ]/);
                        scp.mnModel = {width:arrVals[0],height:arrVals[1]};
                    }
                });

                // Возможные значения поля формат
                var formats = JSON.parse(scp.mnPossibleFormats);

                // Короткие названия для отображения в поле ввода
                for(var k=0; k< formats.length; k++){
                    formats[k].short = formats[k].width+'x'+formats[k].height;
                }

                // функция фильтрации форматов для отображения в выпадающем списке
                scp.createFilterFor = function (query){
                    var lowercaseQuery = angular.uppercase(query);
                    var displayStr;

                    var filterFn =function(state) {
                        // строка для поиска выглядит так же как отображается подсказка в выпадающем меню
                        displayStr=state.name + ' ' + state.width +'x'+state.height;

                        return (!(angular.uppercase(displayStr).indexOf(lowercaseQuery) == -1));
                    };

                    return formats.filter(filterFn);

                };
            }
        }
    }])
})();
/**
 * Директива отображает поля формы регистрации
 */

(function () {
angular.module('Monorythm')
    .directive('mnSignupFields',['SignupService','$compile',function (SignupService,$compile) {

        // Шапка формы регистрации
        var templateHeader = '<div layout="column" class="central-form-wrap" layout-align="center center">\
            <form name="registrationForm" class="central-form" >\
            <md-input-container class="md-block" flex-gt-sm>\
\
        <label>Имя пользователя (логин)</label>\
        <input md-maxlength="50" required name="regFio" ng-model="values.login"/>\
\
            <div ng-messages="registrationForm.regFio.$error">\
            <div ng-message=\'required\'>Имя пользователя обязательно.</div>\
        <div ng-message=\'md-maxlength\'>Имя пользователя должно быть не длиннее 50 символов.</div>\
        </div>\
\
        </md-input-container>';

        // Футер формы регистрации
        var templateFooter = '<md-dialog-actions layout="row">\
            <div flex></div>\
        <md-button ng-click="signup()" class="md-raised md-primary">\
            Зарегистрироваться\
            </md-button>\
\
            </md-dialog-actions>\
\
            </form>\
\
            </div>';

        return {
            restrict: 'E',
            template: '<div class="registration-form loading-center"><md-progress-circular md-diameter="96"></md-progress-circular></div>',
            link: function (scp,elt,attr) {
                // Ждем когда в scope появятся полноценные поля для регистрации и в этот момент
                // собираем форму регистрации

                SignupService.getFields()
                    .then(function (res) {
                        console.log("Поля получены",res,scp.fields);

                        scp.fields = res;

                        var template = templateHeader;

                        // Для каждого из полученных полей
                        for(var i=0; i < res.length; i++){

                            // Если свойство name не инициализировано, тогда используем fullName для названия поля
                            var propName ='';
                            if(typeof res[i].name != 'undefined' && res[i].name){
                                propName = res[i].name;
                            }else {
                                propName = res[i].fullName;
                            }

                            /*
                             * 1, 4, 5, 6 - input type=«text"
                             3 - дата
                             2  - input type=«number"
                             7,8 - input type =«tel"
                             9 - input type=«email"
                             * */
                            switch(res[i].listType){
                                case 1: // без списка

                                    switch(res[i].dataType){
                                        case 1:
                                        case 4:
                                        case 5:
                                        case 6: // Контрол - поде ввода типа строка
                                            template += '<mn-input-text flex ' +
                                                'mn-title="'+propName+'" ' +
                                                'mn-model="values.properties['+res[i].id+']" ' +
                                                'mn-required="'+res[i].required+'" ' +
                                                'mn-ctrl-id="reg'+res[i].id+'"></mn-input-text>';
                                            break;
                                        case 2: // Контрол поле ввода типа число
                                            template += '<mn-input-number flex ' +
                                                'mn-parent-form="registrationForm"  ' +
                                                'mn-model="values.properties['+res[i].id+']" ' +
                                                'mn-title = "'+propName+'"'+
                                                'mn-ctrl-id="reg'+res[i].id+'"  ' +
                                                'mn-required="'+res[i].required+'" ' +
                                                'mn-min="'+res[i].minimalValue+'" '+
                                                'mn-max="'+res[i].maximalValue+'" '+
                                                '></mn-input-number>';
                                            break;
                                        case 3: // Контрол - поле ввода типа дата
                                            template += '<mn-input-date flex ' +
                                                'mn-title="'+propName+'" ' +
                                                'mn-model="values.properties['+res[i].id+']" ' +
                                                '></mn-input-date>';
                                            break;
                                        case 7:
                                        case 8: // Контрол - поле ввода типа телефон
                                            template += '<mn-input-tel class="ctrl-padding" ' +
                                                'mn-parent-form="registrationForm"  ' + // родительская форма для корректного отображения ошибки
                                                'mn-ctrl-id="reg'+[i].id+'"  ' + // идентификатор контрола
                                                'mn-model="values.properties['+res[i].id+']" ' + // модель для передачи значения в основной scope
                                                'mn-title="'+propName+'" ' + // название контрола
                                                'mn-required="'+res[i].required+'" ' +
                                                'flex></mn-input-tel>';
                                            break;
                                        case 9: // Контрол - поле ввода типа email
                                            template += '<mn-input-email class="ctrl-padding" ' +
                                                'mn-parent-form="registrationForm"  ' + // родительская форма для корректного отображения ошибки
                                                'mn-ctrl-id="reg'+res[i].id+'"  ' + // идентификатор контрола
                                                'mn-model="values.properties['+res[i].id+']" ' +// модель для передачи значения в основной scope
                                                'mn-title="'+propName+'" ' + // название контрола+
                                                'mn-required="'+res[i].required+'" ' +
                                                'flex ></mn-input-email>';
                                            break;
                                    }

                                    break;
                                case 2: // список без дополнения

                                    // возможные значения props[i].possibleValues
                                    //          props[i].possibleValues[0].value передаваемое значение
                                    //          props[i].possibleValues[0].visibleValue видимое значение
                                    //
                                    template += '<mn-list-closed class="ctrl-padding" ' + // контрол закрытого списка
                                        'mn-parent-form="registrationForm"  ' + // родительская форма для корректного отображения ошибки
                                        'mn-ctrl-id="reg'+res[i].id+'"  ' + // идентификатор контрола
                                        'mn-model="values.properties['+res[i].id+']" ' + // модель для передачи значения в основной scope
                                        'mn-title="'+propName+'" ' + // название контрола
                                        'mn-options="{{fields['+i+'].possibleValues}}" ' + // возможные значения выпадающего списка
                                        'mn-required="'+res[i].required+'" ' +
                                        'flex ></mn-list-closed>'; // визуализация

                                    break;
                                case 3: // список с дополнением
                                    template += '<mn-list-open class="ctrl-padding" ' +
                                        'mn-title="'+propName+'" ' +
                                        'mn-options="{{fields['+i+'].possibleValues}}"' + // возможные значения выпадающего списка
                                        'mn-model="values.properties['+res[i].id+']" ' +
                                        'mn-required="'+res[i].required+'" ' +
                                        'flex></mn-list-open>';

                                    break;
                                default:
                            }



                        }


                        template += templateFooter;



                        $compile(template)(scp,function (elt) {
                            var row = angular.element(document.querySelector('.registration-form')); // контейнер панели ошибок расчета
                            row.empty();
                            row.append(elt);
                        })

                    });
            }
        }
    }])
})();

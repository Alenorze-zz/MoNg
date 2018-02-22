/*
*   Продукты и все что с ними связано
* */

(function(){
angular.module('Monorythm')
    .service('Products',['AppState','$http','$q',function (AppState,$http,$q) {

        var getProductsUrl = AppState.getField('baseApiUrl')+'/api/products'; // URL API с продуктами
        var postOrderUrl = AppState.getField('baseApiUrl')+'/api/orders'; // URL расчета заказа
        var catalog = [];  // элементы каталога - категории с вложенными продуктами
        var popular = []; // Популярные категории
        var templates = {}; // Шаблоны продуктов - ключ ID продукта, значение  - объект с
                            // name -  наименование шаблона
                            // loaded - данные шаблона загружены
                            // loading - данные шаблона загружаются

        // Функция расчитывает зависимости в шаблоне вопросов различных разделов
        // от состояния вопросов анкеты
        var calcDependencies = function (templateId) {
//            console.log('Расчитываем зависимости для шаблона',templates[templateId].data.formQuestions);

            // хэш - по детали - массив связанных с деталью вопросов акнеты с типом связи
            var linkedDetailsHash = {};
            // хэш - по листу массив связанных с листом вопросов
            var linkedSheetsHash = {};

            // хэш - по операции над детально массив связанных вопросов
            // ключ <datailID>+':'+<operationId> . по ключу массив связанных вопросов
            var linkedDetailOperationsHash = {};

            // хэш - по операции над листом массив связанных вопросов
            // ключ <sheetId>+':'+<operationId>. По ключу - массив связанных вопросов
            var linkedSheetOperationsHash = {};

            // хэш - по операциям над стороной листа - массив связанных вопросов
            // ключ <sheetId>+':'+<sheetSideId>+':'+<operationId>
            var linkedSheetSideOperationsHash = {};

            // хэш - связи вопросов по цветности с вопросами анкеты. по коду вопроса
            // по цветности - обхект с кодом вопроса анкеты и типом связи
            var colorQuestionHash = {};

            // хэш - связи вопросов по детялям с вопросвми анкеты: по коду вопроса по
            // детали - объект с кодом вопроса анкеты и типом связи
            var detailsQuestionsHash = {};

            // хэш - связи вопросов по операциям с вопросами анкеты
            var operationParameterQuestionsHash = {};

            // хэш - связи вопросов по количеству печатных листов с вопросами анкеты printedPagesQuestions
            var printedPagesQuestionsHash = {};

            // хэш - связи вопросов по формату с вопросами анкеты
            var formatQuestionsHash = {};


            var k,i, question,sheet, operation, key,detail,link;
            // для каждого вопроса анкеты
            for(k=0; k< templates[templateId].data.formQuestions.length; k++ ){

                question = templates[templateId].data.formQuestions[k];
                // Заполняем linkedDetailsHash
                // Для каждого элемента массива linkedDetails вопроса анкеты
                for(i=0; i< question.linkedDetails.length; i++){

                    // console.log('Для вопроса: '+question.id +
                    //         ' связанныя деталь '+ question.linkedDetails[i].id +
                    //         ' тип связи hiddenWhen:'+question.linkedDetails[i].hideWhen);

                   // console.log(typeof linkedDetailsHash[question.linkedDetails[i].id]);
                    // Если такая деталь нам не встречалась  - инициируем значение для такой детали
                    if(typeof linkedDetailsHash[question.linkedDetails[i].id] == 'undefined'){
                        linkedDetailsHash[templates[templateId].data.formQuestions[k].linkedDetails[i].id] = [];

                        linkedDetailsHash[templates[templateId].data.formQuestions[k].linkedDetails[i].id].push({
                            id:question.id,
                            hideWhen:question.linkedDetails[i].hideWhen
                        });

                    }else{
                        linkedDetailsHash[templates[templateId].data.formQuestions[k].linkedDetails[i].id].push({
                            id:question.id,
                            hideWhen:question.linkedDetails[i].hideWhen
                        });
                    }
                }

                // Заполняем linkedSheetsHash
                // Для каждого элемента массива linkedSheets вопроса анкеты
                for(i=0; i< question.linkedSheets.length; i++){
                    sheet = question.linkedSheets[i];
//                    console.log('Лист',sheet);
                    if(typeof linkedSheetsHash[sheet.id] == 'undefined'){
                        linkedSheetsHash[sheet.id] = [];
                    }

                    linkedSheetsHash[sheet.id].push({
                        id: question.id,
                        hideWhen:sheet.hideWhen
                    });

                }

                // Заполняем linkedDetailOperationsHash
                // для каждого элемента массива linkedDetailOperations вопроса анкеты
                for(i=0; i<question.linkedDetailOperations.length; i++){

                    operation = question.linkedDetailOperations[i];

                    key = operation.detailId+':'+operation.id;
                    if(typeof linkedDetailOperationsHash[key] == 'undefined'){
                        linkedDetailOperationsHash[key] = [];
                    }

                    linkedDetailOperationsHash[key].push({
                        id: question.id,
                        hideWhen: operation.hideWhen
                    })

                }

                // Заполняем linkedSheetOperationsHash
                // для каждого элемента массива linkedSheetOperations вопроса анкеты
                for(i=0; i<question.linkedSheetOperations.length; i++){
                    operation = question.linkedSheetOperations[i];

                    key = operation.sheetId+':'+operation.id;
                    // console.log('Операция над листом',key);
                    if(typeof linkedSheetOperationsHash[key] == 'undefined'){
                        linkedSheetOperationsHash[key] = [];
                    }

                    linkedSheetOperationsHash[key].push({
                        id:question.id,
                        hideWhen:operation.hideWhen
                    });
                }

                // Заполняем linkedSheetSideOperationsHash
                // для каждого элемента массива linkedSheetSideOperations вопроса анкеты
                for(i=0; i<question.linkedSheetSideOperations.length; i++){
                    operation = question.linkedSheetSideOperations[i];
                    key = operation.sheetId+':'+operation.sheetSide+':'+operation.id;

                   // console.log('Операция над стороной листа',operation);
                    // {id: 250397, sheetId: 250382, sheetSide: 1, hideWhen: true}
                    if(typeof linkedSheetSideOperationsHash[key] == 'undefined'){
                        linkedSheetSideOperationsHash[key] = [];
                    }
                    linkedSheetSideOperationsHash[key].push({
                        id:question.id,
                        hideWhen:operation.hideWhen
                    });

                }

            }

            
            // Расчитываем зависимости для вопросов по цветности
            // Для каждого вопроса по цветности
            for(k =0; k< templates[templateId].data.colorQuestions.length; k++){
                // текущий вопрос по цветности
                question = templates[templateId].data.colorQuestions[k];

                // связи через массив linkedDetail
                for(i =0; i< question.linkedDetails.length;i++){
                    detail = question.linkedDetails[i];
                   // console.log('Вопрос по цветности: '+question.id+' связан с деталью ',detail);

                    // если есть связанные с это деталью вопросы анкеты
                    if(typeof linkedDetailsHash[detail] != 'undefined'){
                       // console.log('Вопрос по цветности: '+question.id+' связан с деталью ',detail,' которая связаны с вопросом', linkedDetailsHash[detail]);

                        if(typeof colorQuestionHash[question.id] == 'undefined') {

                            colorQuestionHash[question.id] = [];
                        }

                        colorQuestionHash[question.id] = colorQuestionHash[question.id].concat(linkedDetailsHash[detail]);

                    }
                }

                // связи через массив linkedSheets
                for(i=0; i< question.linkedSheets.length;i++){
                    sheet = question.linkedSheets[i];

                    // Если есть связанные с этим листов вопросы анкеты
                    if(typeof  linkedSheetsHash[sheet] != 'undefined'){
              //             console.log('связанные с листом',sheet,'вопросы анкеты', linkedSheetsHash[sheet]);

                        if(typeof colorQuestionHash[question.id] == 'undefined') {

                            colorQuestionHash[question.id] = [];
                        }

                        colorQuestionHash[question.id] = colorQuestionHash[question.id].concat(linkedSheetsHash[sheet]);
                    }
                }
            }

            // console.log('объект colorQuestionHash',templateId,colorQuestionHash);

            templates[templateId].colorQuestionHash = colorQuestionHash;


            // Расчитываем зависимости вопросов по деталям от вопросов анкеты detailsQuestionsHash
            // Для каждого вопроса по деталям
            for(k=0; k< templates[templateId].data.detailsQuestions.length; k++){
                question = templates[templateId].data.detailsQuestions[k];
//                console.log('Вопрос по деталям',question,templateId);

                // Связи через массив linkedDetails
                for(i=0; i<question.linkedDetails.length; i++){
                    detail = question.linkedDetails[i];

                    // console.log('связанные с деталью',detail,'вопросы анкеты',linkedDetailsHash[detail]);
                    if(typeof  linkedDetailsHash[detail] != 'undefined'){
                       // console.log('связанные с деталью',detail,'вопросы анкеты',linkedDetailsHash[detail]);
                        if(typeof detailsQuestionsHash[question.id] == 'undefined') {

                            detailsQuestionsHash[question.id] = [];
                        }

                        detailsQuestionsHash[question.id] = detailsQuestionsHash[question.id].concat(linkedDetailsHash[detail]);

                    }
                }

            }

            templates[templateId].detailsQuestionsHash = detailsQuestionsHash;
           // console.log('объект detailsQuestionsHash',detailsQuestionsHash);

            // Расчитываем зависимости вопросов по операциям от вопросов анкеты operationParameterQuestionsHash
            // Для каждого вопроса по операции
            for(k=0; k< templates[templateId].data.operationParameterQuestions.length; k++){
                question = templates[templateId].data.operationParameterQuestions[k];

                // Связь через операции над деталью linkedDetailOperations
                for(i=0; i< question.linkedDetailOperations.length; i++){
                    link = question.linkedDetailOperations[i];
                    key = link.detailId+':'+link.id;
                    // console.log('Связь с операцией',key,linkedDetailOperationsHash[key]);
                    if(typeof linkedDetailOperationsHash[key] != 'undefined'){
                        if(typeof operationParameterQuestionsHash[question.id] == 'undefined'){
                            operationParameterQuestionsHash[question.id] = [];
                        }
                        operationParameterQuestionsHash[question.id] = operationParameterQuestionsHash[question.id].concat(linkedDetailOperationsHash[key]);
                    }
                }

                // Связи через операции над листами linkedSheetOperations
                for(i=0; i < question.linkedSheetOperations.length; i++){
                    link = question.linkedSheetOperations[i];
                    key = link.sheetId + ':' + link.id;
                    if(typeof linkedSheetOperationsHash[key] != 'undefined'){
                        if(typeof operationParameterQuestionsHash[question.id] == 'undefined'){
                            operationParameterQuestionsHash[question.id] = [];
                        }
                        operationParameterQuestionsHash[question.id] = operationParameterQuestionsHash[question.id].concat(linkedSheetOperationsHash[key]);
                    }

                }

                // cвязи через операции надо сторонами листа linkedSheetSideOperations
                for(i=0; i< question.linkedSheetSideOperations.length; i++){
                    link = question.linkedSheetSideOperations[i];
                    key = link.sheetId + ':' + link.sheetSide + ':'+link.id;


                    if(typeof linkedSheetSideOperationsHash[key] != 'undefined'){

                        if(typeof operationParameterQuestionsHash[question.id] == 'undefined'){
                            operationParameterQuestionsHash[question.id] = [];
                        }
                        operationParameterQuestionsHash[question.id] = operationParameterQuestionsHash[question.id].concat(linkedSheetSideOperationsHash[key]);

                    }
                }

            }

            templates[templateId].linkedDetailOperationsHash = operationParameterQuestionsHash;
//            console.log('Связи операций с вопросами анкеты',templateId,operationParameterQuestionsHash);

            // Для отображени вопросов по бумаге
            templates[templateId].linkedSheetsHash = linkedSheetsHash;

            // расчитываем зависимости вопросов по количеству печатных листов от вопросов анкеты printedPagesQuestionsHash
            // для каждого вопроса по количеству печатных листов
            for(k=0; k < templates[templateId].data.printedPagesQuestions.length; k++){
                question = templates[templateId].data.printedPagesQuestions[k];

              //  console.log('Вопрос по количеству печатных листов',templateId,question);

                // Связь через связанные детали linkedDetails
                for(i = 0; i < question.linkedDetails.length; i++){
                    detail = question.linkedDetails[i];
                    if(typeof linkedDetailsHash[detail] != 'undefined'){
                        // console.log('Связанные вопросы анкеты',detail,linkedDetailsHash[detail]);

                        if(typeof printedPagesQuestionsHash[question.id] == 'undefined') {

                            printedPagesQuestionsHash[question.id] = [];
                        }

                        printedPagesQuestionsHash[question.id] = printedPagesQuestionsHash[question.id].concat(linkedDetailsHash[detail]);
                    }
                }

            }

            templates[templateId].printedPagesQuestionsHash = printedPagesQuestionsHash;

            // расчитываем зависимость вопросов по формату formatQuestions от вопросов анкеты
            for(k=0; k < templates[templateId].data.formatQuestions.length; k++){
                question = templates[templateId].data.formatQuestions[k];
                console.log('Вопрос по формату',templateId,question);

                // Связи через связанные детали linkedDetails
                // для каждой связанной детали
                for(i = 0; i < question.linkedDetails.length; i++){
                    detail = question.linkedDetails[i];

                    if(typeof linkedDetailsHash[detail] != 'undefined'){
                        if(typeof formatQuestionsHash[question.id] == 'undefined') {

                            formatQuestionsHash[question.id] = [];
                        }

                        formatQuestionsHash[question.id] = formatQuestionsHash[question.id].concat(linkedDetailsHash[detail]);

                    }
                }

                // Связи через связанные листы linkedSheets
                // для каждого связанного листа
                for(i = 0; i< question.linkedSheets.length; i++){
                    sheet = question.linkedSheets[i];

                    if(typeof linkedSheetsHash[sheet] != 'undefined'){
                        if(typeof formatQuestionsHash[question.id] == 'undefined') {

                            formatQuestionsHash[question.id] = [];
                        }

                        formatQuestionsHash[question.id] = formatQuestionsHash[question.id].concat(linkedSheetsHash[sheet]);

                    }

                }


            }

            templates[templateId].formatQuestionsHash = formatQuestionsHash;

         //   console.log('Объект formatQuestionsHash ',formatQuestionsHash);
            //          if(Object.keys(linkedSheetsHash).length >0)
            // console.log('Объект linkedDetailsHash',linkedDetailsHash);
//            console.log('объект linkedSheetsHash',linkedSheetsHash);
            //          console.log('Объект linkedDetailOperationsHash',linkedDetailOperationsHash);
            //          console.log('Обхект linkedSheetOperationsHash',linkedSheetOperationsHash);
            //          console.log('Объект linkedSheetSideOperationsHash',linkedSheetSideOperationsHash);

        };

        // Функция отправляет запрос на расчет принимает - объект с параметрами расчета,
        // возвращает Promise с результатом расчета

        // Если передан второй параметр note - оформляет заказ заказ,
        // возвращает то что должно возвращать при сохранении заказа
        var postCalculation = function (params,note) {
            return $q(function (resolve,reject) {

                var req = params;
                
                if(note){ // если передан note
                    
                    req = AppState.getField('calcObject');
                    req.note = note;
                    req.save = true;
                }else{
                    AppState.setField('calcObject',req);
                }


                var config = {};
                if(AppState.getField('authorized')){
                    config = {headers: {
                        'Authorization': 'Bearer '+AuthService.getBearer()
                    }};
                }

                // console.log('Отправляемый заказ',JSON.stringify(req));

                $http.post(postOrderUrl,JSON.stringify(req),config)
                    .then(function (res) {
                        resolve(res);
                    })
                    .catch(function (err) {
                        reject(err)
                    })

            });
        };

        // Функция загружает каталог продуктов во внутренние структуры
        var  loadProducts = function () {

            return $q(function (resolve,reject) {
                $http.get(getProductsUrl)
                    .then(function (res) {
                        popular = res.data.popular;
                        catalog = res.data.categories;
                        AppState.setField('productsLoaded',true); // Каталог продуктов загружен

                        var i,j;

                        // популярные шаблоны продуктов в массив с шаблонами
                        for(i=0; i<popular.length; i++){
                            templates[popular[i].id] = {
                                name: popular[i].name,
                                loaded: false,
                                loading: false
                            };
                        }

                        // все остальные шаблоны продуктов в массив с шаблонами
                        for(i=0; i<catalog.length; i++){
                            for(j=0; j<catalog[i].templates.length; j++){
                                templates[catalog[i].templates[j].id] = {
                                    name: catalog[i].templates[j].name,
                                    loaded: false,
                                    loading: false
                                };
                            }
                        }

                        resolve();

                    })
                    .catch(function (err) {
                        console.log('Error',err);
                        reject(err);
                    });
            });


        };

        // Функция загружает инициализированный шаблоны на основе инициализированного массива templates
        var loadTemplates = function () {

            var loadCounts =0;

            var loadTemplate = function (templateId) {

                templates[templateId].loading = true;

                $http.get(getProductsUrl + '/' + templateId)
                    .then(function (res) {

                        templates[templateId].data = res.data;

                        // расчитываем данные по зависимостям дрыго от друга вопросов
                        calcDependencies(templateId);

                        templates[templateId].loading = false;
                        templates[templateId].loaded = true;

                        loadCounts --;
                        if(loadCounts == 0){
                           //  console.log('Templates have loaded',templates);
                        }

                    })
                    .catch(function (err) {
                        console.log('Error',err);
                        templates[templateId].loading = false;
                        loadCounts --;
                    })
            };
            
            // Загружаем каждый конкретный шаблон
            for (var k in templates){
                if (templates.hasOwnProperty(k)) {
                    setTimeout(loadTemplate(k));
                    loadCounts ++;
                }
            }

        };


        // Исполняем загрузку каталога продуктов и шаблонов
        loadProducts().then(function () {
            loadTemplates();
        },function (err) {

        });

        return {
            // Функция загружает с сервера список продуктов и инициализирует значения каталога, популярных продуктов
            // а так же инициализирует и готовит к загрузке массив шаблонв продуктов
            loadProducts: loadProducts,
            loadTemplates: loadTemplates,
            getPopular: function () {
                return popular;
            },
            getCatalog: function () {
                return catalog;
            },
            getTemplates: function () {
                return templates;
            },
            postCalculation:postCalculation
        }
    }])
})();
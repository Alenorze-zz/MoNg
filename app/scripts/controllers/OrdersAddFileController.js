(function () {
angular.module('Monorythm')
    .controller('OrdersAddFileController',['$scope','$mdDialog','detailId','orderId','actionCode','$mdToast','AppState','AuthService','fileName',function ($scope,$mdDialog,detailId,orderId,actionCode,$mdToast,AppState,AuthService,fileName) {

        console.log('Открыли диалог',detailId,orderId,actionCode,fileName);

        $scope.comment = "";
        
        $scope.cancel = function () {
            $mdDialog.hide();
        }

       /* $scope.$watch('files.length',function(newVal,oldVal){
            console.log($scope.files);
        });*/

        $scope.isAdd = function () {
          return actionCode == 'add';
        };

        $scope.addFile = function () {

            switch(actionCode){
                case 'add':
                    if($scope.files.length == 0){
                        $mdToast.show( $mdToast.simple()
                            .textContent('Выбирите файл для добавления!')
                            .position('top right' )
                            .hideDelay(3000) );
                    }else{
                        console.log('Добавляем файл c комментарием',$scope.comment);


                        var formData = new FormData();

                        formData.append('file',$scope.files[0].lfFile);
                        if($scope.comment){
                            formData.append('comment',$scope.comment);
                        }

                        var url = AppState.getField('baseApiUrl')+'/api/orders/'+orderId+'/files/' + detailId;

                        var res = {formData: formData,url: url}

                       $mdDialog.hide(res);

                    }
                    break;
                case 'edit':
                    $mdDialog.hide({
                        comment:$scope.comment
                    });
                   // console.log('Редактирование комментария',detailId,orderId,fileName);
                    break;

            }
        }

    }])
})();
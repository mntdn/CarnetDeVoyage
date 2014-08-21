function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

angular.module('voyage', [])
    .controller('ArticleController', ['$scope', function ($scope) {
        $scope.DB = [
            {
                Day : '2008-07-11',
                Pictures : [
                    {Url : 'Mandarin_Pair.jpg'}, 
                    {Url : 'Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg'}
                ],
                Content : 'voyage1.html'
            },
            {
                Day : '2008-07-12',
                Pictures : [
                    {Url : '1280px-Various_grains.jpg'}, 
                    {Url : 'NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg'}
                ],
                Content : 'voyage2.html'
            }
        ];
        $scope.articleCourant = '';
        $scope.loadArticle = function (i) {
            $scope.articleCourant = $scope.DB[i].Content;
        };
        $scope.randPicture = function (picList) {
            return picList[getRandomInt(0, picList.length)].Url;
        };
    }]);

angular.module('voyage', [])
    .controller('ArticleController', ['$scope', function ($scope) {
        $scope.DB = [
            {
                Day : '2008-07-11',
                Pictures : ['Mandarin_Pair.jpg', 'Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg'],
                Content : 'voyage1.html'
            },
            {
                Day : '2008-07-12',
                Pictures : ['1280px-Various_grains.jpg', 'NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg'],
                Content : 'voyage2.html'
            }
        ];
        $scope.articleCourant = '';
        $scope.loadArticle = function (i) {
            $scope.articleCourant = $scope.DB[i].Content;
        };
    }]);

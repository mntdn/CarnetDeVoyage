angular.module('voyage', [])
    .controller('ArticleController', ['$scope', function ($scope) {
        $scope.articleCourant = '';
        $scope.loadArticle = function (i) {
            $scope.articleCourant = 'voyage1.html';
        };
    }]);
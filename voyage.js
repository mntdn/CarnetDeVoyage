angular.module('voyage', [])
    .controller('ArticleController', ['$scope', function($scope) {
        $scope.contenu = '';
        $scope.loadArticle = function() {
            $scope.contenu = 'Chargé !';
        };
    }]);
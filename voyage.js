function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// renvoie l'index de l'entrée de la base DB du jour cherché
// day doit être au format Date
// -1 s'il ne trouve rien
function dayIndex(day, DB) {
    for(var i = 0; i < DB.length; i++)
        if (new Date(DB[i].Day) === day)
            return i;
    return -1;
}

function calcMonths (DB) {
    // renvoie un tableau contenant les jours des mois
    // durant lesquels on a voyagé
    var startDate = new Date(DB[0].Day);
    var endDate = new Date(DB[DB.length-1].Day);
    var currentDate = startDate;
    var returnArray = [];
    while (currentDate <= endDate) {
        var tempCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        var nbDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        var currentDays = new Array();
        for (var i = 1; i <= nbDaysInMonth; i++) {
            var tempDay = {
                'Day' : tempCurrentDate,
                'PositionDB' : dayIndex(tempCurrentDate, DB)
            };
            currentDays.push(tempDay);
            console.log(currentDays);
            tempCurrentDate.setDate(tempCurrentDate.getDate() + 1);
        }
        returnArray.push(currentDays);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return returnArray;
}

var _DB = [
    {
        'Day' : '2008-02-11',
        'Pictures' : [
            {'Url' : 'Mandarin_Pair.jpg'}, 
            {'Url' : 'Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg'}
        ],
        'Content' : 'voyage1.html'
    },
    {
        'Day' : '2008-08-12',
        'Pictures' : [
            {'Url' : '1280px-Various_grains.jpg'}, 
            {'Url' : 'NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg'}
        ],
        'Content' : 'voyage2.html'
    }
];

// permet d'éviter de recalculer à chaque fois le tableau des mois
var _Months = calcMonths(_DB);

//TODO : utiliser la liste de jours dans le mois créee pour faire un tableau ressemblant
// à un calendrier avec seulement les jours où il s'est passé quelque chose qui
// sont "pleins"

angular.module('voyage', [])
    .controller('ArticleController', ['$scope', function ($scope) {
        $scope.DB = _DB;
        $scope.Months = _Months;
        $scope.articleCourant = '';
        $scope.loadArticle = function (i) {
            $scope.articleCourant = $scope.DB[i].Content;
        };
        $scope.randPicture = function (picList) {
            return picList[getRandomInt(0, picList.length)].Url;
        };
    }]);

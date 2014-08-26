function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// renvoie une date au format YYYY-MM-DD
function dateToString(d) {
    return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+(d.getDate())).slice(-2);
}

// compare 2 dates sans tenir compte de l'heure
function isSameDate(d1, d2) {
    return (d1.getFullYear() === d2.getFullYear()) && 
        (d1.getMonth() === d2.getMonth()) &&
        (d1.getDate() === d2.getDate());
}

// renvoie l'index de l'entrée de la base DB du jour cherché
// day doit être au format Date
// -1 s'il ne trouve rien
function dayIndex(day, DB) {
    for(var i = 0; i < DB.length; i++)
        if (isSameDate(new Date(DB[i].Day), day))
            return i;
    return -1;
}

// renvoie un tableau contenant les jours des mois
// durant lesquels on a voyagé
function calcMonths (DB) {
    var startDate = new Date(DB[0].Day);
    var endDate = new Date(DB[DB.length-1].Day);
    var currentDate = startDate;
    var returnArray = [];
    while (currentDate <= endDate) {
        var tempCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        var nbDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        var currentDays = new Array();
        for (var i = 1; i <= nbDaysInMonth; i++) {
            currentDays.push({
                'Day' : dateToString(tempCurrentDate),
                'PositionDB' : dayIndex(tempCurrentDate, DB),
                'DayOfWeek' : tempCurrentDate.getDay() == 0 ? 7 : tempCurrentDate.getDay() // lundi = 1, dimanche = 7 
            });
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
        'Day' : '2008-04-12',
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
        $scope.moveFirst = function (day, i) {
            return i == 0 ? "margin-left: " + ((day.DayOfWeek - 1) * 42) + "px" : "";
        };
        $scope.loadArticle = function (i) {
            $scope.articleCourant = $scope.DB[i].Content;
        };
        $scope.randPicture = function (picList) {
            return picList[getRandomInt(0, picList.length)].Url;
        };
    }]);

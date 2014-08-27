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
        var currentMonth = currentDate.getMonth() + 1;
        var currentDays = new Array();
        for (var i = 1; i <= nbDaysInMonth; i++) {
            currentDays.push({
                'Day' : new Date(tempCurrentDate),
                'PositionDB' : dayIndex(tempCurrentDate, DB),
                'DayOfWeek' : tempCurrentDate.getDay() == 0 ? 7 : tempCurrentDate.getDay() // lundi = 1, dimanche = 7 
            });
            tempCurrentDate.setDate(tempCurrentDate.getDate() + 1);
        }
        returnArray.push({
            'Month': currentMonth,
            'Days': currentDays
        });
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

angular.module('voyage', [])
    .filter('monthName', [function() {
        return function (monthNumber) { //1 = Janvier
            var monthNames = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ];
            return monthNames[monthNumber - 1];
        }
    }]) 
    .controller('ArticleController', ['$scope', function ($scope) {
        $scope.DB = _DB;
        $scope.Months = _Months;
        $scope.MoisAffiche = 0; // contient le mois actuellement affiché
        $scope.prevMonth = function () {
            $scope.MoisAffiche = $scope.MoisAffiche == 0 ? 0 : $scope.MoisAffiche - 1;
        };
        $scope.nextMonth = function () {
            $scope.MoisAffiche = $scope.MoisAffiche == $scope.Months.length - 1 ? $scope.MoisAffiche : $scope.MoisAffiche + 1;
        };
        $scope.displayPrev = function () {
            return $scope.MoisAffiche == 0 ? "display: none" : "";
        };
        $scope.displayNext = function () {
            return $scope.MoisAffiche == $scope.Months.length - 1 ? "display: none" : "";
        };
        $scope.articleCourant = '';
        $scope.moveFirst = function (day, i) {
            return i == 0 ? "margin-left: " + ((day.DayOfWeek - 1) * 52) + "px" : "";
        };
        $scope.loadArticle = function (i) {
            if (i >= 0)
                $scope.articleCourant = $scope.DB[i].Content;
        };
        $scope.randPictureUrl = function (index) {
            // renvoie une image aléatoire de l'entrée d'index "index" dans la DB
            return index == -1 ? '' : $scope.DB[index].Pictures[getRandomInt(0, $scope.DB[index].Pictures.length)].Url;
        };
    }]);

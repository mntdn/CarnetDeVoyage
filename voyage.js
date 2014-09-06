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

// permet d'éviter de recalculer à chaque fois le tableau des mois
var _Months = calcMonths(window._DB);

angular.module('voyage', ['ui.bootstrap'])
    .filter('monthName', [function() {
        return function (monthNumber) { //1 = Janvier
            var monthNames = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ];
            return monthNames[monthNumber - 1];
        }
    }]) 
    .controller('ArticleController', function ($scope, $rootScope, $modal) {
        $rootScope.DB = window._DB;
        $scope.Months = _Months;
        $scope.currentMonth = 0; // contient le mois actuellement affiché
        $scope.prevMonth = function () {
            // charge le mois précédent, ne fait rien si déjà en début de liste de mois
            return $scope.currentMonth == 0 ? 0 : $scope.currentMonth - 1;
        };
        $scope.nextMonth = function () {
            // charge le mois suivant, ne fait rien si déjà en début de liste de mois
            return $scope.currentMonth == $scope.Months.length - 1 ? $scope.currentMonth : $scope.currentMonth + 1;
        };
        $scope.loadMonth = function (month) {
            $scope.currentMonth = month;
        };
        $scope.displayPrev = function () {
            // permet d'afficher ou non le bouton permettant d'aller au mois précédent
            // en fonction de la position dans la liste de mois
            return $scope.currentMonth == 0 ? "visibility: hidden" : "";
        };
        $scope.displayNext = function () {
            // permet d'afficher ou non le bouton permettant d'aller au mois suivant
            // en fonction de la position dans la liste de mois
            return $scope.currentMonth == $scope.Months.length - 1 ? "visibility: hidden" : "";
        };
        $scope.articleCourant = '';
        $rootScope.photosCourant = [];
        $scope.moveFirst = function (day, i) {
            // ajoute un décalage au premier jour dans le calendrier 
            // lundi sera ainsi toujours la 1re case
            return i == 0 ? "margin-left: " + ((day.DayOfWeek - 1) * 42) + "px" : "";
        };
        $scope.setDayClass = function (day) {
            // s'il y a une article pour le jour, renvoie la classe correcte
            return day.PositionDB < 0 ? "" : "article";
        };
        $scope.loadArticle = function (i) {
            if (i >= 0)
            {
                $scope.articleCourant = $scope.DB[i].Content;
                $rootScope.photosCourant = $scope.DB[i].Pictures;
            }
        };
        $scope.randPictureUrl = function (index) {
            // renvoie une image aléatoire de l'entrée d'index "index" dans la DB
            return index == -1 ? '' : $scope.DB[index].Pictures[getRandomInt(0, $scope.DB[index].Pictures.length)].Url;
        };
        $rootScope.modalInstance = null;
        $scope.photoCarousel = function (photoIndex) {
            // activation de la photo cliquée
            for(var i = 0; i < $rootScope.photosCourant.length; i++)
                $rootScope.photosCourant[i].active = i == photoIndex ? true : false;
            $rootScope.modalInstance = $modal.open({
                    templateUrl: 'modalPictureCarousel.html',
                    controller: 'ModalController',
                    resolve: {}
                });

            $rootScope.modalInstance.result.then(function (selectedItem) {
                    // fermeture modal
                }, function () {
                    // modal dismissed
                });
        };
    })
    .controller('ModalController', function ($scope, $rootScope) {
        $scope.modalClose = function () {
            $rootScope.modalInstance.close();
        }
    });
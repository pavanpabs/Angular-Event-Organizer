app.controller('AppCtrl', function ($scope, $filter, $interval) {

    $scope.selectedDate = new Date();
    $scope.now = new Date();
    $scope.selectedDate.setDate($scope.selectedDate.getDate());
    $scope.events = [];
    $scope.editObj = [];

    //Calling deleteExpired function repeatedly within 10s to delete expired event
    $interval(function () {
        $scope.deleteExpired($scope.now);
    }, 10000);

    //format date that got from the calender date object
    $scope.$watch('selectedDate', function (newvalue, oldvalue) {
        $scope.fomattedDate = $filter('date')($scope.selectedDate, "MM/dd/yyyy")
    })
    //format time that got from the user input
    $scope.$watch('time', function (newvalue, oldvalue) {
        $scope.fomattedTime = $filter('date')($scope.time, "h:mm a")
    })

    //add Item
    $scope.addItem = (time, title) => {
        let dateObj = new Date($scope.fomattedDate + ' ' + $scope.fomattedTime);
        if (dateObj < $scope.now) {
            alert("entered date or time is already expired");
        } else if (time == null || title == null || time == undefined || title == undefined) {
            alert("Fill the details!");
        } else {
            let event;
            event = {
                id: Date.now(),
                title: $scope.title,
                datetime: dateObj,
                date: $scope.selectedDate.toLocaleDateString('nb-NO')
            };

            $scope.events = [...$scope.events, event];
            $scope.time = null;
            $scope.title = null;

            $scope.returnNext();
        }
    };

    //Remove events
    $scope.removeItem = (id) => {
        const filteredItems = $scope.events.filter(item => item.id != id);
        $scope.events = filteredItems;
        $scope.returnNext();
    }

    //Show edit event
    $scope.editItem = (id) => {

        let filteredItems = $scope.events.filter(item => item.id == id);
        $scope.editObj = filteredItems;
        $scope.editid = $scope.editObj[0].id;
        $scope.edittime = $scope.editObj[0].datetime;
        $scope.edittitle = $scope.editObj[0].title;
    }

    //Edit event
    $scope.updateItem = (id, title, time) => {
        if (id == undefined || time == undefined || title == undefined) {
            alert("Select an event!");
        } else if (time < $scope.now) {
            alert("entered date or time is already expired");
        } else {
            $scope.filteredItems = $scope.events.filter(item => item.id == id);
            $scope.filteredItems.map(item => {
                if (item.id === id) {
                    item.title = title;
                    item.datetime = time;
                }
            })
            id = null;
            $scope.edittime = null;
            $scope.edittitle = null;

            $scope.returnNext();
        }
    }

    //Get recent event
    $scope.returnNext = () => {
        $scope.nextDate = new Date(Math.min.apply(null, $scope.events.map(function (e) {
            return new Date(e.datetime);
        })));

        $scope.nextItem = $scope.events.filter(item => item.datetime.toLocaleDateString('nb-NO') === $scope.nextDate.toLocaleDateString('nb-NO')
            && item.datetime.toLocaleTimeString('nb-NO') === $scope.nextDate.toLocaleTimeString('nb-NO'));

    }

    //Delete expired events
    $scope.deleteExpired = () => {
        let now = new Date();
        const expiredItems = $scope.events.filter(item => item.datetime > now);
        $scope.events = expiredItems;

        $scope.returnNext();
    }
});



var app = {
    homeViewModel: null,
    takeAPictureViewModel: null,
    moviesViewModel: null,
    localTheatersViewModel: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.homeViewModel = new HomeViewModel(window.device);
        app.takeAPictureViewModel = new TakeAPictureViewModel;
        app.moviesViewModel = new MoviesViewModel();
        app.localTheatersViewModel = new LocalTheatersViewModel();

        ko.applyBindings(app.homeViewModel, $("#index")[0]);
        ko.applyBindings(app.takeAPictureViewModel, $("#camera")[0]);

        app.showTheaters();
        ko.applyBindings(app.localTheatersViewModel, $('#theater')[0]);

        app.showMovies();
        ko.applyBindings(app.moviesViewModel, $('#movie')[0]);
    },
    showMovies: function() {
        $.ajax({
            url: "http://imdbapi.org/?title=Ghostbusters&type=json&plot=full&episode=0&limit=10&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0",
            dataType: "json",
            success: function(data) {
                var movieModels = [];

                data.forEach(function(element) {
                    movieModels.push({
                        Id: element.imdb_id,
                        Name: element.title,
                        Description: element.plot_simple,
                        Rating: element.rating,
                        Poster: element.poster
                    });
                });

                app.moviesViewModel.movies(movieModels);
                
            }
        });
    },
    showTheaters: function() {
        navigator.geolocation.getCurrentPosition(mapService.onSuccess, mapService.onError, {
            maximumAge: Infinity,
            // Timeout is necessary
            timeout: 50000,
            // Needs to be set to true to work on android
            enableHighAccuracy: true
        });
    }
};

var HomeViewModel = function (device) {
    var self = this;
    self.name = ko.observable(device.name);
    self.cordova = ko.observable(device.cordova);
    self.platform = ko.observable(device.platform);
    self.uuid = ko.observable(device.uuid);
    self.version = ko.observable(device.version);
    self.sendMessage = function () {
        navigator.notification.alert("I'm bacon.", self.AlertDismissed, "Bacon", "Crispy");
    };
};

var LocalTheatersViewModel = function (theaters) {
    this.theaters = ko.observableArray(theaters);
};

var mapService = {
    onSuccess: function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        mapService.initialize(lat, lng);
    },
    onError: function() {
        mapService.initialize(-33.8665433, 151.1956316);
    },
    initialize: function(lat, lng) {
        var map;
        var service;
        var location = new google.maps.LatLng(lat, lng);

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: location,
            zoom: 15
        });

        var request = {
            location: location,
            radius: '35000',
            types: ['movie_theater']
        };

        service = new google.maps.places.PlacesService(map);
        service.search(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                app.localTheatersViewModel.theaters(results);
            }
        });
    }
};

var MoviesViewModel = function(movies) {
    var self = this;
    
    self.movies = ko.observableArray(movies);
};

var TakeAPictureViewModel = function() {
    this.takePicture = function() {
        navigator.camera.getPicture(function(imageUrl) {
            $("#putPictureHere").attr("src", imageUrl);            
        }, function(error) {
            alert("Error: " + error.code + " - " + error.message);
        }, { destinationType: navigator.camera.DestinationType.FILE_URI });
    };
};
var pebblePlugin = {
    notifyPebble: function(successCallback, errorCallback, sender, message) {
        cordova.exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'PebblePlugin', // mapped to our native Java class called "CalendarPlugin"
            'pebbleNotification', // with this action name
            [{
                "sender":sender,
                "message":message
            }]
        );
    }
}
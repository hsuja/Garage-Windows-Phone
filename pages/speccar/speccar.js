// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var loc = null;
    var lat = null;
    var long = null;
    var loc_err = null;
    var getPosDone = false;
    var errHandlerDone = false;

    WinJS.UI.Pages.define("/pages/speccar/speccar.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        
        ready: function (element, options) {
            // TODO: Initialize the page here.

            document.getElementById("loc_status").innerHTML = "Finding location...";
            getLoc();
            var tempthis = this;
            var client = new Windows.Web.Http.HttpClient();
            var uri = "http://fleetmgr2212.appspot.com/user/" + WinJS.Application.sessionState.uid + "/specCar/" + WinJS.Application.sessionState.sid;

            if (WinJS.Application.sessionState.uid == null) {
                WinJS.Navigation.navigate('/pages/login/login.html');
            } else {
                
                client.getAsync(new Windows.Foundation.Uri(uri)).done(function (result) {

                    var jsonResult = JSON.parse(result.content.toString());
                    var year = jsonResult.year.toString();
                    var make = jsonResult.make.toString();
                    var model = jsonResult.model.toString();
                    var page_title = year + ' ' + make + ' ' + model;
                    document.getElementById("pagetitle").innerText = page_title;

                });
            }

            uri += "/fillUp";
            if (WinJS.Application.sessionState.uid == null) {
                WinJS.Navigation.navigate('/pages/login/login.html');
            } else {
                
                client.getAsync(new Windows.Foundation.Uri(uri)).done(function (result) {

                    var jsonResult = JSON.parse(result.content.toString());

                    if (jsonResult.fillUps.length == 0) {
                        document.getElementById("fillupList").innerHTML = "No fill ups in database.";
                    }

                    for (var i in jsonResult.fillUps) {

                        var out = 'Date: ' + jsonResult.fillUps[i].date.toString() + '<br>Distance: ' + jsonResult.fillUps[i].distance.toString() +
                                   '<br>Fuel Used: ' + jsonResult.fillUps[i].fuelused.toString() + '<br>MPG: ' + jsonResult.fillUps[i].fuelecon.toString();

                        if (jsonResult.fillUps[i].latitude && jsonResult.fillUps[i].longitude) {
                            out += '<br>Latitude: ' + jsonResult.fillUps[i].latitude.toString() + '<br>Longitude: ' + jsonResult.fillUps[i].longitude.toString();
                        }

                        out += '<br><button class="delete" id="' + jsonResult.fillUps[i].key.toString() + '">Delete</button><br><br>';
                        document.getElementById("fillupList").innerHTML += out;

                    }

                    //bind event handlers
                    WinJS.Utilities.query("button.delete").listen("click", tempthis.deleteClickHandler, false);

                    var addFillUpButton = document.getElementById("addFillUp");
                    addFillUpButton.addEventListener("click", tempthis.addClickHandler, false);

                    var homeButton = document.getElementById("homeButton");
                    homeButton.addEventListener("click", function (eventInfo) { WinJS.Navigation.navigate('/pages/portal/portal.html'); }, false);

                    var logoutButton = document.getElementById("logoutButton");
                    logoutButton.addEventListener("click", function (eventInfo) {
                        WinJS.Application.sessionState.uid = null;
                        WinJS.Application.sessionState.sid = null;
                        WinJS.Navigation.navigate('/pages/login/login.html');
                    }, false);
                });
            }
        },

        deleteClickHandler: function (eventInfo) {

            var fid = this.id;
            var client = new Windows.Web.Http.HttpClient();
            var uri = "http://fleetmgr2212.appspot.com/user/" + WinJS.Application.sessionState.uid.toString() + "/specCar/" + WinJS.Application.sessionState.sid.toString() + "/fillUp/" + fid.toString();

            client.deleteAsync(new Windows.Foundation.Uri(uri)).done(function (result) {
                document.getElementById("output").innerHTML = "Fill Up deleted.";
                setTimeout(function () { WinJS.Navigation.navigate('/pages/speccar/speccar.html'); }, 1000);
            });
        },

       addClickHandler: function (eventInfo) {
          
           document.getElementById("error").innerHTML = "";
           getPosDone = false;
           errHandlerDone = false;
           var err_msg;
           
           var date = document.getElementById("dateInput").value;
           var distance = document.getElementById("distanceInput").value;
           var fuelused = document.getElementById("fuelusedInput").value;

           // Validate data
           var datePattern = /^\d{2}-\d{2}-\d{4}$/;
           var floatPattern = /^\d+\.?\d*$/;
           var validDate = datePattern.test(date);
           var validDistance = floatPattern.test(distance);
           var validFuelused = floatPattern.test(fuelused);

           if (!validDate) {
               //print error message
               document.getElementById("error").innerHTML += "Error: Date must be formatted as MM-DD-YYYY<br>";
           }

           if (!validDistance) {
               document.getElementById("error").innerHTML += "Error: Distance must be a valid non-negative number<br>";
           } 

           if (!validFuelused) {
               document.getElementById("error").innerHTML += "Error: Fuel Used must be a valid positive number<br>";
           } else {
               // Avoid division by zero
               if (parseFloat(fuelused) <= 0) {
                   document.getElementById("error").innerHTML += "Error: Fuel Used must be greater than 0<br>";
               }
           }
           
            // Add new fillup to API
           if (validDate && validDistance && validFuelused) {
               
               var client = new Windows.Web.Http.HttpClient();
               var payload = "date=" + date + "&distance=" + distance + "&fuelused=" + fuelused;

               if (lat != null && long != null) {
                   payload += "&latitude=" + lat + "&longitude=" + long;
               }

               var uri = "http://fleetmgr2212.appspot.com/user/" + WinJS.Application.sessionState.uid.toString() + "/specCar/" + WinJS.Application.sessionState.sid.toString() + "/fillUp";

               client.postAsync(new Windows.Foundation.Uri(uri), Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8, 'application/x-www-form-urlencoded')).done(function (result) {
                   
                   document.getElementById("output").innerText = "Successfully added a Fuel Up!";

                   client.getAsync(new Windows.Foundation.Uri(uri)).done(function (result) {

                       var jsonResult = JSON.parse(result.content.toString());
                       document.getElementById("fillupList").innerHTML = "";

                       for (var i in jsonResult.fillUps) {

                           var out = 'Date: ' + jsonResult.fillUps[i].date.toString() + '<br>Distance: ' + jsonResult.fillUps[i].distance.toString() +
                               '<br>Fuel Used: ' + jsonResult.fillUps[i].fuelused.toString() + '<br>MPG: ' + jsonResult.fillUps[i].fuelecon.toString();

                           if (jsonResult.fillUps[i].latitude && jsonResult.fillUps[i].longitude) {
                               out += '<br>Latitude: ' + jsonResult.fillUps[i].latitude.toString() + '<br>Longitude: ' + jsonResult.fillUps[i].longitude.toString();
                           }

                           out += '<br><button class="delete" id="' + jsonResult.fillUps[i].key.toString() + '">Delete</button><br><br>';
                           document.getElementById("fillupList").innerHTML += out;

                       }
                       
                       WinJS.Utilities.query("button.delete").listen("click", function (eventInfo) {
                           
                           var fid = this.id;
                           var client = new Windows.Web.Http.HttpClient();
                           var uri = "http://fleetmgr2212.appspot.com/user/" + WinJS.Application.sessionState.uid.toString() + "/specCar/" + WinJS.Application.sessionState.sid.toString() + "/fillUp/" + fid.toString();

                           client.deleteAsync(new Windows.Foundation.Uri(uri)).done(function (result) {
                               document.getElementById("output").innerHTML = "Fill Up deleted.";
                               setTimeout(function () { WinJS.Navigation.navigate('/pages/speccar/speccar.html'); }, 1000);
                           });
                           
                       }, false);

                   });
               });
           }
       },
       
       unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Respond to changes in layout.
        }
    });

    // geolocation code
    function getLoc () {
        if (loc == null) {
            loc = new Windows.Devices.Geolocation.Geolocator();
        }

        if (loc != null) {
            loc.getGeopositionAsync().then(getPositionHandler, errorHandler);
        }
    }

    function getPositionHandler (pos) {
        
        lat = pos.coordinate.point.position.latitude;
        long = pos.coordinate.point.position.longitude;
        
        if (document.getElementById("loc_status")) {
            document.getElementById('loc_status').innerHTML = 'Location found:<br>lat = ' + lat.toString() + '<br>long= ' + long.toString();
        }

        getPosDone = true;
       
    }

    function errorHandler (e) {        
        loc_err = e.message;
        document.getElementById('loc_status').innerHTML = "ERROR: could not find location";
        errHandlerDone = true;
    }

})();

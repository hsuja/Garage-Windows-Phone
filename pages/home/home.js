(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        

        ready: function (element, options) {
            // TODO: Initialize the page here.
            document.getElementById("pagetitle").innerHTML = "";
            var username = WinJS.Application.sessionState.username.toString();
            var uid = WinJS.Application.sessionState.uid;
            
            var tempthis = this;

            document.getElementById("pagetitle").innerHTML = username + "'s Garage";

            var client = new Windows.Web.Http.HttpClient();

            var url = "http://fleetmgr2212.appspot.com/user/" + uid + "/specCar";


            if (uid == null) {
                WinJS.Navigation.navigate('/pages/login/login.html');
            } else {
                client.getAsync(new Windows.Foundation.Uri(url)).done(function (result) {

                    var jsonResult = JSON.parse(result.content.toString());

                    if (jsonResult.specCars.length == 0) {
                        document.getElementById("carList").innerHTML = "No cars.";
                    }

                    for (var i in jsonResult.specCars) {

                        var out = jsonResult.specCars[i].year.toString() + ' ' + jsonResult.specCars[i].make.toString() + ' '
                            + jsonResult.specCars[i].model.toString();

                        if (jsonResult.specCars[i].fuelecon) {
                            out += '<br>Avg MPG: ' + jsonResult.specCars[i].fuelecon.toString();
                        }

                        out += '<br><button class="view" id="' + jsonResult.specCars[i].key.toString() + '">View</button><br>';

                        document.getElementById("carList").innerHTML += out;


                    }

                    WinJS.Utilities.query("button.view").listen("click", tempthis.viewClickHandler, false);

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

            var addCarButton = document.getElementById("addCarButton");
            addCarButton.addEventListener("click", this.addCarClickHandler, false);
        },

        addCarClickHandler: function (eventInfo) {

            document.getElementById("error").innerHTML = "";
            
           
            var year = document.getElementById("yearInput").value;
            var make = document.getElementById("makeInput").value;
            var model = document.getElementById("modelInput").value;

            if (year == "" || make == "" || model == "") {

                document.getElementById("error").innerHTML = "Error: All fields must be nonempty.";

            } else {



                // Add new specCar to API


                var client = new Windows.Web.Http.HttpClient();
                var payload = "year=" + year + "&make=" + make + "&model=" + model;

                //var uri = "http://fleetmgr2212.appspot.com/user/5707702298738688/specCar/" + WinJS.Application.sessionState.sid.toString() + "/fillUp";
                var uri = "http://fleetmgr2212.appspot.com/user/" + WinJS.Application.sessionState.uid.toString() + "/specCar";

                client.postAsync(new Windows.Foundation.Uri(uri), Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8, 'application/x-www-form-urlencoded')).done(function (result) {

                    document.getElementById("output").innerText = "Successfully added a car!";
                    //setTimeout(function () { WinJS.Navigation.navigate('/pages/home/home.html'); }, 1000);
                    

                    client.getAsync(new Windows.Foundation.Uri(uri)).done(function (result) {

                        var jsonResult = JSON.parse(result.content.toString());

                        document.getElementById("carList").innerHTML = "";

                        for (var i in jsonResult.specCars) {

                            var out = jsonResult.specCars[i].year.toString() + ' ' + jsonResult.specCars[i].make.toString() + ' '
                                + jsonResult.specCars[i].model.toString(); 

                            if (jsonResult.specCars[i].fuelecon) {
                                out += '<br>Avg MPG: ' + jsonResult.specCars[i].fuelecon.toString();
                            }

                            out += '<br><button class="view" id="' + jsonResult.specCars[i].key.toString() + '">View</button><br>';

                            document.getElementById("carList").innerHTML += out;


                        }

                        
                        WinJS.Utilities.query("button.view").listen("click", function (eventInfo) {
                            var key = this.id;
                            WinJS.Application.sessionState.sid = key;
                            WinJS.Navigation.navigate('/pages/speccar/speccar.html');
                        }, false);

                    });
                });


            }

        },



        viewClickHandler: function (eventInfo) {

            var key = this.id;
            WinJS.Application.sessionState.sid = key;
            WinJS.Navigation.navigate('/pages/speccar/speccar.html');

        },
        
    });
})();

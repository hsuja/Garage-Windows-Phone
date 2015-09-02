// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/allcars/allcars.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            
            var client = new Windows.Web.Http.HttpClient();
            var url = "http://fleetmgr2212.appspot.com/carModel";

            client.getAsync(new Windows.Foundation.Uri(url)).done(function (result) {

                var jsonResult = JSON.parse(result.content.toString());

                for (var i in jsonResult.carModels) {

                    var out = jsonResult.carModels[i].year.toString() + ' ' + jsonResult.carModels[i].make.toString() + ' '
                        + jsonResult.carModels[i].model.toString();
                    
                    if (jsonResult.carModels[i].fuelecon) {
                        out += '<br>Avg MPG: ' + jsonResult.carModels[i].fuelecon.toString();
                    }
                   
                    out += '<br><br>';

                    document.getElementById("allcarsList").innerHTML += out;
                }
            });
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Respond to changes in layout.
        }
    });
})();

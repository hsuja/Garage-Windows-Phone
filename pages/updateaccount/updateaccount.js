// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/updateaccount/updateaccount.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            if (WinJS.Application.sessionState.uid == null) {
                WinJS.Navigation.navigate('/pages/login/login.html');
            }

            var logoutButton = document.getElementById("logoutButton2");
            logoutButton.addEventListener("click", function (eventInfo) {
                WinJS.Application.sessionState.uid = null;
                WinJS.Application.sessionState.sid = null;
                WinJS.Navigation.navigate('/pages/login/login.html');
            }, false);

            var updateButton = document.getElementById("updateButton");
            updateButton.addEventListener("click", this.updateButtonClickHandler, false);
        },


        updateButtonClickHandler: function (eventInfo) {

            document.getElementById("output").innerHTML = "";

            var uid = WinJS.Application.sessionState.uid;

            var new_nameInput = document.getElementById("new_nameInput").value;
            var new_emailInput = document.getElementById("new_emailInput").value;
            //var old_passwordInput = document.getElementById("old_passwordInput").value;
            var new_passwordInput = document.getElementById("new_passwordInput").value;

            var client = new Windows.Web.Http.HttpClient();

            var uri = "http://fleetmgr2212.appspot.com/user/" + uid;

            var payload = "";

            if (new_nameInput != "") {
                payload += "newName=" + new_nameInput;
            }

            if (new_emailInput != "") {
                if (payload != "") {
                    payload += "&";
                }
                payload += "newEmail=" + new_emailInput;
            }

            if (new_passwordInput != "") {
                if (payload != "") {
                    payload += "&";
                }
                payload += "newPass=" + new_passwordInput;
            }



            //var payload = "newName=" + new_nameInput + "&newEmail=" + new_emailInput + "&newPass=" + new_passwordInput;
            if (payload != "") {
                client.putAsync(new Windows.Foundation.Uri(uri), Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8, 'application/x-www-form-urlencoded')).done(function (result) {

                    document.getElementById("output").innerText = "Updated user profile!";
                    setTimeout(function () { WinJS.Navigation.navigate('/pages/portal/portal.html'); }, 500);
                    //WinJS.Navigation.navigate('/pages/login/login.html');

                });
            } else {
                document.getElementById("output").innerText = "No changes made.";
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
})();

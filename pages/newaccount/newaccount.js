// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/newaccount/newaccount.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var signUpButton = document.getElementById("signUpButton");
            signUpButton.addEventListener("click", this.signUpButtonClickHandler, false);
        },

        signUpButtonClickHandler: function (eventInfo) {

            document.getElementById("output").innerHTML = "";
            var nameInput = document.getElementById("nameInput").value;
            var emailInput = document.getElementById("emailInput").value;
            var usernameInput = document.getElementById("usernameInput").value;
            var passwordInput = document.getElementById("passwordInput").value;
            var usernameTaken = false;
            var client = new Windows.Web.Http.HttpClient();
            var uri = "http://fleetmgr2212.appspot.com/user";

            client.getAsync(new Windows.Foundation.Uri(uri)).done(function (result) {

                var jsonResult = JSON.parse(result.content.toString());
    
                // Ensure username is unique
                for (var i in jsonResult.users) {
                    if (jsonResult.users[i].username == usernameInput) {
                        usernameTaken = true;
                    }
                }

                if (usernameTaken) {
                    document.getElementById("output").innerHTML = "Sorry, that username is already taken.";
                } else {
                    
                    //create account
                    var payload = "username=" + usernameInput + "&name=" + nameInput + "&password=" + passwordInput + "&email=" + emailInput;

                    client.postAsync(new Windows.Foundation.Uri(uri), Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8, 'application/x-www-form-urlencoded')).done(function (result) {

                        document.getElementById("output").innerText = "Successfully created account! Please login.";
                        setTimeout(function () { WinJS.Navigation.navigate('/pages/login/login.html'); }, 3000);
                       
                    });
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

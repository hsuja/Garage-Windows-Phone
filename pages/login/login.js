// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var signInButton = document.getElementById("signInButton");
            signInButton.addEventListener("click", this.signInClickHandler, false);

            var createAccountButton = document.getElementById("createAccountButton");
            createAccountButton.addEventListener("click", this.createAccountClickHandler, false);
        },

        signInClickHandler: function (eventInfo) {

            document.getElementById("signInOutput").innerHTML = "";
            var usernameInput = document.getElementById("usernameInput").value;
            var passwordInput = document.getElementById("passwordInput").value;
            var authenticated = false;
            var client = new Windows.Web.Http.HttpClient();

            client.getAsync(new Windows.Foundation.Uri("http://fleetmgr2212.appspot.com/user")).done(function (result) {

                var jsonResult = JSON.parse(result.content.toString());

                for (var i in jsonResult.users) {

                    if (jsonResult.users[i].username == usernameInput && jsonResult.users[i].password == passwordInput) {
                        authenticated = true;
                        //save user key and username in session
                        WinJS.Application.sessionState.uid = jsonResult.users[i].key;
                        WinJS.Application.sessionState.username = jsonResult.users[i].username;
                    }
                    
                }
              
                if (authenticated) {
                    document.getElementById("signInOutput").innerHTML = "user authenticated";
                    //Navigate to Page
                    WinJS.Navigation.navigate('/pages/portal/portal.html');

                } else {
                    document.getElementById("signInOutput").innerHTML = "Sorry, we don't recognize that username or password. Please try again.";
                }

            });
        },

        createAccountClickHandler: function (eventInfo) {
            WinJS.Navigation.navigate('/pages/newaccount/newaccount.html');
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

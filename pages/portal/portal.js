// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/portal/portal.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.


            if (WinJS.Application.sessionState.uid == null) {
                WinJS.Navigation.navigate('/pages/login/login.html');
            }


            var userCarsButton = document.getElementById("userCarsButton");
            userCarsButton.addEventListener("click", this.userCarsButtonClickHandler, false);

            var allCarsButton = document.getElementById("allCarsButton");
            allCarsButton.addEventListener("click", this.allCarsButtonClickHandler, false);

            var editAccountButton = document.getElementById("editAccountButton");
            editAccountButton.addEventListener("click", this.editAccountButtonClickHandler, false);

            var logoutButton = document.getElementById("logoutButton");
            logoutButton.addEventListener("click", function (eventInfo) {
                WinJS.Application.sessionState.uid = null;
                WinJS.Application.sessionState.sid = null;
                WinJS.Navigation.navigate('/pages/login/login.html');
            }, false);
        },




        userCarsButtonClickHandler: function (eventInfo) {
  
            WinJS.Navigation.navigate('/pages/home/home.html');

        },

        allCarsButtonClickHandler: function (eventInfo) {
  
            WinJS.Navigation.navigate('/pages/allcars/allcars.html');

        },

        editAccountButtonClickHandler: function (eventInfo) {
  
            WinJS.Navigation.navigate('/pages/updateaccount/updateaccount.html');

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

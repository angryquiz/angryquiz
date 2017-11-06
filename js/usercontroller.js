var userController = {
    data: {
        auth0Lock: null,
        config: null
    },
    uiElements: {
        loginButton: null,
        logoutButton: null,
        signupButton: null,
        signupButton1: null
    },

    signup: function() {

        var params = {
        };
        this.data.auth0Lock.showReset(params);        

    },

    init: function (config) {

        this.uiElements.loginButton = $('#auth0-login');
        this.uiElements.logoutButton = $('#auth0-logout');
        this.uiElements.signupButton = $('#auth0-signup');
		this.uiElements.resetButton = $('#auth0-reset');

        this.uiElements.logoutButton.hide();
        this.uiElements.loginButton.hide();

        this.data.config = config;
        this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);

        /*
        // check to see if the user has previously logged in
        var idToken = localStorage.getItem('userToken');
        console.log(idToken);
        if (idToken) {
            
            var that = this;

            that.uiElements.loginButton.hide();
            that.uiElements.logoutButton.show();

            this.data.auth0Lock.getProfile(idToken, function (err, profile) {
                console.log("Hey dude", profile);
                if (err) {
                    return alert('There was an error getting the profile: ' + err.message);
                }
            });
        } 

        if (idToken == null) {
            this.uiElements.loginButton.show();
            this.uiElements.logoutButton.hide();
        }
        */

        this.wireEvents();
    },
    wireEvents: function () {
        
        var that = this;

        this.uiElements.signupButton.click(function (e) {

            var params = {
            };

            that.data.auth0Lock.showSignup(params);
        });
		
        this.uiElements.resetButton.click(function (e) {

            var params = {
            };

            that.data.auth0Lock.showReset(params);
        });	


        /*        
        this.uiElements.loginButton.click(function (e) {

            var params = {
                callbackURL: 'http://127.0.0.1:8100/dashboard/home',
                authParams: {
                    scope: 'openid email user_metadata picture'
                }
            };

            that.data.auth0Lock.show(params, function (err, profile, token) {
                if (err) {
                    // Error callback
                    alert('There was an error');

                    that.uiElements.logoutButton.hide();
                    that.uiElements.loginButton.show();
                    
                } else {
                    // Save the JWT token.
                    localStorage.setItem('userToken', token);

                    that.uiElements.logoutButton.show();
                    that.uiElements.loginButton.hide();

                }
            });
        });
        */


        /*
        this.uiElements.logoutButton.click(function (e) {

            localStorage.removeItem('userToken');

            that.uiElements.logoutButton.hide();
            that.uiElements.loginButton.show();

        });
        */
    }
};

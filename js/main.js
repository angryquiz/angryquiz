(function () {
    $(document).ready(function () {
        userController.init(configConstants);
    });
}());

function signup() {
	//alert(1);

	var configConstants = {
	    auth0: {
	        domain: '', //Signup in Auth0
	        clientId: '' //Signup in Auth0
	    }
	};


	var auth0Lock = new Auth0Lock(configConstants.auth0.clientId, configConstants.auth0.domain);
	auth0Lock.showSignup({});
};
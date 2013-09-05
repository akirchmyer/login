/**
 * This file contains the LoginForm component
 * The LoginForm depends on jQuery and 
 */
var LoginForm = {
 
   /**
    * Initialize the LoginForm component with necessary
    */
    initialize: function () {
        var self = this, $form;
	$('.login-form .login-id').placeholder();
	$('.login-form .login-password').placeholder();

        $('.login-form .login-submit').click(function (ev) {
            $form = $(ev.currentTarget).parent();
            self.processForm($form);
            ev.preventDefault();
        });
        $('.login-form input').keypress(function (ev) {
            if (ev.which === 13) {
                $form = $(ev.currentTarget).parent();
            	self.processForm($form);
            }	
        });
    },

   /**
    * Process the form: run necessary validation and either
    * start the login request or alert an error message
    */
    processForm: function ($form) {
        var $uid = $form.find('.login-id'),
            $pw = $form.find('.login-password'),
            uid = $uid.val(),
            pw = $pw.val(),
            errorMessage = '';

        errorMessage += this.validateUid(uid);
        errorMessage += this.validatePw(pw);

        if (!errorMessage) {
            this.sendRequest('apple-id=' + uid + '&password=' + pw);
        } else {
            alert(errorMessage);
        }
        return false;
    },

   /**
    * Validate the password against a regex.
    * Right now validatePw is only verifying that the password contains non-whitespace text
    */
    validateUid: function (uid) {
	if (!/[\S]+/g.test(uid)) {
            return 'Please enter your Apple ID.\n';
        }
        return '';
    },

   /**
    * Validate the password against a regex.
    * Right now validatePw is only verifying that the password contains non-whitespace text
    */
    validatePw: function (pw) {
	if (!/[\S]+/g.test(pw)){
            return 'Please enter your password.\n';
        }
        return '';
    },

   /**
    * Send a POST request to a login API, logging a success
    * or error message to the console.
    */
    sendRequest: function (dataString) {
        $.ajax({
            type: "POST",
            url: "api/yoursite.com/login",
            data: dataString,
            success: function (data, status, jqXHR) {
                console.log(status);
            },
            error: function (jqXHR, status, errorType) {
                console.log(status + ': ' + errorType);
            }
        });
    }
};

LoginForm.initialize();

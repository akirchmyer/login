define(['jquery-placeholder', 'ajax-mock'], function() {

/**
 * This file contains the LoginForm component
 * The LoginForm depends on jQuery and
 */
var login_form = function() {};

/**
 * Bind the necessary event handlers to the form
 */
login_form.prototype.initialize = function ($form) {
	var self = this;
	$('.login .login-id').placeholder();
	$('.login .login-password').placeholder();

	$('.login .login-submit').click(function (ev) {
		var $form = $(ev.currentTarget).parent();
		self.processForm($form);
		ev.preventDefault();
	});
};

/**
 * Process the form: run necessary validation and either
 * start the login request or alert an error message
 */
login_form.prototype.processForm = function ($form) {
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
		window.alert(errorMessage);
	}
	return false;
};

/**
 * Validate the password against a regex.
 * Right now validatePw is only verifying that the password contains non-whitespace text
 */
login_form.prototype.validateUid = function (uid) {
	if (!/[\S]+/g.test(uid)) {
		return 'Please enter your Apple ID.\n';
	}
	return '';
};

/**
 * Validate the password against a regex.
 * Right now validatePw is only verifying that the password contains non-whitespace text
 */
login_form.prototype.validatePw = function (pw) {
	if (!/[\S]+/g.test(pw)){
		return 'Please enter your password.\n';
	}
	return '';
};

/**
* Send a POST request to a login API, logging a success
* or error message to the console.
*/
login_form.prototype.sendRequest = function (dataString) {
	$.ajax({
		type: "POST",
		url: "http://api.kirchmyer.net/login/",
		data: dataString,
		dataType: "json",
		contentType: 'application/json; charset=utf-8',
		success: function (data, status, jqXHR) {
			console.log(status);
			window.alert('Welcome, ' + data.firstName + ' ' + data.lastName);
		},
		error: function (jqXHR, status, errorType) {
			console.log(status + ' ' + errorType);
			window.alert('Username or password is incorrect.');
		}
	});
};

return login_form;
});

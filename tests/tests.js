define(['login'], function(LoginComponent) {
	test('test initialize', function() {
		var fakeEvent, $el = $('<form class="login-form"><input class="login-submit" /></form>');

		$('body').append($el);

		this.stub(LoginComponent.prototype, 'processForm');

		// Test the initialize method
		LoginComponent.prototype.initialize();
		equal(LoginComponent.prototype.processForm.callCount, 0, 'processForm not called yet');


		// create and stub a fake event to pass to the click handlers
		fakeEvent = jQuery.Event('click');
		fakeEvent.currentTarget = $(".login-submit");
		this.stub(fakeEvent, 'preventDefault');

		// Test click handler for submit
		$('.login-form .login-submit').trigger(fakeEvent);
		equal(LoginComponent.prototype.processForm.callCount, 1, 'processForm called on click');
		deepEqual(LoginComponent.prototype.processForm.args[0][0], $(fakeEvent.currentTarget).parent(), 'form passed to processForm');
		equal(fakeEvent.preventDefault.callCount, 1, 'preventDefault called');

		// Test keypress handler, Enter hit
		fakeEvent = jQuery.Event('keypress');
		fakeEvent.currentTarget = $(".login-submit");
		fakeEvent.which = 13;

		$('.login-form input').trigger(fakeEvent);
		equal(LoginComponent.prototype.processForm.callCount, 2, 'processForm called on enter hit');
		deepEqual(LoginComponent.prototype.processForm.args[1][0], $(fakeEvent.currentTarget).parent(), 'form passed to processForm');

		// Test keypress handler, Enter not hit
		fakeEvent.which = 12;
		$('.login-form input').trigger(fakeEvent);
		equal(LoginComponent.prototype.processForm.callCount, 2, 'processForm not called on any other keypress');

		$('.login-form').remove();
	});

	test('test processForm', function() {
		var $form = $('<form><input value="myid" class="login-id"/><input value="mypw" class="login-password"/></form>');

		this.stub(LoginComponent.prototype, 'validateUid').returns('');
		this.stub(LoginComponent.prototype, 'validatePw').returns('');
		this.stub(LoginComponent.prototype, 'sendRequest');
		this.stub(window, 'alert');

		// Test with both pw and id
		LoginComponent.prototype.processForm($form);
		equal(LoginComponent.prototype.sendRequest.callCount, 1, 'sendRequest called');
		equal(LoginComponent.prototype.sendRequest.args[0][0], 'apple-id=myid&password=mypw', 'sendRequest called with expected args');

		// Test with pw and no id
		LoginComponent.prototype.validateUid.returns('No id\n');
		LoginComponent.prototype.processForm($form);
		equal(window.alert.callCount, 1, 'window.alert called');
		equal(window.alert.args[0][0], 'No id\n', 'window.alert given expected string');

		// Test with id and no pw
		LoginComponent.prototype.validateUid.returns('');
		LoginComponent.prototype.validatePw.returns('No pw\n');
		LoginComponent.prototype.processForm($form);
		equal(window.alert.callCount, 2, 'window.alert called');
		equal(window.alert.args[1][0], 'No pw\n', 'window.alert given expected string');

		// Test with no id and no pw
		LoginComponent.prototype.validateUid.returns('No id\n');
		LoginComponent.prototype.processForm($form);
		equal(window.alert.callCount, 3, 'window.alert called');
		equal(window.alert.args[2][0], 'No id\nNo pw\n', 'window.alert given expected string');

		equal(LoginComponent.prototype.sendRequest.callCount, 1, 'sendRequest not called when window alerts');
	});

	test("test validateUid", function() {
		equal(LoginComponent.prototype.validateUid(''), 'Please enter your Apple ID.\n', 'bad uid returns expected message');
		equal(LoginComponent.prototype.validateUid('myid'), '', 'good uid returns empty string');
	});

	test("test validatePw", function() {
		equal(LoginComponent.prototype.validatePw(''), 'Please enter your password.\n', 'bad pw returns expected message');
		equal(LoginComponent.prototype.validatePw('mypw'), '', 'good uid returns empty string');
	});

	test("test sendRequest", function() {
		this.stub($, 'ajax').yieldsTo('success', {firstName: 'Sideshow', lastName: 'Bob'}, 'success');
		this.stub(console, 'log');
		this.stub(window, 'alert');

		// test success case
		LoginComponent.prototype.sendRequest('uid=myuid&pw=mypw');
		equal($.ajax.args[0][0].type, 'POST', 'POST used');
		equal($.ajax.args[0][0].url, 'http://api.kirchmyer.net/login/', 'POST sent to expected url');
		equal($.ajax.args[0][0].data, 'uid=myuid&pw=mypw', 'POST used');
		equal($.ajax.args[0][0].dataType, 'json', 'data type is json');
		equal($.ajax.args[0][0].contentType, 'application/json; charset=utf-8', 'content type is correct');
		equal(console.log.args[0][0], 'success', 'console.log called with success message on success');
		equal(window.alert.args[0][0], 'Welcome, Sideshow Bob');

		// test error case
		$.ajax.yieldsTo('error', {}, 'error', '401 Unauthorized');
		LoginComponent.prototype.sendRequest('uid=myuid&pw=mypw');
		equal($.ajax.args[1][0].type, 'POST', 'POST used');
		equal($.ajax.args[1][0].url, 'http://api.kirchmyer.net/login/', 'POST sent to expected url');
		equal($.ajax.args[1][0].data, 'uid=myuid&pw=mypw', 'POST used');
		equal($.ajax.args[1][0].dataType, 'json', 'data type is json');
		equal($.ajax.args[1][0].contentType, 'application/json; charset=utf-8', 'content type is correct');
		equal(console.log.args[1][0], 'error 401 Unauthorized', 'console.log called with error status and error type on success');
		equal(window.alert.args[1][0], 'Username or password is incorrect.');

	});
});

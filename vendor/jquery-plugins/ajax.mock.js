(function(window, $) {
	/**
	 * Mock the ajax request to call the success handler for rbanner18/springfield
	 * and fail for anyone else.
	 */
	$.ajax = function(params) {
		var dataEntries = params.data.split('&'),
			data = {};

		for (var i = 0, len = dataEntries.length, tmp; i < len; i++) {
			tmp = dataEntries[i].split('=');
			data[tmp[0]] = tmp[1];
		}
		if (data['apple-id'] === 'rbanner18' && data['password'] === 'springfield') {
			params.success({firstName:'Rex', lastName: 'Banner'}, 'success', {});
		}
		else {
			params.error({}, 'error', '401: Unauthorized');
		}
	};

}(this, jQuery));

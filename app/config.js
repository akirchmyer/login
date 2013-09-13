require.config({

  deps: ["main"],

  paths: {
	"jquery": "../vendor/jquery",
	"jquery-placeholder": "../vendor/jquery-plugins/jquery.placeholder",
	"ajax-mock": "../vendor/jquery-plugins/ajax.mock",
	"login": "components/login-component"
  },

  shim: {
	"jquery-placeholder":["jquery"],
	"ajax-mock":["jquery"]
   }	
});

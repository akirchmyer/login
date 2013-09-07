require.config({

  deps: ["main"],

  paths: {
	"jquery": "../vendor/jquery",
	"jquery-placeholder": "../vendor/jquery.placeholder",
	"login": "components/login-component"
  },

  shim: {
	"jquery-placeholder":["jquery"]
   }	
});

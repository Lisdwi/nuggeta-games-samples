$(document).ready(function() {
  var body = document.querySelector('body');

  var loadScript = function (url) {
    var elt = document.createElement('script');
    elt.setAttribute('src', url);
    elt.setAttribute('async', 'async');
    body.appendChild(elt);
  };

  loadScript('./js/main.js');
  loadScript('./js/help.js');
  loadScript('./js/license.js');

});

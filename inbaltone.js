var Vue = require('vue');
var vm = new Vue({
	el: '.main-content',
	components: {
        'my-wizard': require('./mywizard')
	}
});

var request = require('superagent');


window.PP_CB = function() {
    request
     .get('/soundlist')
     .accept('json')
     .end(function(res) {

        console.log(res.body.list); 
        pagePlayer.setPlaylist(res.body.list);

    });

}

var Vue = require('vue');
var vm = new Vue({
	el: '.main-content',
    data: {
        trainingCounter: 1,
        testCounter: 1,
        showButtons: false
    },
	components: {
        'my-wizard': require('./mywizard')
	},
    methods: {
        submit : function(set, counter, value, event) {
            console.log("Submmited value! " , set, counter, value);
            request
               .post('/answer')
               .send({ name: 'Manny', species: 'cat' })
               .set('json')
               .end(function(res){
                   console.log("res :", res);
               });
            }
    }
});

var request = require('superagent');


window.PP_CB = function() {
    request
     .get('/training')
     .accept('json')
     .end(function(res) {
        console.log(res.body.list); 
        pagePlayer.setPlaylist("training", res.body.list);

    });
    request
     .get('/test')
     .accept('json')
     .end(function(res) {
        console.log(res.body.list); 
        pagePlayer.setPlaylist("test", res.body.list);

    });

    pagePlayer.onSamplePlayed = function() {
        vm.$data.showButtons = true;
    }
}


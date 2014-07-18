var Vue = require('vue');
var vm = new Vue({
	el: '.main-content',
    data: {
        person: {
                
        },
        playlists: {
            training: {
                counter: 0,
                length: 0,
                list: null
            },
            test: {
                counter: 0,
                length: 0,
                list: null
            }
        },
        showButtons: false,
        finishedTraining: false,
        finishedTest: false
    },
	components: {
        'my-wizard': require('./mywizard')
	},
    methods: {
        submit : function(set, counter, value, event) {
            console.log("Submmited value! " , set, counter, value);
            var item = vm.$data.playlists[set].list[counter -1];
            var correct = false;
            if (item.answer == value) {
                correct = true;
            }
            console.log(item);
            request
               .post('/answer')
               .send({ set: set, counter: counter, name: item.name, correct: correct })
               .set('json')
               .accept('json')
               .end(function(res){
                   console.log("res :", res);
                   if (res.body.status == 0) {
                       vm.$data.playlists[set].counter++;
                       if (counter >= vm.$data.playlists[set].length) {

                           // Output set
                            request
                               .post('/output/' + set)
                               .set('json')
                               .accept('json')
                               .end(function(res){
                                   console.log("res :", res);
                                   if (res.body.status != 0) {
                                       alert(resl.body.message);
                                   }
                               });

                           if (set == 'training') {
                               vm.$data.finishedTraining = true;
                           } else {
                               vm.$data.finishedTest = true;
                           }
                       } 
                       vm.$data.showButtons = false;
                   } else {
                       alert(res.body.message);
                   }
               });
            },
            submitDetails: function() {
                console.log("SUBMIT DETAILS!!", vm.$data.person);
                request
                   .post('/person')
                   .set('json')
                   .send({person: vm.$data.person})
                   .accept('json')
                   .end(function(res){
                       console.log("res :", res);
                       if (res.body.status != 0) {
                           alert(resl.body.message);
                       }
                   });
                return true;
            }
    }
});

var request = require('superagent');


function getPlaylist(name) {

    request
     .get('/playlist/' + name)
     .accept('json')
     .end(function(res) {
        console.log(res.body.list); 
        pagePlayer.setPlaylist(name, res.body.list);
        vm.$data.playlists[name].list = res.body.list;
        vm.$data.playlists[name].counter = 1;
        vm.$data.playlists[name].length = res.body.list.length;
    });
}

window.PP_CB = function() {
    getPlaylist("training");
    getPlaylist("test");

    pagePlayer.onSamplePlayed = function(playlist, counter) {
        vm.$data.showButtons = true;
    }
}


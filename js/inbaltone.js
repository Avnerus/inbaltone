var Vue = require('vue');
var vm = new Vue({
	el: '.main-content',
	components: {
        'my-wizard': require('./mywizard')
	}
});

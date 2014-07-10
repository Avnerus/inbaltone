module.exports = {
    data: {
        item: {
            firstName: 'John',
            lastName: 'Doe',
            age: 22
        },
        ui: {}
    },
    replace: true,
    template: '#my-wizard',
    created: function () {
        this.ui = {
            count: $('div.page', this.$compiler.rawContent).length,
            width: $(this.$el).width(),
            pages: [],
            index: 0
        };
        for (var i = 0; i < this.ui.count; i++) {
            this.ui.pages.push(i);
        }
    },
    computed: {
        canvasWidth: function () {
            return (this.ui.count * this.ui.width + 20) + 'px';
        },
        translateX: function(){
            return 'translateX(-' + (this.ui.width * this.ui.index) + 'px)';
        }
    },
    methods: {
        moveTo: function (idx) {
            this.ui.index = idx;
        },
        putPageContents: function(idx){
            var src = $('div.page', this.$compiler.rawContent).eq(idx).html();
            return this.$compiler.compile(src, true);

        },
        prevPage: function(){
            if(this.ui.index > 0){
                this.ui.index--;
            }
        },
        nextPage: function(){
            if(this.ui.index < this.ui.count){
                this.ui.index++;
            }
        },
        finish: function(){
            window.alert('finished! your data: ' + JSON.stringify(this.item) );
        }
    }

}

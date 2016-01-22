var Component = new Brick.Component();
Component.requires = {
    mod: [
        {name: '{C#MODNAME}', files: ['lib.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,
        COMPONENT = this,
        SYS = Brick.mod.sys;

    NS.ManagerWidget = Y.Base.create('managerWidget', SYS.AppWidget, [], {
        initializer: function(){
            this.publish('carouselCreate', {
                defaultFn: this._defCarouselCreate
            });
            this.publish('carouselEdit', {
                defaultFn: this._defCarouselEdit
            });
            this.publish('carouselSlides', {
                defaultFn: this._defCarouselSlides
            });
        },
        onInitAppWidget: function(err, appInstance, options){
            this.renderCarouselList();
        },
        renderCarouselList: function(){
            var carouselList = this.get('appInstance').get('carouselList'),
                tp = this.template,
                lst = "";

            carouselList.each(function(carousel){
                console.log(carousel);
                var attrs = carousel.toJSON(true);
                lst += tp.replace('row', [
                    {
                        onoffbutton: attrs.off ?
                            tp.replace('btnon') : tp.replace('btnoff')
                    },
                    attrs
                ]);
            }, this);

            tp.gel('list').innerHTML = tp.replace('list', {
                'rows': lst
            });
        },
        carouselEnable: function(carouselId){
            this.set('waiting', true);
            this.get('appInstance').carouselEnable(carouselId, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        carouselDisable: function(carouselId){
            this.set('waiting', true);
            this.get('appInstance').carouselDisable(carouselId, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        carouselDeleteShow: function(carouselId, hide){
            var tp = this.template,
                elDShow = Y.one(document.getElementById(tp.gelid('row.delete') + '-' + carouselId)),
                elDelete = Y.one(document.getElementById(tp.gelid('row.deletegroup') + '-' + carouselId));
            if (hide){
                elDShow.show();
                elDelete.hide();
            } else {
                elDShow.hide();
                elDelete.show();
            }
        },
        carouselDelete: function(carouselId){
            this.set('waiting', true);
            this.get('appInstance').carouselDelete(carouselId, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        onClick: function(e){
            if (e.dataClick === 'carousel-create'){
                this.fire('carouselCreate');
                return true;
            }
            var carouselId = e.target.getData('id') | 0;
            if (carouselId === 0){
                return;
            }

            switch (e.dataClick) {
                case 'carousel-edit':
                    this.fire('carouselEdit', carouselId);
                    return true;
                case 'carousel-slides':
                    this.fire('carouselSlides', carouselId);
                    return true;
                case 'carousel-enable':
                    this.carouselEnable(carouselId);
                    return true;
                case 'carousel-disable':
                    this.carouselDisable(carouselId);
                    return true;
                case 'carousel-delete-show':
                    this.carouselDeleteShow(carouselId);
                    return true;
                case 'carousel-delete-cancel':
                    this.carouselDeleteShow(carouselId, true);
                    return true;
                case 'carousel-delete':
                    this.carouselDelete(carouselId);
                    return true;
            }
        },
        _defCarouselCreate: function(){
            Brick.Page.reload(NS.URL.editor.create());
        },
        _defCarouselEdit: function(e, carouselId){
            Brick.Page.reload(NS.URL.editor.edit(carouselId));
        },
        _defCarouselSlides: function(e, carouselId){
            Brick.Page.reload(NS.URL.editor.slides(carouselId));
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget,list,row,btnon,btnoff'
            }
        }
    });

};
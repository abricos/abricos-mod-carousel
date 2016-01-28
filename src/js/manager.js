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
        carouselEnable: function(carouselid){
            this.set('waiting', true);
            this.get('appInstance').carouselEnable(carouselid, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        carouselDisable: function(carouselid){
            this.set('waiting', true);
            this.get('appInstance').carouselDisable(carouselid, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        carouselDeleteShow: function(carouselid, hide){
            var tp = this.template,
                elDShow = Y.one(document.getElementById(tp.gelid('row.delete') + '-' + carouselid)),
                elDelete = Y.one(document.getElementById(tp.gelid('row.deletegroup') + '-' + carouselid));
            if (hide){
                elDShow.show();
                elDelete.hide();
            } else {
                elDShow.hide();
                elDelete.show();
            }
        },
        carouselDelete: function(carouselid){
            this.set('waiting', true);
            this.get('appInstance').carouselDelete(carouselid, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        onClick: function(e){
            if (e.dataClick === 'carousel-create'){
                this.fire('carouselCreate');
                return true;
            }
            var carouselid = e.target.getData('id') | 0;
            if (carouselid === 0){
                return;
            }

            switch (e.dataClick) {
                case 'carousel-edit':
                    this.fire('carouselEdit', carouselid);
                    return true;
                case 'carousel-slides':
                    this.fire('carouselSlides', carouselid);
                    return true;
                case 'carousel-enable':
                    this.carouselEnable(carouselid);
                    return true;
                case 'carousel-disable':
                    this.carouselDisable(carouselid);
                    return true;
                case 'carousel-delete-show':
                    this.carouselDeleteShow(carouselid);
                    return true;
                case 'carousel-delete-cancel':
                    this.carouselDeleteShow(carouselid, true);
                    return true;
                case 'carousel-delete':
                    this.carouselDelete(carouselid);
                    return true;
            }
        },
        _defCarouselCreate: function(){
            this.go('editor.create');
        },
        _defCarouselEdit: function(e, carouselid){
            this.go('editor.edit', carouselid);
        },
        _defCarouselSlides: function(e, carouselid){
            this.go('editor.slides', carouselid);
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
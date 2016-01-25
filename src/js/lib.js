var Component = new Brick.Component();
Component.requires = {
    yui: ['base'],
    mod: [
        {name: 'sys', files: ['application.js']},
        {name: '{C#MODNAME}', files: ['model.js']}
    ]
};
Component.entryPoint = function(NS){

    NS.roles = new Brick.AppRoles('{C#MODNAME}', {
        isAdmin: 50,
        isWrite: 30,
        isView: 10
    });

    var Y = Brick.YUI,
        COMPONENT = this,
        SYS = Brick.mod.sys;


    SYS.Application.build(COMPONENT, {}, {
        initializer: function(){
            NS.roles.load(function(){
                this.carouselList(function(){
                    this.initCallbackFire();
                }, this);
            }, this);
        }
    }, [], {
        ATTRS: {
            isLoadAppStructure: {value: true},
            Carousel: {value: NS.Carousel},
            CarouselList: {value: NS.CarouselList},
            Slide: {value: NS.Slide},
            SlideList: {value: NS.SlideList},
        },
        REQS: {
            carouselList: {
                attribute: true,
                type: 'modelList:CarouselList'
            }
        },
        URLS: {
            ws: "#app={C#MODNAMEURI}/wspace/ws/",
            manager: {
                view: function(){
                    return this.getURL('ws') + 'manager/ManagerWidget/'
                }
            },
            editor: {
                create: function(){
                    return this.getURL('ws') + 'editor/EditorWidget/'
                },
                edit: function(carouselid){
                    return this.getURL('ws') + 'editor/EditorWidget/' + carouselid + '/'
                },
                slides: function(carouselid){
                    return this.getURL('ws') + 'slides/SlidesWidget/' + carouselid + '/'
                }
            }
        }
    });

    return; ///////// TODO: remove old functions

    AppBase.prototype = {
        initializer: function(){
            this.cacheClear();
            this.carouselListLoad(function(err){
                this.get('initCallback')(err, this);
            }, this);
        },
        cacheClear: function(){
            this._cacheSlideList = {};
        },
        onAJAXError: function(err){
            Brick.mod.widget.notice.show(err.msg);
        },
        _treatAJAXResult: function(data){
            data = data || {};
            var ret = {};
            if (data.carousels){
                var carouselListClass = this.get('carouselListClass');
                ret.carouselList = new carouselListClass({
                    items: data.carousels.list
                });
            }
            if (data.slides){
                var slideListClass = this.get('slideListClass');
                ret.slideList = new slideListClass({
                    carouselid: data.slides.carouselid,
                    items: data.slides.list
                });
                this._cacheSlideList[data.slides.carouselid] = ret.slideList;
            }
            return ret;
        },
        carouselListLoad: function(callback, context){
            this.ajax({
                'do': 'carousellist'
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        _onCarouselListLoad: function(err, res, details){
            var tRes = this._treatAJAXResult(res.data);

            if (tRes.carouselList){
                this.set('carouselList', tRes.carouselList);
            }

            details.callback.apply(details.context, [err, tRes.carouselList]);
        },
        carouselSave: function(carousel, callback, context){
            this.ajax({
                'do': 'carouselsave',
                'savedata': carousel.toJSON()
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        carouselDisable: function(carouselid, callback, context){
            this.ajax({
                'do': 'carouseldisable',
                'carouselid': carouselid
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        carouselEnable: function(carouselid, callback, context){
            this.ajax({
                'do': 'carouselenable',
                'carouselid': carouselid
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        carouselDelete: function(carouselid, callback, context){
            this.ajax({
                'do': 'carouseldelete',
                'carouselid': carouselid
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        slideListLoad: function(carouselid, callback, context){
            var cacheSlideList = this._cacheSlideList[carouselid];

            if (cacheSlideList){
                callback.apply(context, [null, cacheSlideList]);
                return;
            }

            this.ajax({
                'do': 'slidelist',
                'carouselid': carouselid
            }, this._onSlideListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        _onSlideListLoad: function(err, res, details){
            var tRes = this._treatAJAXResult(res.data);
            details.callback.apply(details.context, [err, tRes.slideList]);
        },
        slideSave: function(carouselid, slide, callback, context){
            this.ajax({
                'do': 'slidesave',
                'carouselid': carouselid,
                'savedata': slide.toJSON()
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        slideDelete: function(carouselid, slideid, callback, context){
            this.ajax({
                'do': 'slidedelete',
                'carouselid': carouselid,
                'slideid': slideid
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        }
    };
    NS.AppBase = AppBase;


};
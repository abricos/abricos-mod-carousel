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
                edit: function(carouselId){
                    return this.getURL('ws') + 'editor/EditorWidget/' + carouselId + '/'
                },
                slides: function(carouselId){
                    return this.getURL('ws') + 'slides/SlidesWidget/' + carouselId + '/'
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
                    carouselId: data.slides.carouselid,
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
        carouselDisable: function(carouselId, callback, context){
            this.ajax({
                'do': 'carouseldisable',
                'carouselid': carouselId
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        carouselEnable: function(carouselId, callback, context){
            this.ajax({
                'do': 'carouselenable',
                'carouselid': carouselId
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        carouselDelete: function(carouselId, callback, context){
            this.ajax({
                'do': 'carouseldelete',
                'carouselid': carouselId
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        slideListLoad: function(carouselId, callback, context){
            var cacheSlideList = this._cacheSlideList[carouselId];

            if (cacheSlideList){
                callback.apply(context, [null, cacheSlideList]);
                return;
            }

            this.ajax({
                'do': 'slidelist',
                'carouselid': carouselId
            }, this._onSlideListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        _onSlideListLoad: function(err, res, details){
            var tRes = this._treatAJAXResult(res.data);
            details.callback.apply(details.context, [err, tRes.slideList]);
        },
        slideSave: function(carouselId, slide, callback, context){
            this.ajax({
                'do': 'slidesave',
                'carouselid': carouselId,
                'savedata': slide.toJSON()
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        slideDelete: function(carouselId, slideId, callback, context){
            this.ajax({
                'do': 'slidedelete',
                'carouselid': carouselId,
                'slideid': slideId
            }, this._onCarouselListLoad, {
                arguments: {callback: callback, context: context}
            });
        }
    };
    NS.AppBase = AppBase;


};
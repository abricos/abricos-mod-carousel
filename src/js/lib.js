/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.requires = {
    yui: ['base'],
    mod: [
        {name: 'sys', files: ['application.js', 'widget.js', 'form.js']},
        {name: 'widget', files: ['notice.js']},
        {name: '{C#MODNAME}', files: ['roles.js', 'model.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,

        WAITING = 'waiting',
        BOUNDING_BOX = 'boundingBox',

        COMPONENT = this,

        SYS = Brick.mod.sys;

    NS.URL = {
        ws: "#app={C#MODNAMEURI}/wspace/ws/",
        manager: {
            view: function(){
                return NS.URL.ws + 'manager/ManagerWidget/'
            }
        },
        editor: {
            create: function(){
                return NS.URL.ws + 'editor/EditorWidget/'
            },
            edit: function(couruselId){
                return NS.URL.ws + 'editor/EditorWidget/' + couruselId + '/'
            },
            slides: function(couruselId){
                return NS.URL.ws + 'slides/SlidesWidget/' + couruselId + '/'
            }
        }
    };

    NS.AppWidget = Y.Base.create('appWidget', Y.Widget, [
        SYS.Language,
        SYS.Template,
        SYS.WidgetClick,
        SYS.WidgetWaiting
    ], {
        initializer: function(){
            this._appWidgetArguments = Y.Array(arguments);

            Y.after(this._syncUIAppWidget, this, 'syncUI');
        },
        _syncUIAppWidget: function(){
            var args = this._appWidgetArguments,
                tData = {};

            if (Y.Lang.isFunction(this.buildTData)){
                tData = this.buildTData.apply(this, args);
            }

            var bBox = this.get(BOUNDING_BOX),
                defTName = this.template.cfg.defTName;

            bBox.setHTML(this.template.replace(defTName, tData));

            this.set(WAITING, true);

            var instance = this;
            NS.initApp({
                initCallback: function(err, appInstance){
                    instance._initAppWidget(err, appInstance);
                }
            });
        },
        _initAppWidget: function(err, appInstance){
            this.set('appInstance', appInstance);
            this.set(WAITING, false);
            var args = this._appWidgetArguments
            this.onInitAppWidget.apply(this, [err, appInstance, {
                arguments: args
            }]);
        },
        onInitAppWidget: function(){
        }
    }, {
        ATTRS: {
            render: {
                value: true
            },
            appInstance: {
                values: null
            }
        }
    });

    var AppBase = function(){
    };
    AppBase.ATTRS = {
        couruselListClass: {
            value: NS.CouruselList
        },
        couruselList: {
            value: null
        },
        slideListClass: {
            value: NS.SlideList
        },
        initCallback: {
            value: function(){
            }
        }
    };
    AppBase.prototype = {
        initializer: function(){
            this.cacheClear();
            this.couruselListLoad(function(err){
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
            if (data.courusels){
                var couruselListClass = this.get('couruselListClass');
                ret.couruselList = new couruselListClass({
                    items: data.courusels.list
                });
            }
            if (data.slides){
                var slideListClass = this.get('slideListClass');
                ret.slideList = new slideListClass({
                    couruselId: data.slides.couruselid,
                    items: data.slides.list
                });
                this._cacheSlideList[data.slides.couruselid] = ret.slideList;
            }
            return ret;
        },
        couruselListLoad: function(callback, context){
            this.ajax({
                'do': 'courusellist'
            }, this._onCouruselListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        _onCouruselListLoad: function(err, res, details){
            var tRes = this._treatAJAXResult(res.data);

            if (tRes.couruselList){
                this.set('couruselList', tRes.couruselList);
            }

            details.callback.apply(details.context, [err, tRes.couruselList]);
        },
        couruselSave: function(courusel, callback, context){
            this.ajax({
                'do': 'couruselsave',
                'savedata': courusel.toJSON()
            }, this._onCouruselListLoad, {
                arguments: {callback: callback, context: context }
            });
        },
        slideListLoad: function(couruselId, callback, context){
            var cacheSlideList = this._cacheSlideList[couruselId];

            if (cacheSlideList){
                callback.apply(context, [null, cacheSlideList]);
                return;
            }

            this.ajax({
                'do': 'slidelist',
                'couruselid': couruselId
            }, this._onSlideListLoad, {
                arguments: {callback: callback, context: context}
            });
        },
        _onSlideListLoad: function(err, res, details){
            var tRes = this._treatAJAXResult(res.data);
            details.callback.apply(details.context, [err, tRes.slideList]);
        },
        slideSave: function(couruselId, slide, callback, context){
            this.ajax({
                'do': 'slidesave',
                'couruselid': couruselId,
                'savedata': slide.toJSON()
            }, this._onCouruselListLoad, {
                arguments: {callback: callback, context: context }
            });
        }
    };
    NS.AppBase = AppBase;

    var App = Y.Base.create('couruselApp', Y.Base, [
        SYS.AJAX,
        SYS.Language,
        NS.AppBase
    ], {
        initializer: function(){
            NS.appInstance = this;
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            initCallback: {
                value: null
            },
            moduleName: {
                value: '{C#MODNAME}'
            }
        }
    });
    NS.App = App;

    NS.appInstance = null;
    NS.initApp = function(options){
        options = Y.merge({
            initCallback: function(){
            }
        }, options || {});

        if (NS.appInstance){
            return options.initCallback(null, NS.appInstance);
        }
        new NS.App(options);
    };

}
;
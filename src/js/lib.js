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
                return NS.URL.ws + 'editor/EditorWidget/'+couruselId+'/'
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
        initCallback: {
            value: function(){
            }
        }
    };
    AppBase.prototype = {
        initializer: function(){
            this.couruselListLoad(function(err){
                this.get('initCallback')(err, this);
            }, this);
        },
        onAJAXError: function(err){
            Brick.mod.widget.notice.show(err.msg);
        },
        _treatAJAXResult: function(data){
            data = data || {};
            var ret = {};
            if (data.courusels){
                var CouruselList = this.get('couruselListClass');
                ret.couruselList = new CouruselList({
                    items: data.courusels.list
                });
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
            }, this._ouCouruselSave, {
                arguments: {callback: callback, context: context }
            });
        },
        _ouCouruselSave: function(err, res, details){
            var callback = details.callback,
                context = details.context;

            if (!err){
                var errorCode = res.data.err || 0;
                if (errorCode > 0){
                    var phId = 'ajax.courusel.error.' + errorCode;

                    err = {
                        code: errorCode,
                        msg: this.language.get(phId)
                    };
                }
            }

            if (callback){
                if (err){
                    callback.apply(context, [err]);
                } else {
                    callback.apply(context, [null, res.data]);
                }
            }
        }
    };
    NS.AppBase = AppBase;

    var App = Y.Base.create('couruselApp', Y.Base, [
        SYS.AJAX,
        SYS.Language,
        NS.AppBase
    ], {
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
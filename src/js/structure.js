/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.requires = {
    yui: ['model', 'model-list']
    /*,

    mod: [
        {name: 'sys', files: ['structure.js']}
    ]
    /**/
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,
        SYS = Brick.mod.sys;

    NS.Courusel = Y.Base.create('courusel', Y.Model, [ ], {
    }, {
        ATTRS: {
            name: {
                value: ''
            },
            width: {
                value: 0
            },
            height: {
                value: 0
            }
        }
    });

    NS.CouruselList = Y.Base.create('couruselList', Y.ModelList, [], {
        model: NS.Courusel
    });

    /*
    var Slide = function(){
        Slide.superclass.constructor.apply(this, arguments);
    };
    Slide.NAME = 'slide';
    Slide.ATTRS = {
        id: {
            value: 0
        },
        title: {
            value: ''
        },
        url: {
            value: ''
        },
        ord: {
            value: 0
        },
        filehash: {
            value: ''
        }
    };
    Y.extend(Slide, SYS.Structure);
    NS.Slide = Slide;
    /**/

};

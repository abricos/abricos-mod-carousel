/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.requires = {
    mod: [
        {name: 'sys', files: ['structure.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,
        SYS = Brick.mod.sys;

    var Courusel = function(){
        Courusel.superclass.constructor.apply(this, arguments);
    };
    Courusel.NAME = 'courusel';
    Courusel.ATTRS = {
        id: {
            value: 0
        },
        name: {
            value: 'test'
        },
        width: {
            value: 0
        },
        height: {
            value: 0
        }
    };
    Y.extend(Courusel, SYS.Structure);
    NS.Courusel = Courusel;

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

};
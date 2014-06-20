/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.requires = {
    yui: ['model', 'model-list']
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
            },
            off: {
                value: false
            }
        }
    });

    NS.CouruselList = Y.Base.create('couruselList', Y.ModelList, [], {
        model: NS.Courusel
    });

    NS.Slide = Y.Base.create('slide', Y.Model, [ ], {
    }, {
        ATTRS: {
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
                value: null
            }
        }
    });

    NS.SlideList = Y.Base.create('slideList', Y.ModelList, [], {
        model: NS.Slide
    });

};

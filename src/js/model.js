/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.requires = {
    yui: ['model', 'model-list']
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI;

    NS.Carousel = Y.Base.create('carousel', Y.Model, [], {}, {
        ATTRS: {
            name: {value: ''},
            width: {value: 0},
            height: {value: 0},
            isCustomTemplate: {value: false},
            customTemplate: {value: ''},
            off: {value: false}
        }
    });

    NS.CarouselList = Y.Base.create('carouselList', Y.ModelList, [], {
        model: NS.Carousel
    });

    NS.Slide = Y.Base.create('slide', Y.Model, [], {}, {
        ATTRS: {
            id: {value: 0},
            title: {value: ''},
            url: {value: ''},
            code: {value: ''},
            ord: {value: 0},
            filehash: {value: null}
        }
    });

    NS.SlideList = Y.Base.create('slideList', Y.ModelList, [], {
        model: NS.Slide
    });

};

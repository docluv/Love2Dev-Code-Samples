( function ( window, document, undefined ) {

    "use strict";



    var wysiwyg = function ( selector, options ) {

        var self = new wysiwyg.fn.init(),
            wrapper, i;

        if ( !selector ) {

            self.length = 0;
            return self;

        }

        if ( typeof selector === "string" ) {

            if ( context && context.nodeType ) {
                wrapper = context.querySelector( selector );
            } else {
                wrapper = document.querySelector( selector );
            }


        } else if ( selector.nodeType ) {

            wrapper = selector;

        }

        return self;

    };

    wysiwyg.fn = wysiwyg.prototype = {

        constructor: wysiwyg,

        init: function () {

            return this;
        },

        version: "0.0.1",

        context: undefined,

        toolbar: {}

    };

    // Give the init function the wysiwyg prototype for later instantiation
    wysiwyg.fn.init.prototype = wysiwyg.fn;

    return ( window.wysiwyg = wysiwyg );


} )( window, document );
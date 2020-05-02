( function ( window, document, undefined ) {

    "use strict";

    var wysiwyg = function ( selector, options ) {

        return new wysiwyg.fn.init( selector, options );

    };

    wysiwyg.fn = wysiwyg.prototype = {

        constructor: wysiwyg,

        init: function ( selector, options ) {

            var wrapper, i;

            if ( !selector ) {

                this.length = 0;
                return this;

            }

            if ( typeof selector === "string" ) {

                wrapper = document.querySelector( selector );

            } else if ( selector.nodeType ) {

                wrapper = selector;

            }

            this.toolbar = wrapper.querySelector( options.toolbar || ".editor-toolbar" );
            this.editor = wrapper.querySelector( options.editor || ".body-wyswyg-editor" );

            this.bindToolbar( this.toolbar );

            return this;
        },

        version: "0.0.1",

        context: undefined,

        toolbar: {},
        editor: {},

        bindToolbar: function () {

            var self = this,
                toolbarButtons = self.toolbar.querySelectorAll( ".btn-edit" );

            for ( var index = 0; index < toolbarButtons.length; index++ ) {

                toolbarButtons[ index ].addEventListener( "click", function ( e ) {

                    self.handleToolbarButton.call( self, e );

                } );

            }

        },

        handleToolbarButton: function ( e ) {

            e.preventDefault();

            var command = e.currentTarget.getAttribute( "data-edit" );

            console.log( command );

            //            this.editor.focus();

            var sel = window.getSelection();

            console.log( sel );

            // if ( !selectionInside( this.editor, true ) ) { // returns 'selection inside editor'
            //     return false;
            // }

            //            document.execCommand( command, false );

            return false;
        }

    };

    function selectionInside( containerNode, force ) {
        // selection inside editor?
        var sel = window.getSelection();

        // force selection to editor
        var range = document.createRange();
        range.selectNodeContents( containerNode );
        range.collapse( false );
        sel.removeAllRanges();
        sel.addRange( range );
        return true;
    }

    // Give the init function the wysiwyg prototype for later instantiation
    wysiwyg.fn.init.prototype = wysiwyg.fn;

    return ( window.wysiwyg = wysiwyg );


} )( window, document );
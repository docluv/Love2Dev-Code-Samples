( function ( window, undefined ) {

    "use strict";

    var $ = love2dev.component,
        chip_defaults = {
            data: [],
            placeholder: "",
            secondaryPlaceholder: "",
            autocompleteOptions: {}
        },
        SELS = {
            CHIPS: '.chips',
            CHIP: '.chip',
            INPUT: 'input',
            DELETE: '.material-icons',
            SELECTED_CHIP: '.selected',
        };

    function closeChip( evt ) {

        evt.stopPropagation();

        evt.target.closest( ".chip" ).remove();

    }

    var chips = function ( target, customSettings ) {

        var self = new chips.fn.init();

        self.targets = document.querySelectorAll( target );

        self.settings = Object.assign( {}, chip_defaults, customSettings );

        self.hasAutocomplete = !$.isEmptyObject( self.settings.autocompleteOptions.data );

        for ( var index = 0; index < self.targets.length; index++ ) {

            var $chips = self.targets[ index ];

            var chipId = $.generateUUID();

            if ( !self.settings.data || !( self.settings.data instanceof Array ) ) {
                self.settings.data = [];
            }

            $.data( $chips, "chips", JSON.stringify( self.settings.data ) );

            $chips.setAttribute( "data-index", i );
            $chips.setAttribute( "data-initialized", true );

            if ( !$chips.classList.contains( "chips" ) ) {
                $chips.classList.add( "chips" );
            }

            self.createChips( $chips, chipId );

        }

        return self;
    };

    chips.fn = chips.prototype = {

        constructor: chips,

        init: function () {

            return this;
        },

        version: "0.0.2",

        chips: undefined,
        hasAutocomplete: undefined,
        settings: undefined,
        targets: undefined,

        createChips: function ( $chips, chipId ) {

            $chips.innerHTML = "";

            var _chips = $.data( $chips, "chips" );

            _chips = JSON.parse( _chips );

            _chips.forEach( function ( elem ) {
                $chips.append( self.renderChip( elem ) );
            } );

            var chipInput = document.createElement( "input" );

            chipInput.id = chipId;
            chipInput.classList.add( "form-control" );
            chipInput.placeholder = "";

            $chips.append( chipInput );

            self.setPlaceholder( $chips );

            //configure autocomplete
            self.configureAutoComplete( $chips, chipId );

        },

        renderChip: function ( elem ) {},

        setPlaceholder: function ( $chips ) {

            var self = this,
                chipsData = $.data( $chips, "chips" );

            if ( ( chipsData !== undefined &&
                    !chipsData.length ) &&
                self.options.placeholder ) {

                $chips.querySelector( "input" )
                    .prop( "placeholder", self.options.placeholder );

            } else if ( ( chipsData === undefined || !!chipsData.length ) &&
                self.options.secondaryPlaceholder ) {

                $chips.find( "input" ).prop( "placeholder",
                    self.options.secondaryPlaceholder );

            }

        },

        isValid: function () {},

        addChip: function () {},

        deleteChip: function () {},

        selectChip: function () {},

        configureAutoComplete: function ( $chips, chipId ) {

            var self = this;

            if ( self.hasAutocomplete ) {

                var input = document.getElementById( chipId );

                self.settings.autocompleteOptions.onAutocomplete = function ( val ) {

                    self.addChip( {
                        tag: val
                    }, $chips );

                    input.value = "";
                    input.focus();

                };

            }

        }

    };

    // Give the init function the chips prototype for later instantiation
    chips.fn.init.prototype = chips.fn;

    return ( window.chips = chips );

}( window ) );
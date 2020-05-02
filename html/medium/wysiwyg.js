( function ( window, document, undefined ) {

    "use strict";

    var editor = document.querySelector( ".body-wyswyg-editor" ),
        toolbarButtons = document.querySelectorAll( ".btn-edit" ),
        actionButtons = document.querySelectorAll( ".btn-action" ),
        $newURL = document.querySelector( "[name=new-url" ),
        $btnInsertLink = document.querySelector( ".btn-insert-link" );

    var show = "show";

    function bindToolbar() {

        for ( var index = 0; index < toolbarButtons.length; index++ ) {

            toolbarButtons[ index ].addEventListener( "mousedown",
                handleToolbarButton );

        }

        for ( index = 0; index < actionButtons.length; index++ ) {

            actionButtons[ index ].addEventListener( "mousedown",
                handleActionButton );

        }

        document.querySelector( ".btn-cancel-link" ).addEventListener( "click", toggleAnchorModal );
        $btnInsertLink.addEventListener( "click", insertLink );

    }

    function handleToolbarButton( e ) {

        e.preventDefault();

        var command = e.currentTarget.getAttribute( "data-edit" );

        editor.focus();
        medium.invokeElement( command, {} );

        return false;

    }

    function handleActionButton( e ) {

        e.preventDefault();

        var command = e.currentTarget.getAttribute( "data-edit" );

        console.log( command );

        editor.focus();
        //        medium.invokeElement( command, {} );

        switch ( command ) {
            case "addlink":

                showAnchorModal();

                break;

            case "unlink":

                break;

            case "addPhoto":

                insertPhoto();

                break;

            case "undo":

                medium.undo();

                break;
            case "redo":

                medium.redo();

                break;

            case "code":

                toggleCodeView();

                break;

            case "insertunorderedlist":

                insertUnorderedList();

                break;

            case "insertorderedlist":

                insertOrderedList();

                break;

            default:
                break;
        }

        return false;

    }

    var selObj;

    function insertUnorderedList() {

        var ul = document.createElement( "ul" ),
            li = document.createElement( "li" );

        ul.className = "ul-special";
        ul.appendChild( li );

        li.innerHTML = "Enter Test here";
        li.className = "li-special";

        medium.focus();
        medium.insertHtml( ul );
    }

    function insertOrderedList() {

        var ul = document.createElement( "ol" ),
            li = document.createElement( "li" );

        ul.className = "ol-special";
        ul.appendChild( li );

        li.innerHTML = "Enter Test here";
        li.className = "li-special";

        medium.focus();
        medium.insertHtml( ul );
    }


    function toggleCodeView() {

        // var isEditable = editor.getAttribute( "contenteditable" );

        // if ( isEditable === "true" ) {
        //     editor.setAttribute( "contenteditable", "false" );
        // } else {
        //     editor.setAttribute( "contenteditable", "true" );
        // }

    }

    function showAnchorModal() {

        $newURL.value = "";

        saveSelection();

        toggleAnchorModal();

        $newURL.focus();

    }

    function insertPhoto( e ) {

        return fetch( "html/medium/example-figure.html" )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.text();

                }

            } )
            .then( function ( html ) {

                medium.focus();
                medium.insertHtml( html );

                return false;

            } );

    }

    function toggleModalBackground() {

        document.querySelector( ".modal-bg" ).classList.toggle( show );

    }

    function toggleAnchorModal() {

        toggleModalBackground();
        document.querySelector( ".modal-add-anchor" ).classList.toggle( show );

    }

    function insertLink( e ) {

        e.preventDefault();

        var anchor = document.createElement( "a" );

        medium.focus();

        restoreSelection();

        medium.invokeElement( "a", {
            href: $newURL.value,
            target: "_blank",
            rel: "noopener",
            class: "love2dev-a"
        } );

        toggleAnchorModal();

        return false;

    }

    function validateLink( e ) {

        $btnInsertLink.disabled = !$newURL.validity.valid;

    }

    function bindEvents() {

        bindToolbar();

        $newURL.addEventListener( "keyup", validateLink );

    }

    function saveSelection() {

        selObj = medium.selection.saveSelection();

    }

    function restoreSelection() {

        medium.selection.restoreSelection( selObj );

    }

    var medium = new Medium( {
        element: editor,
        mode: Medium.richMode,
        attributes: null,
        tags: {
            break: "",
            paragraph: "p"
        },
        pasteAsText: true,
        drag: true,
        autofocus: true,
        keyContext: {
            "enter": function ( e, element ) {
                var sib = element.previousSibling;

                if ( sib && sib.tagName == "LI" ) {
                    element.style.color = sib.style.color;
                    element.className = sib.className;
                    this.cursor.caretToBeginning( element );
                }
            }
        },
        cssClasses: {
            editor: "love2dev"
        }
    } );

    bindEvents();

} )( window, document );
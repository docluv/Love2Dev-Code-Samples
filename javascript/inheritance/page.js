( function () {

    "use strict";

    var auth,
        hidden = "hidden";

    window.app.page = {

        init: function ( config ) {

            config = config || {};

            config.redirectUri = config.redirectUri || location.pathname;

            auth = new app.api.auth( config );

        },

        toggleHidden: function ( show, hide ) {

            hide.classList.add( hidden );
            show.classList.remove( hidden );

        },

        fetchAndRenderTemplate: function ( src, data ) {

            var self = this;

            return self.fetchTemplate( {
                    src: src
                } )
                .then( function ( template ) {

                    return self.renderTemplate( template, data );

                } );

        },

        renderTemplate: function ( html, data ) {

            return Mustache.render( html, data );

        },

        fetchTemplate: function ( options ) {

            return fetch( options.src )
                .then( function ( response ) {

                    return response.text();

                } );

        },

        //not really useful in the age of service workers
        //fetches the template and appends it to the body as a template script element
        fetchTemplateScript: function ( options ) {

            var self = this;

            return new Promise( function ( resolve, reject ) {

                var template = document.getElementById( options.id );

                if ( template ) {

                    return;

                } else {

                    return self.fetchTemplate( options )
                        .then( function ( html ) {

                            var script = document.createElement( 'script' );

                            script.async = false;
                            script.id = options.id;
                            script.type = "x-template";
                            script.innerHTML = html;

                            document.body.appendChild( script );

                            resolve();

                        } );

                }

            } );

        },

        renderData: function ( options ) {

            return new Promise( function ( resolve, reject ) {

                var _template = _d.qs( options.template ),
                    target = _d.qs( options.target );

                if ( _template && target ) {

                    target.innerHTML = Mustache.render( _template.innerHTML, options.data );

                    resolve();

                }

            } );

        },

        //not useful in this applicationb
        renderPage: function () {

            var hiddenEles = _d.qsa( ".wrapper.hide, .page-footer" );

            this.renderUserData();

            hiddenEles.forEach( function ( ele ) {

                ele.classList.remove( "hide" );

            } );

        },

        //refactor to component
        renderUserData: function () {

            auth.getAuthToken()
                .then( function ( claims ) {

                    var userName = _d.qs( ".user-role" );

                    userName.innerText = claims.UserFullName;

                } );

        },

        //serialize a web form
        //should use FormData instead
        //API must be able to deserialize formData
        //Only useful when API only supports JSON objects
        serialize: function ( selector ) {

            var self = this,
                form = _d.qs( selector || self.config.form ),
                i, j, q = {};

            if ( !form || form.nodeName !== "FORM" ) {
                return;
            }

            for ( i = 0; i < form.elements.length; i++ ) {

                if ( form.elements[ i ].name === "" ) {
                    continue;
                }

                switch ( form.elements[ i ].nodeName ) {
                    case 'INPUT':
                        switch ( form.elements[ i ].type ) {
                            case 'text':
                            case 'hidden':
                            case 'password':
                            case 'button':
                            case 'reset':
                            case 'submit':
                            case 'tel':
                            case 'email':
                            case 'date':
                            case 'datetime':
                            case 'range':
                            case 'number':
                            case 'url':
                            case 'search':
                                q[ form.elements[ i ].name ] = form.elements[ i ].value;
                                break;
                            case 'checkbox':
                            case 'radio':
                                if ( form.elements[ i ].checked ) {
                                    q[ form.elements[ i ].name ] = form.elements[ i ].value;
                                }
                                break;
                        }
                        break;
                    case 'file':
                        break;
                    case 'TEXTAREA':
                        q[ form.elements[ i ].name ] = form.elements[ i ].value;
                        break;
                    case 'SELECT':
                        switch ( form.elements[ i ].type ) {
                            case 'select-one':
                                q[ form.elements[ i ].name ] = form.elements[ i ].value;
                                break;
                            case 'select-multiple':
                                for ( j = form.elements[ i ].options.length - 1; j >= 0; j = j - 1 ) {
                                    if ( form.elements[ i ].options[ j ].selected ) {
                                        q[ form.elements[ i ].name ] = encodeURIComponent( form.elements[ i ].options[ j ].value );
                                    }
                                }
                                break;
                        }
                        break;
                        // case 'BUTTON':
                        //     switch (form.elements[i].type) {
                        //         case 'reset':
                        //         case 'submit':
                        //         case 'button':
                        //             q[form.elements[i].name] = form.elements[i].value;
                        //             break;
                        //     }
                        //     break;
                }
            }

            return q;

        },

        //requires authentication object
        //should be part of component that needs to manage authentication UI
        isAuthenticated: function () {

            var page = this;

            //assume authenticated for initial development
            return new Promise().resolve( true );

            // return auth.isAuthenticated()
            //     .then( function ( token ) {

            //         if ( !token ) {
            //             page.openLogin();
            //         }

            //         page.token = token;
            //         page.showLogout();

            //         return !!token;

            //     } ).catch( function ( err ) {

            //         page.openLogin();

            //     } );

        },

        //move to app shell/header/login component
        logout: function () {

            return auth.removeUserDetail().then( function () {
                auth.removeToken().then( page.openLogin );
            } );

        },

        openLogin: function () {

            //redirect to last login
            location.replace( "/login/?redirectUri=" + config.redirectUri );

        },

        showLogout: function () {

            var page = this,
                logoutBtn = _d.qsa( ".btn-logout" );

            if ( logoutBtn ) {

                logoutBtn.forEach( function ( btn ) {

                    btn.classList.remove( "hide" );

                    btn.addEventListener( "click", function ( evt ) {

                        evt.preventDefault();

                        page.logout();

                        return false;

                    } );

                } );

            }

        },

        token: undefined

    };

}() );
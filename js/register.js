    function registerServiceWorker() {

        if ( "serviceWorker" in navigator ) {

            navigator.serviceWorker.register( "/sw.js" )
                .then( function ( registration ) { // Registration was successful

                    console.log( "ServiceWorker registration successful with scope: ", registration.scope );

                } ).catch( function ( err ) { // registration failed :(

                    console.log( "ServiceWorker registration failed: ", err );
                } );

        }

    }


    if ( document.readyState === "complete" ) {

        registerServiceWorker();

    } else {

        document.addEventListener( "readystatechange", function ( event ) {

            if ( event.target.readyState === "complete" ) {

                registerServiceWorker();

            }

        } );

    }
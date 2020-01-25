const version = "1.00",
    preCache = "PRECACHE-" + version,
    cacheList = [
        "offline.html"
    ];


self.addEventListener( "install", function ( event ) {

    event.waitUntil( updatePreCache() );

} );

self.addEventListener( "activate", function ( event ) {

    console.log( "activating service worker" );

} );

self.addEventListener( "fetch", function ( event ) {

    event.respondWith(

        handleRequest( event )

    );

} );

function updatePreCache() {

    return caches.open( preCache )
        .then( cache => {

            cacheList.forEach( url => {

                fetch( url )
                    .then( function ( response ) {
                        if ( !response.ok ) {
                            throw new TypeError( 'bad response status - ' + response.url );
                        }
                        return cache.put( url, response );
                    } )
                    .catch( err => {
                        console.error( err );
                    } );

            } );

        } )
        .then( () => {

            self.skipWaiting();
            console.log( "pre-cached assets complete" );
        } );

}

function handleRequest( event ) {

    if ( event.request.headers.get( "range" ) ) {

        console.log( event.request.headers.get( "range" ) );

        return handleRangeRequest( event );
    } else {
        return fetch( event.request )
            .catch( err => {

                return caches.match( "offline.html" )
                    .then( response => {

                        if ( response ) {

                            return response;
                        }

                    } );

            } );
    }

}


//https://philna.sh/blog/2018/10/23/service-workers-beware-safaris-range-request/
//https://googlechrome.github.io/samples/service-worker/prefetch-video/
function handleRangeRequest( event ) {

    console.log( event.request.url );

    return cacheFirstNetwork( event )
        .then( response => {

            if ( response ) {

                return response.arrayBuffer();
            }

            return response;

        } ).then( arrayBuffer => {

            const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
                event.request.headers.get( 'range' )
            );

            if ( bytes ) {

                const start = Number( bytes[ 1 ] );
                const end = Number( bytes[ 2 ] ) || arrayBuffer.byteLength - 1;

                return new Response( arrayBuffer.slice( start, end + 1 ), {
                    status: 206,
                    statusText: "Partial Content",
                    headers: [
                        [ "Content-Range", `bytes ${start}-${end}/${arrayBuffer.byteLength}` ]
                    ]
                } );

            } else {

                return new Response( null, {
                    status: 416,
                    statusText: "Range Not Satisfiable",
                    headers: [
                        [ "Content-Range", `*/${arrayBuffer.byteLength}` ]
                    ]
                } );

            }
        } );

}
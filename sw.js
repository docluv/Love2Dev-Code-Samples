importScripts( "js/libs/localforage.min.js" );

//remember to increment the version # when you update the service worker
const version = "1.00",
    preCache = "PRECACHE-" + version,
    doc_fallback = "offline.html",
    cacheList = [ doc_fallback ],
    dashboardDocs = [],
    image_fallback = "img/offline.png",
    dynamicCache = "DYNAMIC_CACHE" + version,
    noCache = [],
    DEFAULT_MAX_TIME = 10 * 60 * 1000, //10 minute for testing
    SINGLE_DAY = 24 * 60 * 60 * 1000, //1 day for testing
    NO_CACHE = /no-cache|no-store|must-revalidate/,
    mime_types = {
        "application/json": "json",
        "video/mp4": "blob",
        "image/jpg": "blob",
        "image/png": "blob",
        "image/gif": "blob",
        "application/octet-stream": "blob",
        "mp4": "video/mp4",
        "jpg": "image/jpg",
        "png": "image/png",
        "gif": "image/gif"
    },
    LAST_ASSET_CHECK = "last-asset-check",
    LAST_DYNAMIC_CHECK = "last-dynamic-check",
    LAST_PRECACHE_CHECK = "last-precache-check",
    UPDATE_DYNAMIC = "update-dynamic";

const success = [ "background: green", "color: white", "display: block", "text-align: center" ].join( ";" );

let requestLog = [];

localforage.setItem( "version", version );

/*
create a list (array) of urls to pre-cache for your application
*/

/*  Service Worker Event Handlers */

self.addEventListener( "install", function ( event ) {

    event.waitUntil( updatePreCache() );

} );

self.addEventListener( "activate", function ( event ) {

    event.waitUntil(

        //wholesale purge of previous version caches
        caches.keys()
        .then( cacheNames => {

            cacheNames.forEach( value => {

                if ( !value.includes( version ) ) {
                    caches.delete( value );
                }

            } );

            return;

        } )

    );

} );

self.addEventListener( "fetch", function ( event ) {

    event.respondWith(

        handleRequest( event )
        .catch( err => {
            //assume offline as everything else should be handled
            return caches.match( doc_fallback, {
                ignoreSearch: true
            } );

        } )

    );

} );

self.addEventListener( "message", event => {

    console.log( event );

    switch ( event.data.event ) {

        case UPDATE_DYNAMIC:

            cacheCoreAssets();

            break;

            //case UPDATE_DASHBOARD:

            //    updateDashboard();
            //    break;

            // case OFFLINE_MSG_KEY:

            //     toggleOffline( event.data.state );

            //     break;


        default:

            console.log( "unhandled event" );

            break;
    }

} );

function handleRequest( event ) {

    if ( event.request.method.toLowerCase() !== "get" ) {

        return fetch( event.request );

    } else {

        let isVideo = isVideoRequest( event.request.url );

        if ( event.request.headers.get( "range" ) ) {

            if ( isVideo ) {

                return fetchMediaAndCache( event.request.url )
                    .then( response => {

                        return handleRangeRequest( event.request, response );

                    } );

            } else {

                return cacheFirstNetwork( event )
                    .then( response => {

                        return handleRangeRequest( event.request, response );

                    } );

            }

        } else {

            if ( isVideo || isImageRequest( event.request.url ) ) {

                return fetchMediaAndCache( event.request.url );

            } else {

                //normal requests
                return handleNonMedia( event );

            }

        }

    }

}


function updatePreCache() {

    return updateCachedAssets( preCache );
    //.then(() => {

    //    return updateCachedAssets(dynamicCache);

    //});

}

function fetchHead( url, cache ) {

    return cache.match( url, {
            ignoreSearch: true
        } )
        .then( response => {

            if ( response ) {

                return fetch( url, {
                        method: "HEAD"
                    } )
                    .then( function ( response ) {

                        if ( !response.ok ) {
                            return false;
                        }

                        let lastModified = response.headers.get( "last-modified" );

                        if ( lastModified ) {

                            return cache.match( url, {
                                    ignoreSearch: true
                                } )
                                .then( cachedResponse => {

                                    if ( cachedResponse ) {

                                        let cachedModified = cachedResponse.headers.get( "last-modified" );

                                        if ( new Date( lastModified ) > new Date( cachedModified ) ) {

                                            return fetchAndCache( url, cache );

                                        }

                                    } else {

                                        return fetchAndCache( url, cache );

                                    }

                                } );

                        } else {
                            return fetchAndCache( url, cache );
                        }

                    } )
                    .catch( () => {
                        return false;
                    } );

            } else {
                return fetchAndCache( url, cache );
            }

        } );

}

let cacheUpdate = [];

function fetchAndCache( url, cache ) {

    return fetch( url )
        .then( function ( response ) {

            if ( [ 0, 200, 204 ].includes( response.status ) ) {

                cacheUpdate.push( url );

                return cache.put( url, response );

            } else {

                console.error( "bad response status - " + response.url );

            }

        } )
        .catch( err => {
            console.error( err );
        } );

}

function purgeDynamicCache() {

    return caches.open( dynamicCache )
        .then( cache => {

            let actions = [];

            for ( let i = 0; i < dashboardDocs.length; i++ ) {

                actions.push( cache.delete( dashboardDocs[ i ] ) );

            }

            return Promise.all( actions );

        } );

}

function replaceDynamicCachedAssets() {

    return caches.open( preCache )
        .then( cache => {

            let actions = [];

            for ( let i = 0; i < dashboardDocs.length; i++ ) {

                //change this to check the existing cache for any update needed
                actions.push( fetchHead( dashboardDocs[ i ], cache ) );
            }

            return Promise.all( actions )
                .catch( err => {
                    console.error( err );
                } );

        } );

}

function checkAssetTTL( key, ttl ) {

    return localforage.getItem( key )
        .then( lastCheck => {

            let dt = new Date( lastCheck || 0 ).getTime(),
                currentDT = new Date().getTime();

            if ( dt < ( currentDT - ttl ) ) {

                return localforage.setItem( key, currentDT )
                    .then( () => {

                        return true;

                    } );
            } else {
                return false;
            }

        } );

}

//periodically update this cache from network
function cacheCoreAssets() {

    return checkAssetTTL( LAST_DYNAMIC_CHECK, DEFAULT_MAX_TIME )
        //.then(shouldCheck => {

        //    if (shouldCheck) {

        //        return replaceDynamicCachedAssets();

        //    }

        //})
        .then( () => {
            periodicAssetUpdate();
        } );

}


function cacheResponse( request, response, cache_name ) {

    return caches.open( cache_name )
        .then( cache => {

            return cache.put( request, response );

        } );

}

function getSrcUrl( url ) {

    let _url = new URL( url );

    let srcUrl = _url.pathname;

    if ( srcUrl.charAt( 0 ) === "/" ) {
        srcUrl = srcUrl.substring( 1 );
    }

    return srcUrl;

}

function getFileExtension( pathname ) {

    let pathParts = pathname.split( "." );

    return ( pathParts.length > 1 ) ? pathParts[ 1 ] : "";

}

function fetchMediaAndCache( url ) {

    //check service worker cache first
    return caches.match( url, {
            ignoreSearch: true
        } )
        .then( response => {

            if ( response && [ 0, 200, 204 ].includes( response.status ) ) {
                return response;
            } else {
                //then fallback to IDB Cache
                return fetchAndCacheMediaIndexedDB( url );
            }

        } );

}

function fetchAndCacheMediaIndexedDB( url ) {

    return localforage.getItem( url )
        .then( blob => {

            if ( blob ) {

                return new Response( blob, {
                    headers: {
                        "Content-Type": mime_types[ getFileExtension( url ) ],
                        "Content-Length": blob.size
                    }
                } );

            } else {

                let _ret;

                return fetch( url, {
                        cache: "no-cache",
                        mode: "no-cors"
                    } )
                    .then( response => {

                        _ret = response.clone();

                        switch ( response.status ) {

                            case 0:

                                //can't cache opaque body
                                //either set CORS on source media or just deal with network
                                return response;

                            case 200:
                            case 204:

                                //store fetched media object in IDB
                                //helps with iOS quota issues
                                //note: if IDB > 50MB user is prompted to increase storage allowance
                                return response.blob()
                                    .then( data => {

                                        return localforage.setItem( url, data );

                                    } )
                                    .then( () => {

                                        return _ret;

                                    } );

                            default:

                                return caches.match( image_fallback );

                        }

                    } );

            }

        } );

}

function handleOffline( request ) {

    let url = "";

    if ( typeof request === "string" ) {
        url = url;
    } else {
        url = request.url;
    }

    //place handlers for different routes here
    //should have fallback responses for different routes and mime-types

    if ( ( /\.jpg|\.png|\.gif/i ).test( url ) ) {

        return caches.match( image_fallback );

    } else {
        return caches.match( doc_fallback );
    }

}

function isVideoRequest( url ) {

    return /\.mp4/.test( url );
}

function isImageRequest( url ) {

    return /\.png|\.jpg|\.jpeg|\.webp|\.gif/.test( url );
}


function daysDifferent( d1, d2 ) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt( ( t2 - t1 ) / ( 24 * 3600 * 1000 ) );
}

//https://philna.sh/blog/2018/10/23/service-workers-beware-safaris-range-request/
//https://googlechrome.github.io/samples/service-worker/prefetch-video/
function handleRangeRequest( request, response ) {

    if ( response ) {

        return response.arrayBuffer()
            .then( arrayBuffer => {

                const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
                    request.headers.get( "range" )
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

    return response;

}

function handleNonMedia( event ) {

    return cacheFirstNetwork( event );

}

function cacheFirstNetwork( event ) {

    return handleDocument( event.request )
        .then( response => {

            if ( response ) {

                return response;

            } else {

                return fetch( event.request )
                    .then( response => {
                        //too much complexity, refactor

                        if ( [ 200, 204 ].includes( response.status ) ) {

                            let ContentType = response.headers.get( "content-type" );

                            if ( isCacheable( event.request.url ) &&
                                event.request.method.toLowerCase() === "get" &&
                                ContentType &&
                                !ContentType.toLowerCase().includes( "application/json" )
                            ) {

                                if ( ContentType.toLowerCase().includes( "text/html" ) ) {

                                    //return processHTML(response);
                                    return response;

                                } else {

                                    return cacheResponse( event.request, response.clone(), dynamicCache )
                                        .then( () => {

                                            return response;

                                        } );

                                }

                            } else {
                                return response;
                            }

                        } else {

                            return response;

                        }

                    } );

            }

        } );

}

function isCacheable( url ) {

    let u = new URL( url );

    return !noCache.includes( u.pathname );

}

function networkCache( event ) {

    //if offline then return from cache
    //if within cache TTL then return from cache
    //if TTL expired fetch from network then cache
    //always update from network

}

function updateCachedAssets( cacheName ) {

    return caches.open( cacheName )
        .then( cache => {

            cacheList.forEach( url => {

                return fetchHead( url, cache );

            } );

        } )
        .then( () => {

            self.skipWaiting();

            console.log( "pre-cached assets complete. the following URLs were updated" );
            console.table( cacheUpdate, success );

        } );

}

function handleDocument( request ) {

    if ( request.destination === "document" ) {

        return fetch( request );
        //.then(processHTML);

    } else {

        return caches.match( request, {
            ignoreSearch: true
        } );
    }

}
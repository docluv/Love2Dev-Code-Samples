( function ( window, undefined ) {

    "use strict";

    window.lazyLoad = {

        showImage: function ( entries, observer ) {

            for ( var i = 0; i < entries.length; i++ ) {

                var io = entries[ i ];

                if ( io.isIntersecting && io.intersectionRatio > 0 ) {

                    var image = io.target,
                        src = image.getAttribute( "data-src" ),
                        srcSet = image.getAttribute( "data-srcset" );

                    if ( srcSet ) {

                        image.setAttribute( "srcset", srcSet );

                    }

                    if ( src ) {

                        image.setAttribute( "src", src );

                    }

                    // Stop watching and load the image
                    observer.unobserve( io.target );

                }

            }

        },

        animate: function ( entries, observer ) {

            for ( var index = 0; index < entries.length; index++ ) {

                var io = entries[ index ];

                if ( io.isIntersecting && io.intersectionRatio > 0 ) {

                    var ele = io.target,
                        src = ele.getAttribute( "animated" );

                    if ( src ) {

                        var ani = src.split( " " );

                        for ( var i = 0; i < ani.length; i++ ) {

                            ele.classList.add( ani[ i ] );

                        }

                    }

                    // Stop watching and load the image
                    observer.unobserve( io.target );

                }

            }

        },

        showMap: function ( entries, observer ) {

            for ( var i = 0; i < entries.length; i++ ) {

                var io = entries[ index ];

                if ( io.isIntersecting ) {

                    var map = io.target,
                        mapURL = map.getAttribute( "data-map-url" );

                    if ( mapURL ) {

                        if ( map.children.length === 0 ) {

                            var iFrame = document.createElement( "iframe" );

                            iFrame.setAttribute( "src", mapURL );
                            iFrame.classList.add( "embedded-map" );

                            map.appendChild( iFrame );

                        }

                    }

                    // Stop watching and load the image
                    observer.unobserve( io.target );

                }

            }

        },

        lazyDisplay: function () {

            var images = document.querySelectorAll( ".lazy-image" ),
                embeddedMaps = document.querySelectorAll( ".map-row" ),
                animated = document.querySelectorAll( ".lazy-animated" ),
                //                h2 = document.querySelectorAll( "h2" ),

                config = {
                    // If the image gets within 50px in the Y axis, start the download.
                    rootMargin: "50px 0px",
                    threshold: 0.1
                },

                // The observer for the images on the page
                i = 0,
                imgObserver = new IntersectionObserver( this.showImage, config ),
                mapObserver = new IntersectionObserver( this.showMap, config ),
                //     h2Observer = new IntersectionObserver( this.gaTrackingEvent, config ),
                animateObserver = new IntersectionObserver( this.animate, config );

            for ( i = 0; i < images.length; i++ ) {

                imgObserver.observe( images[ i ] );

            }

            for ( i = 0; i < embeddedMaps.length; i++ ) {

                mapObserver.observe( embeddedMaps[ i ] );

            }

            for ( i = 0; i < animated.length; i++ ) {

                animateObserver.observe( animated[ i ] );

            }


            // if ( gtag !== undefined ) {

            //     for ( i = 0; i < h2.length; i++ ) {

            //         h2Observer.observe( h2[ i ] );

            //     }

            // }

        },

        gaTrackingEvent: function ( entries, observer ) {

            for ( var index = 0; index < entries.length; index++ ) {

                var io = entries[ index ];

                if ( io.isIntersecting && io.intersectionRatio > 0 ) {

                    var ele = io.target;

                    gtag( "event", "view_item", {
                        "event_category": "engagement",
                        "event_label": ele.innerText
                    } );

                    // Stop watching and load the image
                    observer.unobserve( io.target );

                }

            }

        }

    };

}( window ) );
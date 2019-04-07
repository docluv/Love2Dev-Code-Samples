( function () {

    "use strict";

    // var navigation_Key = "user-navigation",
    //     profile, domain,
    //     $ = love2dev.component;

    function initialize() {

        lazyLoad.lazyDisplay();

    }


    if ( document.readyState === "interactive" || document.readyState === "complete" ) {

        initialize();

    } else {

        document.onreadystatechange = function () {

            if ( document.readyState === "complete" ) {

                initialize();

            }

        };

    }

} )();
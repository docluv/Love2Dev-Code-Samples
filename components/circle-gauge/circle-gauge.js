( function ( window, undefined ) {

    "use strict";

    var defaults = {
            width: 400,
            height: 400,
            value: 75,
            min: 0,
            max: 100,
            color: "#000",
            circles: {
                selectors: {
                    rightCSS: ".right-pie",
                    leftCSS: ".left-pie",
                    innerCircleCSS: ".inner-pie",
                    backPieCSS: ".back-pie",
                    containerCSS: ".pie-container",
                    gaugevalue: ".gauge-value"
                }
            }
        },
        settings = {},
        $right,
        $left,
        $innerCircle,
        $container,
        $backPie,
        $gaugevalue;

    function initialize( options ) {

        settings = Object.assign( {}, defaults, options );

        selectElements()
            .then( function () {

                initializeCircles();

            } );

    }

    function selectElements() {

        $container = document.querySelector( settings.circles.selectors.containerCSS );
        $right = $container.querySelector( settings.circles.selectors.rightCSS );
        $left = $container.querySelector( settings.circles.selectors.leftCSS );
        $innerCircle = $container.querySelector( settings.circles.selectors.innerCircleCSS );
        $backPie = $container.querySelector( settings.circles.selectors.backPieCSS );
        $gaugevalue = $container.querySelector( settings.circles.selectors.gaugevalue );
        return Promise.resolve();

    }

    function initializeCircles() {

        var percent = ( settings.value / ( settings.max - settings.min ) ) * 2,
            leftValue = 1,
            rightValue = percent;

        percent = percent.toFixed( 2 );

        $gaugevalue.innerText = ( percent * 50 ).toFixed( 2 ) + "%";

        if ( percent > 1 ) {
            leftValue = 1 - ( percent - 1 );
            rightValue = 1;
        }

        $right.style.backgroundColor = settings.color;
        $left.style.backgroundColor = settings.color;

        $right.style.width = settings.width + "px";
        $left.style.width = settings.width + "px";
        $backPie.style.width = settings.width + "px";
        $innerCircle.style.width = ( settings.width - 20 ) + "px";

        $container.style.width = settings.width + "px";

        // $innerCircle.style.top = ( settings.height * settings.innerBorder ) + "px";
        // $innerCircle.style.left = ( settings.width * settings.innerBorder ) + "px";

        $container.style.height = settings.height + "px";
        $innerCircle.style.height = ( settings.height - 20 ) + "px";
        $right.style.height = settings.height + "px";
        $left.style.height = settings.height + "px";
        $backPie.style.height = settings.height + "px";

        $right.style.clip = "rect(0px, " +
            settings.width + "px, " +
            ( rightValue * settings.height ) + "px, " +
            ( settings.width / 2 ) + "px)";

        $left.style.clip = "rect(" +
            ( leftValue * settings.height ) + "px, " +
            ( settings.width / 2 ) + "px, " +
            settings.width + "px, 0px)";

    }


    window.circleGauge = {
        initialize: initialize
    };

}( window ) );
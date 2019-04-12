( function () {

    //need to add redirectUri to the queryString
    var videoElement = document.querySelector( 'video' ),
        videoid = document.querySelector( '#videoSource' );


    function init() {

        if ( 'mediaDevices' in navigator ) {

            //bind buttons
            // base.checkLastAuth()
            //     .then(function (lastAuth) {

            initializeAuthentication();

            //                });

        } else {

            location.replace( "login/" );
        }

    }

    /*

    - get photo from canvas (toDataURL)
    - convert to Blob
    - 

    */
    function getPhotoFromdataURL() {

        $( '.loader1' ).show();
        var canvas = document.querySelector( ".user-face" );

        canvas.toBlob(
            function ( blob ) {

                var authKey = "auth-token";
                // Do something with the blob object,
                // e.g. creating a multipart form for file uploads:
                var formData = new FormData();

                formData.append( "AvatarImage", blob, "test.png" );


            },
            'image/png'
        );

    }

    function initializeAuthentication() {
        //        $( '.btn-login' ).prop( 'disabled', true );
        //setup mediaCapture stuff
        var face = this;

        setupCamera();

        videoid.onchange = getStream;

        document.querySelector( ".btn-login" ).addEventListener( "click",
            function ( evt ) {

                evt.preventDefault();

                getPhotoFromdataURL();

                return false;

            } );

    }

    function setupCamera() {

        return navigator.mediaDevices.enumerateDevices()
            .then( gotDevices ).then( getStream ).catch( handleError );

    }

    function gotDevices( deviceInfos ) {

        deviceInfos.forEach( function ( deviceInfo ) {

            var option = document.createElement( 'option' );

            option.value = deviceInfo.deviceId;

            if ( deviceInfo.kind === 'videoinput' ) {

                option.text = deviceInfo.label || 'camera ' + ( videoid.length + 1 );

                videoid.appendChild( option );

            }
            // else {
            //     console.log('Found one other kind of source/device: ', deviceInfo);
            // }

        } );

    }

    function getStream() {

        if ( window.stream ) {

            window.stream.getTracks().forEach( function ( track ) {
                track.stop();
            } );

        }

        var constraints = {
            video: {
                deviceId: {
                    exact: videoid.value
                }
            }
        };

        navigator.mediaDevices.getUserMedia( constraints )
            .then( gotStream )
            .then( showCapture )
            .catch( handleError );

    }

    function showCapture() {

        var captureBtnRow = document.querySelector( ".row-capture-btn" ),
            captureBtn = document.querySelector( ".btn-capture" );

        captureBtnRow.classList.remove( "hide" );

        captureBtn.addEventListener( "click", captureFace );

    }

    /**
     * Captures a image frame from the provided video element.
     *
     * @param {Video} video HTML5 video element from where the image frame will be captured.
     * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
     *
     * @return {Canvas}
     */
    function captureFace( evt ) {

        //        $( '.btn-login' ).prop( 'disabled', false );

        var faceCapture = document.querySelector( ".row-captured-face" ),
            videoRow = document.querySelector( ".video-source-wrapper" ),
            video = document.querySelector( ".faceid-camera" ),
            canvas = document.querySelector( ".user-face" );

        if ( video.paused ) {

            video.play();

        } else {

            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;

            var ctx = canvas.getContext( '2d' );

            ctx.drawImage( video, 0, 0, video.videoWidth, video.videoHeight );

            video.pause();

        }

        videoRow.classList.toggle( "hide" );
        faceCapture.classList.toggle( "hide" );

    }

    function gotStream( stream ) {

        window.stream = stream; // make stream available to console
        videoElement.srcObject = stream;

    }

    function handleError( error ) {

        console.error( 'Error: ', error );

    }

    init();

}() );
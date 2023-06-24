(() => {

    const videoElement = document.querySelector('video');
    const videoSelect = document.querySelector('#videoSource');

    async function init() {

        if ('mediaDevices' in navigator) {
        
            const hasPermission = await checkCameraPermission();
        
            if (hasPermission) {
                
                await initializeMediaCapture();

            } else {
                
                try {
                    await requestCameraPermission();
                    
                    await initializeMediaCapture();
                
                } catch (error) {
                    handleError('Permission denied. Please grant access to the camera.');
                }

            }
        } else {
            handleError('MediaDevices API not supported.');
        }
    }

    async function initializeMediaCapture() {
        
        await setupCamera();
        
        videoSelect.addEventListener('change', getStream);
        document.querySelector('.btn-capture').addEventListener('click', captureFace);
        
        getPhotoFromDataURL();

    }

    async function checkCameraPermission() {
        
        try {
        
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        
            return true;
        
        } catch (error) {
            return false;
        }

    }

    async function requestCameraPermission() {
        
        try {
        
            await navigator.mediaDevices.getUserMedia({ video: true });
        
        } catch (error) {
            throw error;
        }
        
    }


    async function setupCamera() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            gotDevices(devices);
            await getStream();
        } catch (error) {
            handleError(error);
        }
    }

    function gotDevices(deviceInfos) {
        deviceInfos.forEach((deviceInfo) => {

            console.log('Device:', deviceInfo);

            if (deviceInfo.kind === 'videoinput') {
                const option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
                videoSelect.appendChild(option);
            }
        });
    }

    async function getStream() {
        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
        }

        const constraints = {
            video: true,
            audio: false,
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            gotStream(stream);
            showCapture();
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                // Permission denied by the user
                handleError('Permission denied. Please grant access to the camera.');
            } else if (error.name === 'NotFoundError' || error.name === 'NotReadableError') {
                // No camera found or camera is not readable
                handleError('No camera available or camera is not readable.');
            } else {
                // Other errors
                handleError('Error accessing camera: ' + error.message);
            }
        }
    }


    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoElement.srcObject = stream;
    }

    function showCapture() {
        document.querySelector('.row-capture-btn').classList.remove('hide');
    }

    function captureFace(evt) {
        evt.preventDefault();

        const videoElement = document.querySelector('.faceid-camera');
        const canvas = document.querySelector('.user-face');

        if (videoElement.paused) {
            videoElement.play();
        } else {
            const ctx = canvas.getContext('2d');
            canvas.height = videoElement.videoHeight;
            canvas.width = videoElement.videoWidth;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            videoElement.pause();
        }

        document.querySelector('.video-source-wrapper').classList.toggle('hide');
        document.querySelector('.row-captured-face').classList.toggle('hide');
    }

    function getPhotoFromDataURL() {
        const canvas = document.querySelector('.user-face');

        canvas.toBlob(
            (blob) => {
                const formData = new FormData();
                formData.append('AvatarImage', blob, 'test.png');
                // Do something with the form data, e.g., send it to the server
            },
            'image/png'
        );
    }

    function handleError(error) {
        console.error('Error:', error);
    }

    init();

})();

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoPlayer');
    const loading = document.getElementById('loading');
    
    // The provided HTTP m3u8 stream
    const videoSrc = 'http://103.151.61.12/T-Sports.kutta/video.m3u8';

    function initPlayer() {
        if (Hls.isSupported()) {
            const hls = new Hls({
                debug: false,
                enableWorker: true
            });
            
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                loading.style.display = 'none';
                console.log('Stream loaded!');
            });
            
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            loading.innerText = 'NETWORK ERROR: Stream offline or blocked (Mixed Content?)';
                            loading.style.color = 'red';
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            loading.innerText = 'MEDIA ERROR: Trying to recover...';
                            hls.recoverMediaError();
                            break;
                        default:
                            loading.innerText = 'FATAL ERROR: Cannot load stream.';
                            hls.destroy();
                            break;
                    }
                }
            });
            
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Fallback for native HLS support (e.g., Safari)
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function () {
                loading.style.display = 'none';
            });
            video.addEventListener('error', function () {
                loading.innerText = 'ERROR: Cannot load stream.';
                loading.style.color = 'red';
            });
        } else {
            loading.innerText = 'YOUR BROWSER DOES NOT SUPPORT HLS VIDEO.';
            loading.style.color = 'red';
        }
    }

    initPlayer();
});

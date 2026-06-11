document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoPlayer');
    const loading = document.getElementById('loading');
    
    // The original HTTP stream URL
    const videoSrc = 'http://103.151.61.12/T-Sports.kutta/video.m3u8';

    // Custom loader to intercept HLS.js requests and route them through an HTTPS CORS proxy.
    // This allows the stream to play on static sites like GitHub Pages without Mixed Content errors.
    class ProxyLoader extends Hls.DefaultConfig.loader {
        constructor(config) {
            super(config);
            const originalLoad = this.load.bind(this);
            this.load = function (context, config, callbacks) {
                if (context.url && context.url.startsWith('http://')) {
                    // Route via a public HTTPS CORS proxy
                    context.url = 'https://corsproxy.io/?' + encodeURIComponent(context.url);
                }
                originalLoad(context, config, callbacks);
            };
        }
    }

    function initPlayer() {
        if (Hls.isSupported()) {
            const hls = new Hls({
                debug: false,
                enableWorker: true,
                pLoader: ProxyLoader,
                fLoader: ProxyLoader
            });
            
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                loading.style.display = 'none';
                console.log('Stream loaded via CORS proxy!');
            });
            
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            loading.innerText = 'NETWORK ERROR: Proxy down or stream offline.';
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
            // Fallback for native HLS (Safari/iOS)
            // Note: iOS Safari does not support custom HLS.js loaders, so we try to load the CORS proxy directly
            video.src = 'https://corsproxy.io/?' + encodeURIComponent(videoSrc);
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

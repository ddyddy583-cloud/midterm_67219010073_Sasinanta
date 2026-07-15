// 1. โหลดระบบ YouTube API เข้ามาในหน้าเว็บ
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// เก็บรวบรวมอินสแตนซ์เครื่องเล่นทั้งหมด
let players = {};

// ฟังก์ชันช่วยดึงไอดีของคลิปจากยูทูบลิงก์
function extractVideoId(url) {
    if (!url) return null;
    // ปรับการค้นหาไอดีให้ยืดหยุ่น รองรับการพิมพ์ผิดระหว่างเลข 1 กับแอลเล็ก (l)
    let cleanedUrl = url.replace("youtu.be/5l92", "youtu.be/5192");
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = cleanedUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 2. ฟังก์ชันนี้จะทำงานอัตโนมัติเมื่อระบบ API พร้อมใช้งาน
function onYouTubeIframeAPIReady() {
    document.querySelectorAll('.player-card').forEach((card, index) => {
        const videoUrl = card.getAttribute('data-video-url');
        const videoId = extractVideoId(videoUrl);
        const iframe = card.querySelector('.youtube-video-frame');
        const iframeId = iframe.getAttribute('id');

        if (videoId && iframeId) {
            // สร้างเครื่องเล่นจำลองลงในแต่ละ iframe พร้อมเปิดโหมดควบคุมผ่าน API (enablejsapi)
            players[iframeId] = new YT.Player(iframeId, {
                videoId: videoId,
                playerVars: {
                    'enablejsapi': 1,
                    'rel': 0
                },
                events: {
                    'onStateChange': (event) => onPlayerStateChange(event, card)
                }
            });

            // ผูกฟังก์ชันเข้ากับปุ่มควบคุมด้านล่าง (Play/Pause Button)
            const playBtn = card.querySelector('.play-btn');
            playBtn.addEventListener('click', () => {
                let currentPlayer = players[iframeId];
                if (currentPlayer && currentPlayer.getPlayerState) {
                    let state = currentPlayer.getPlayerState();
                    if (state === YT.PlayerState.PLAYING) {
                        currentPlayer.pauseVideo();
                    } else {
                        // หยุดเล่นวิดีโอตัวอื่นๆ ก่อนจะเล่นเพลงนี้
                        pauseAllPlayersExcept(iframeId);
                        currentPlayer.playVideo();
                    }
                }
            });
        }
    });
}

// 3. ปรับเปลี่ยนข้อความสัญลักษณ์ปุ่ม (▶ / ⏸) เมื่อสถานะในตัววิดีโอขยับ
function onPlayerStateChange(event, card) {
    const playBtn = card.querySelector('.play-btn');
    const iframeId = card.querySelector('.youtube-video-frame').getAttribute('id');
    
    if (event.data === YT.PlayerState.PLAYING) {
        playBtn.textContent = '⏸'; // เปลี่ยนเป็นปุ่มหยุดชั่วคราวเมื่อเพลงเล่น
        pauseAllPlayersExcept(iframeId);
    } else {
        playBtn.textContent = '▶'; // เปลี่ยนกลับมาเป็นปุ่มเล่นปกติเมื่อหยุดหรือจบเพลง
    }
}

// ฟังก์ชันสั่งหยุดเพลงอื่นทั้งหมดเพื่อป้องกันเสียงทับซ้อนกัน
function pauseAllPlayersExcept(activeId) {
    Object.keys(players).forEach(id => {
        if (id !== activeId && players[id] && players[id].pauseVideo) {
            players[id].pauseVideo();
        }
    });
}

// โหลด YouTube Iframe Player API แบบ Asynchronous
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let currentPlayingCard = null;

// ฟังก์ชันนี้จะทำงานอัตโนมัติเมื่อติดตั้ง API เสร็จ
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-audio-player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            'autoplay': 0,
            'controls': 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// ตรวจจับสถานะการเปลี่ยนตัวเล่น (เช่น จบเพลง)
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED && currentPlayingCard) {
        let playBtn = currentPlayingCard.querySelector('.play-btn');
        playBtn.textContent = '▶';
        currentPlayingCard = null;
    }
}

// ตั้งค่าปุ่มควบคุมของการ์ดเพลงแต่ละใบ
document.querySelectorAll('.player-card').forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    const videoId = card.getAttribute('data-video-id');

    playBtn.addEventListener('click', function() {
        if (!player) return; // หาก API ยังโหลดไม่เสร็จ ให้หยุดทำงานก่อน

        // กรณีคลิกเครื่องเล่นตัวเดิมที่กำลังเล่นอยู่ -> ให้หยุดชั่วคราว (Pause)
        if (currentPlayingCard === card) {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                playBtn.textContent = '▶';
            } else {
                player.playVideo();
                playBtn.textContent = '⏸';
            }
        } 
        // กรณีคลิกเล่นเพลงใหม่ หรือเครื่องเล่นอื่น
        else {
            // คืนค่าปุ่มเครื่องเล่นอันเก่า (ถ้ามี) ให้กลับเป็นรูป Play
            if (currentPlayingCard) {
                currentPlayingCard.querySelector('.play-btn').textContent = '▶';
            }

            // เปลี่ยนมากดเล่นการ์ดปัจจุบัน
            currentPlayingCard = card;
            player.loadVideoById(videoId);
            player.playVideo();
            playBtn.textContent = '⏸';
        }
    });
});

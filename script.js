document.addEventListener("DOMContentLoaded", function() {
    // ฟังก์ชันช่วยดึง Video ID ออกมาจากลิงก์ YouTube รูปแบบต่างๆ
    function extractVideoId(url) {
        if (!url) return null;
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // ทำการประมวลผลการ์ดเพลงทุกใบในหน้าเว็บ
    document.querySelectorAll('.player-card').forEach(card => {
        const videoUrl = card.getAttribute('data-video-url');
        const videoId = extractVideoId(videoUrl);
        const iframe = card.querySelector('.youtube-video-frame');

        if (videoId && iframe) {
            // ทำการแปลงลิงก์ไปเป็นลิงก์สำหรับฝัง (Embed URL) ของ YouTube
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
        }
    });
});

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

// ฟังก์ชันสำหรับดึง Video ID จากลิงก์ YouTube
function extractVideoId(url) {
    if (!url) return null;
    let cleanedUrl = url.replace("youtu.be/5l92", "youtu.be/5192");
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = cleanedUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

document.querySelectorAll('.player-card').forEach(card => {
    // ปรับเป็นดึงค่าจาก attribute 'data-video-id' ตาม HTML ล่าสุดของคุณ
    const videoUrl = card.getAttribute('data-video-id');
    const playBtn = card.querySelector('.play-btn');
    const thumbContainer = card.querySelector('.song-thumb-container');
    const iframe = card.querySelector('.youtube-video-frame');
    
    const videoId = extractVideoId(videoUrl);
    let isPlaying = false;

    const togglePlay = () => {
        if (!videoId || !iframe) return;

        if (!isPlaying) {
            // โหลดและเล่นวิดีโอในกรอบ iframe ทันที
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
            playBtn.textContent = '⏸';
            isPlaying = true;
        } else {
            // สั่งหยุดเล่นเพลง
            iframe.src = '';
            playBtn.textContent = '▶';
            isPlaying = false;
        }
    };

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (thumbContainer) thumbContainer.addEventListener('click', togglePlay);
});

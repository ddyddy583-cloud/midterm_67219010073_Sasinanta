function extractVideoId(url) {
    if (!url) return null;
    let cleanedUrl = url.replace("youtu.be/5l92", "youtu.be/5192");
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = cleanedUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

document.querySelectorAll('.player-card').forEach(card => {
    const videoUrl = card.getAttribute('data-video-url');
    const playBtn = card.querySelector('.play-btn');
    const thumbContainer = card.querySelector('.song-thumb-container');

    // ฟังก์ชันสำหรับพาไปเปิดฟังเพลง
    const playSong = () => {
        if (videoUrl) {
            // สั่งเปิดแท็บใหม่ไปที่เพลงนี้ทันที ไม่มีโดนบล็อกแน่นอน
            window.open(videoUrl, '_blank');
        }
    };

    // กดปุ่มเล่น หรือกดที่ตัวรูปภาพ ก็จะทำงานเหมือนกัน
    playBtn.addEventListener('click', playSong);
    thumbContainer.addEventListener('click', playSong);
});

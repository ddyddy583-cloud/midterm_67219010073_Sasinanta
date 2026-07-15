// ฟังก์ชันสำหรับแกะเอา Video ID (ความยาว 11 ตัวอักษร) ออกมาจากลิงก์ YouTube
function extractVideoId(url) {
    if (!url) return null;
    // ป้องกันการพิมพ์ผิดเฉพาะเคส (อิงจากโค้ดเดิมของคุณ)
    let cleanedUrl = url.replace("youtu.be/5l92", "youtu.be/5192");
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = cleanedUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// วนลูปจัดการการ์ดเครื่องเล่นเพลงทุกใบในหน้าเว็บ
document.querySelectorAll('.player-card').forEach(card => {
    const videoUrl = card.getAttribute('data-video-url');
    const playBtn = card.querySelector('.play-btn');
    const thumbContainer = card.querySelector('.song-thumb-container');
    const iframe = card.querySelector('.youtube-video-frame');
    
    // ดึง Video ID ออกเตรียมไว้ล่วงหน้า
    const videoId = extractVideoId(videoUrl);

    // สร้างสถานะจำลองเพื่อเปลี่ยนปุ่ม ▶ เป็น ⏸
    let isPlaying = false;

    const togglePlay = () => {
        if (!videoId || !iframe) return;

        if (!isPlaying) {
            // 1. ถ้ายังไม่ได้เล่น: นำ Video ID ไปใส่ใน Embed URL ของ YouTube เพื่อโหลดวิดีโอเข้ามาเล่นทันที
            // ใส่พารามิเตอร์ autoplay=1 เพื่อให้คลิกแล้วเริ่มเล่นอัตโนมัติ และ enablejsapi=1 เพื่อควบคุมผ่านโค้ดได้ดีขึ้น
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
            
            // 2. เปลี่ยนไอคอนบนปุ่มเป็นปุ่มหยุดชั่วคราว
            playBtn.textContent = '⏸';
            isPlaying = true;
        } else {
            // 3. ถ้ากำลังเล่นอยู่แล้วกดซ้ำ: ให้ทำการล้างค่า src เพื่อหยุดเล่นเพลง (Stop)
            iframe.src = '';
            
            // 4. เปลี่ยนไอคอนกลับเป็นปุ่มเล่นตามเดิม
            playBtn.textContent = '▶';
            isPlaying = false;
        }
    };

    // ลงทะเบียน Event ให้ทำงานทั้งตอนกดปุ่ม Play และกดที่บริเวณรูปภาพของเพลง
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    if (thumbContainer) {
        thumbContainer.addEventListener('click', togglePlay);
    }
});

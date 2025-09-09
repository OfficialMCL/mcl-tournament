// carousel.js - Carousel functionality for Swiper
const swiper = new Swiper('.swiper', {
  loop: true,
  autoplay: { 
    delay: 7000, 
    disableOnInteraction: false 
  },
  navigation: { 
    nextEl: '.swiper-button-next', 
    prevEl: '.swiper-button-prev' 
  },
  pagination: { 
    el: '.swiper-pagination', 
    clickable: true 
  },
});

// Circular Play/Pause button control
const playPauseBtn = document.getElementById('playPauseBtn');
let isPlaying = true; // Carousel starts playing by default

if (playPauseBtn) {
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      // Switch to paused state
      swiper.autoplay.stop();
      playPauseBtn.innerHTML = '<div class="play-icon"></div>';
      isPlaying = false;
    } else {
      // Switch to playing state
      swiper.autoplay.start();
      playPauseBtn.innerHTML = '<div class="pause-icon"></div>';
      isPlaying = true;
    }
  });
}
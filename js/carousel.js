// carousel.js - Carousel functionality for Swiper
const swiper = new Swiper('.swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 0,
  // NON includere autoplay
  // autoplay: { delay: 8000, disableOnInteraction: false },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});

// Circular Play/Pause button control
const playPauseBtn = document.querySelector('.swiper .play-pause-btn');
playPauseBtn.addEventListener('click', () => {
  // Logica di play/pause
  if (isPlaying) {
    swiper.autoplay.stop();
    playPauseBtn.innerHTML = '<div class="play-icon"></div>';
  } else {
    swiper.autoplay.start();
    playPauseBtn.innerHTML = '<div class="pause-icon"></div>';
  }
  isPlaying = !isPlaying;
});

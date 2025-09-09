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

// Pause / Play controls
const pauseBtn = document.getElementById('pauseBtn');
const playBtn = document.getElementById('playBtn');

if (pauseBtn && playBtn) {
  pauseBtn.addEventListener('click', () => {
    swiper.autoplay.stop();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline-block';
  });

  playBtn.addEventListener('click', () => {
    swiper.autoplay.start();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
  });
}
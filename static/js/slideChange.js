 let currentSlide = 0;
 const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;
let autoSlideInterval;
// Change slide function
function changeSlide(direction) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    dots[currentSlide].classList.add('active');
    updateCounter();
    // Reset auto slide timer
    resetAutoSlide();
  }
  // Go to specific slide
function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
    currentSlide = index;
    
    dots[currentSlide].classList.add('active');
    updateCounter();
    
    // Reset auto slide timer
    resetAutoSlide();
  }
  
  // Update counter
  function updateCounter() {
    document.getElementById('current-slide').textContent = currentSlide + 1;
  }
  
  // Auto slide (every 3 seconds)
  function startAutoSlide() {
    if (totalSlides > 1) {
      autoSlideInterval = setInterval(() => {
        changeSlide(1);
      }, 3000); // 3 giây
    }
  }
  const slides = document.querySelectorAll('.slide');

// Reset auto slide timer
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Keyboard navigation
slides[currentSlide].classList.add('active');
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (e.key === 'ArrowRight') {
    changeSlide(1);
  }
});

// Touch swipe support (for mobile)
let touchStartX = 0;
let touchEndX = 0;
slides[currentSlide].classList.add('active');
const slider = document.querySelector('.image-slider');
slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});
slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});
function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1); // Swipe left
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1); // Swipe right
    }
}
// Start auto slide when page loads
startAutoSlide();
// Pause auto slide when user hovers over slider
slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});
slider.addEventListener('mouseleave', () => {
    startAutoSlide();
});
// ==================== IMAGE SLIDER - FIXED VERSION ==================== 

// Global variables for slider
let currentSlide = 0;
let autoSlideInterval = null;
let slides = null;
let dots = null;
let totalSlides = 0;
let slider = null;
let isInitialized = false;

// Initialize slider function
function initializeSlider() {
    console.log('🚀 Initializing slider...');
    
    // Clear any existing interval first
    cleanupSlider();

    // Get fresh references to DOM elements
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    slider = document.querySelector('.image-slider');
    
    // Check if slider exists
    if (!slides || slides.length === 0) {
        console.log('❌ No slides found');
        return;
    }

    totalSlides = slides.length;
    currentSlide = 0;
    isInitialized = true;

    console.log(`✅ Found ${totalSlides} slides`);

    // Reset all slides and dots
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === 0) {
            slide.classList.add('active');
        }
    });

    if (dots && dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === 0) {
                dot.classList.add('active');
            }
            
            // Remove old listeners and add new ones
            dot.replaceWith(dot.cloneNode(true));
        });
        
        // Re-get dots after cloning
        dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dot clicked:', index);
                goToSlide(index);
            });
        });
    }

    // Update counter
    updateCounter();

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Setup touch swipe
    setupTouchSwipe();

    // Setup arrow clicks
    setupArrowClicks();

    // Start auto slide
    if (totalSlides > 1) {
        startAutoSlide();
    }

    console.log('✅ Slider initialized successfully');
}

// Setup arrow button clicks
function setupArrowClicks() {
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');

    if (prevBtn) {
        // Clone to remove old listeners
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        
        newPrevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('⬅️ Previous button clicked');
            changeSlide(-1);
        });
        console.log('✅ Previous button setup');
    }

    if (nextBtn) {
        // Clone to remove old listeners
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        newNextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('➡️ Next button clicked');
            changeSlide(1);
        });
        console.log('✅ Next button setup');
    }
}

// Change slide function
function changeSlide(direction) {
    if (!slides || totalSlides === 0) {
        console.log('❌ Cannot change slide - no slides available');
        return;
    }

    console.log(`🔄 Changing slide from ${currentSlide} (direction: ${direction})`);

    slides[currentSlide].classList.remove('active');
    if (dots && dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }

    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

    console.log(`✅ New slide: ${currentSlide}`);

    slides[currentSlide].classList.add('active');
    if (dots && dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }

    updateCounter();
    resetAutoSlide();
}

// Go to specific slide
function goToSlide(index) {
    if (!slides || totalSlides === 0) {
        console.log('❌ Cannot go to slide - no slides available');
        return;
    }
    
    console.log(`🎯 Going to slide ${index}`);
    
    slides[currentSlide].classList.remove('active');
    if (dots && dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    if (dots && dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }

    updateCounter();
    resetAutoSlide();
}

// Update counter
function updateCounter() {
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    
    if (currentSlideElement) {
        currentSlideElement.textContent = currentSlide + 1;
    }
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
}

// Auto slide (every 5 seconds)
function startAutoSlide() {
    if (totalSlides > 1 && !autoSlideInterval) {
        autoSlideInterval = setInterval(function() {
            changeSlide(1);
        }, 5000); // Increased to 5 seconds for better UX
        console.log('▶️ Auto-slide started');
    }
}

// Reset auto slide timer
function resetAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    startAutoSlide();
}

// Keyboard navigation
let keydownHandler = null;

function setupKeyboardNavigation() {
    // Remove old listener if exists
    if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
    }
    
    // Create new handler
    keydownHandler = function(e) {
        if (!isInitialized || !slides || totalSlides === 0) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            changeSlide(1);
        }
    };
    
    // Add new listener
    document.addEventListener('keydown', keydownHandler);
}

// Touch swipe support (for mobile)
let touchStartX = 0;
let touchEndX = 0;
let touchStartHandler = null;
let touchEndHandler = null;
let mouseEnterHandler = null;
let mouseLeaveHandler = null;

function setupTouchSwipe() {
    if (!slider) return;

    // Remove old listeners
    if (touchStartHandler) {
        slider.removeEventListener('touchstart', touchStartHandler);
    }
    if (touchEndHandler) {
        slider.removeEventListener('touchend', touchEndHandler);
    }
    if (mouseEnterHandler) {
        slider.removeEventListener('mouseenter', mouseEnterHandler);
    }
    if (mouseLeaveHandler) {
        slider.removeEventListener('mouseleave', mouseLeaveHandler);
    }

    // Create new handlers
    touchStartHandler = function(e) {
        touchStartX = e.changedTouches[0].screenX;
    };

    touchEndHandler = function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    };

    mouseEnterHandler = function() {
        pauseAutoSlide();
    };

    mouseLeaveHandler = function() {
        startAutoSlide();
    };

    // Add new listeners
    slider.addEventListener('touchstart', touchStartHandler, { passive: true });
    slider.addEventListener('touchend', touchEndHandler, { passive: true });
    slider.addEventListener('mouseenter', mouseEnterHandler);
    slider.addEventListener('mouseleave', mouseLeaveHandler);
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1); // Swipe left
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1); // Swipe right
    }
}

function pauseAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
        console.log('⏸️ Auto-slide paused');
    }
}

// Cleanup function
function cleanupSlider() {
    console.log('🧹 Cleaning up slider...');
    
    isInitialized = false;
    
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    
    if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
    }
    
    if (slider) {
        if (touchStartHandler) {
            slider.removeEventListener('touchstart', touchStartHandler);
        }
        if (touchEndHandler) {
            slider.removeEventListener('touchend', touchEndHandler);
        }
        if (mouseEnterHandler) {
            slider.removeEventListener('mouseenter', mouseEnterHandler);
        }
        if (mouseLeaveHandler) {
            slider.removeEventListener('mouseleave', mouseLeaveHandler);
        }
    }
    
    touchStartHandler = null;
    touchEndHandler = null;
    mouseEnterHandler = null;
    mouseLeaveHandler = null;
    
    console.log('✅ Cleanup complete');
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.initializeSlider = initializeSlider;
    window.cleanupSlider = cleanupSlider;
    console.log('📦 Slider functions exported to window');
}
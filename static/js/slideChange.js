// ==================== IMAGE SLIDER WITH MORPHING EFFECT ==================== 

const Slider = {
    current: 0,
    interval: null,
    slides: null,
    dots: null,
    total: 0,
    isAnimating: false,

    init() {
        this.cleanup();
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.total = this.slides.length;

        if (this.total === 0) return;

        this.showSlide(0, false);
        this.bindEvents();
        if (this.total > 1) this.startAuto();
    },

    showSlide(n, animate = true) {
        if (this.isAnimating && animate) return;
        
        const oldSlide = this.slides[this.current];
        const newSlide = this.slides[n];
        
        if (animate && oldSlide !== newSlide) {
            this.isAnimating = true;
            
            // Add morphing-out to current slide
            oldSlide.classList.add('morphing-out');
            
            // Add morphing-in to new slide after a short delay
            setTimeout(() => {
                newSlide.classList.add('active', 'morphing-in');
            }, 100);
            
            // Clean up after animation
            setTimeout(() => {
                oldSlide.classList.remove('active', 'morphing-out');
                newSlide.classList.remove('morphing-in');
                this.isAnimating = false;
            }, 800);
        } else {
            // No animation for first load
            this.slides.forEach((s, i) => s.classList.toggle('active', i === n));
        }
        
        this.dots.forEach((d, i) => d.classList.toggle('active', i === n));
        this.current = n;
        this.updateCounter();
    },

    change(dir) {
        if (this.isAnimating) return;
        this.showSlide((this.current + dir + this.total) % this.total);
        this.resetAuto();
    },

    bindEvents() {
        // Arrows
        const prev = document.querySelector('.slider-arrow.prev');
        const next = document.querySelector('.slider-arrow.next');
        if (prev) prev.onclick = () => this.change(-1);
        if (next) next.onclick = () => this.change(1);

        // Dots
        this.dots.forEach((dot, i) => dot.onclick = () => {
            if (this.isAnimating) return;
            this.showSlide(i);
            this.resetAuto();
        });

        // Keyboard
        document.addEventListener('keydown', this.handleKey = (e) => {
            if (this.isAnimating) return;
            if (e.key === 'ArrowLeft') this.change(-1);
            if (e.key === 'ArrowRight') this.change(1);
        });

        // Touch
        const slider = document.querySelector('.image-slider');
        if (slider) {
            slider.addEventListener('touchstart', this.handleTouchStart = (e) => {
                this.touchX = e.touches[0].clientX;
            }, { passive: true });

            slider.addEventListener('touchend', this.handleTouchEnd = (e) => {
                if (this.isAnimating) return;
                const diff = this.touchX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) this.change(diff > 0 ? 1 : -1);
            }, { passive: true });

            slider.onmouseenter = () => this.stopAuto();
            slider.onmouseleave = () => this.startAuto();
        }
    },

    startAuto() {
        if (this.total > 1 && !this.interval) {
            this.interval = setInterval(() => this.change(1), 5000);
        }
    },

    stopAuto() {
        clearInterval(this.interval);
        this.interval = null;
    },

    resetAuto() {
        this.stopAuto();
        this.startAuto();
    },

    updateCounter() {
        const curr = document.getElementById('current-slide');
        const total = document.getElementById('total-slides');
        if (curr) curr.textContent = this.current + 1;
        if (total) total.textContent = this.total;
    },

    cleanup() {
        this.stopAuto();
        if (this.handleKey) document.removeEventListener('keydown', this.handleKey);
        const slider = document.querySelector('.image-slider');
        if (slider) {
            if (this.handleTouchStart) slider.removeEventListener('touchstart', this.handleTouchStart);
            if (this.handleTouchEnd) slider.removeEventListener('touchend', this.handleTouchEnd);
            slider.onmouseenter = slider.onmouseleave = null;
        }
        // Remove all animation classes
        if (this.slides) {
            this.slides.forEach(slide => {
                slide.classList.remove('morphing-out', 'morphing-in');
            });
        }
    }
};

window.initializeSlider = () => Slider.init();
window.cleanupSlider = () => Slider.cleanup();
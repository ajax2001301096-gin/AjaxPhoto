// Tạo cánh hoa động bằng JavaScript
const container = document.getElementById('petalsContainer');
if (container) {
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        container.appendChild(petal);
    }
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const nav = document.getElementById('nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Load blog detail bằng AJAX
async function loadBlogDetail(blogId) {
    const gallery = document.getElementById('gallery');
    const blogDetailOverlay = document.getElementById('blog-detail-overlay');
    const blogDetailContent = document.getElementById('blog-detail-content');
    
    if (!gallery || !blogDetailOverlay || !blogDetailContent) {
        console.error('Required elements not found');
        return;
    }

    // Cleanup existing slider before loading new content
    if (typeof window.cleanupSlider === 'function') {
        window.cleanupSlider();
    }

    gallery.style.display = 'none';
    blogDetailOverlay.style.display = 'block';
    blogDetailContent.innerHTML = '<p style="text-align: center; padding: 64px; color: #7A7571; font-size: 16px;">Đang tải...</p>';
    
    try {
        const response = await fetch(`/blog/${blogId}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const html = await response.text();
        blogDetailContent.innerHTML = html;
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // IMPORTANT: Initialize slider after content is loaded
        // Wait a bit for DOM to be ready
        setTimeout(function() {
            if (typeof window.initializeSlider === 'function') {
                window.initializeSlider();
                console.log('Slider initialized after AJAX load');
            } else {
                console.error('initializeSlider function not found');
            }
        }, 100);
        
        // Update URL without reload
        history.pushState({blogId: blogId}, '', `#blog-${blogId}`);
        
    } catch (error) {
        console.error('Error loading blog detail:', error);
        blogDetailContent.innerHTML = `
            <div style="text-align: center; padding: 64px;">
                <p style="color: #7A7571; font-size: 16px; margin-bottom: 16px;">
                    ❌ Lỗi khi tải bài viết
                </p>
                <p style="color: #7A7571; font-size: 14px;">
                    Vui lòng thử lại hoặc quay về trang chủ
                </p>
                <button onclick="backToGallery()" style="
                    margin-top: 24px;
                    padding: 12px 24px;
                    background: #3D3935;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 15px;
                ">
                    ← Quay về trang chủ
                </button>
            </div>
        `;
    }
}

// Back to gallery
function backToGallery() {
    const gallery = document.getElementById('gallery');
    const blogDetailOverlay = document.getElementById('blog-detail-overlay');
    
    // Cleanup slider before going back
    if (typeof window.cleanupSlider === 'function') {
        window.cleanupSlider();
    }
    
    if (blogDetailOverlay) blogDetailOverlay.style.display = 'none';
    if (gallery) gallery.style.display = 'grid';
    
    history.pushState({}, '', '/');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Handle browser back button
window.addEventListener('popstate', function(e) {
    if (window.location.hash.startsWith('#blog-')) {
        const blogId = window.location.hash.replace('#blog-', '');
        loadBlogDetail(blogId);
    } else {
        backToGallery();
    }
});

// Check if there's a hash on page load
window.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash.startsWith('#blog-')) {
        const blogId = window.location.hash.replace('#blog-', '');
        loadBlogDetail(blogId);
    }
});
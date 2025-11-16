// Tạo cánh hoa động bằng JavaScript
const container = document.getElementById('petalsContainer');
const petalCount = 8;
for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    container.appendChild(petal);
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const nav = document.getElementById('nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Load blog detail bằng AJAX
async function loadBlogDetail(blogId) {
    // Ẩn gallery, hiện loading
    const gallery = document.getElementById('gallery');
    const blogDetailOverlay = document.getElementById('blog-detail-overlay');
    const blogDetailContent = document.getElementById('blog-detail-content');
    
    if (!gallery || !blogDetailOverlay || !blogDetailContent) {
        console.error('Required elements not found');
        return;
    }

    gallery.style.display = 'none';
    blogDetailOverlay.style.display = 'block';
    blogDetailContent.innerHTML = '<p style="text-align: center; padding: 4rem;">Loading...</p>';
    
    try {
        // Fetch blog detail - sử dụng URL đúng
        const response = await fetch(`/blog/${blogId}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const html = await response.text();
        
        // Hiển thị content
        blogDetailContent.innerHTML = html;
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update URL (không reload)
        history.pushState({blogId}, '', `#blog-${blogId}`);
    } catch (error) {
        console.error('Error loading blog detail:', error);
        blogDetailContent.innerHTML = '<p style="text-align: center; padding: 4rem; color: red;">Lỗi khi tải bài viết. Vui lòng thử lại.</p>';
    }
}

// Back to gallery
function backToGallery() {
    const gallery = document.getElementById('gallery');
    const blogDetailOverlay = document.getElementById('blog-detail-overlay');
    
    if (blogDetailOverlay) blogDetailOverlay.style.display = 'none';
    if (gallery) gallery.style.display = 'grid';
    
    history.pushState({}, '', '/');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Handle browser back button
window.addEventListener('popstate', (e) => {
    if (window.location.hash.startsWith('#blog-')) {
        const blogId = window.location.hash.replace('#blog-', '');
        loadBlogDetail(blogId);
    } else {
        backToGallery();
    }
});

// Check if there's a hash on page load
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash.startsWith('#blog-')) {
        const blogId = window.location.hash.replace('#blog-', '');
        loadBlogDetail(blogId);
    }
});
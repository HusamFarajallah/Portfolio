// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Handle theme toggle click
// themeToggle.addEventListener('click', () => {
//     html.classList.toggle('dark');
//     localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
// });

// Initialize testimonials slider
function initTestimonials() {
    const slider = document.querySelector('.testimonials-slider');
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonials-dots');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    if (!slider || !track || slides.length === 0) return;

    // إضافة خاصية dir للعناصر
    slider.setAttribute('dir', 'rtl');
    track.setAttribute('dir', 'rtl');
    track.style.display = 'flex';

    let currentIndex = 0;
    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;
    let autoplayInterval = null;
    let slideWidth = 0;
    let slidesPerView = getSlidesPerView();
    let maxIndex = 0;

    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 640) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    function updateSlideWidth() {
        slidesPerView = getSlidesPerView();
        const containerWidth = slider.offsetWidth;
        const gap = 24;
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
        maxIndex = Math.max(0, slides.length - slidesPerView);
        
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
            slide.style.flexShrink = '0';
        });
    }

    function updateSlider(animate = true) {
        updateSlideWidth();
        const translateX = currentIndex * (slideWidth + 24); // تغيير الإشارة لـ RTL
        track.style.transition = animate ? 'transform 0.5s ease-out' : 'none';
        track.style.transform = `translateX(${translateX}px)`;

        updateDots();
        updateButtons();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition-all duration-300 hover:bg-blue-500 dark:hover:bg-blue-400 ${
                i === currentIndex ? 'bg-blue-500 dark:bg-blue-400 w-6' : 'bg-gray-300 dark:bg-gray-600'
            }`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateButtons() {
        prevButton.disabled = currentIndex >= maxIndex;
        nextButton.disabled = currentIndex <= 0;
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
    }

    function next() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    function prev() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    }

    function handleDragStart(e) {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentTranslate = currentIndex * (slideWidth + 24);
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const diff = startX - currentX; // عكس الاتجاه لـ RTL
        
        if ((currentIndex <= 0 && diff < 0) || (currentIndex >= maxIndex && diff > 0)) {
            return;
        }
        
        const newTranslate = currentTranslate + diff;
        track.style.transform = `translateX(${newTranslate}px)`;
    }

    function handleDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        const currentX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
        const diff = startX - currentX; // عكس الاتجاه لـ RTL

        if (Math.abs(diff) > slideWidth * 0.2) {
            diff > 0 ? prev() : next();
        } else {
            updateSlider();
        }

        track.style.cursor = '';
    }

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (currentIndex <= 0) {
                goToSlide(maxIndex);
            } else {
                next();
            }
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }

    // تعديل أحداث الأزرار لتتناسب مع RTL
    prevButton.addEventListener('click', () => {
        prev();
        stopAutoplay();
    });
    
    nextButton.addEventListener('click', () => {
        next();
        stopAutoplay();
    });

    // أحداث السحب
    track.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    track.addEventListener('touchstart', handleDragStart, { passive: true });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);

    // التحكم بالتلقائي
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // تعديلات حجم النافذة
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                updateSlideWidth();
                currentIndex = Math.min(currentIndex, maxIndex);
                updateSlider(false);
            }
        }, 200);
    });

    // التهيئة الأولية
    updateSlideWidth();
    updateSlider(false);
   // startAutoplay();
}



// Projects Modal
const projectCards = document.querySelectorAll('.project-card');
const modalOverlay = document.createElement('div');
modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden';
document.body.appendChild(modalOverlay);

// Create modal content
const modalContent = document.createElement('div');
modalContent.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 z-50 hidden';
document.body.appendChild(modalContent);

// Close modal function
function closeModal() {
    modalOverlay.classList.add('hidden');
    modalContent.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// Show project details
function showProjectDetails(project) {
    const title = project.querySelector('h3').textContent;
    const description = project.querySelector('p').textContent;
    const image = project.querySelector('img').src;
    const tags = Array.from(project.querySelectorAll('.skill-tag')).map(tag => tag.textContent.trim());

    modalContent.innerHTML = `
        <div class="relative">
            <button class="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onclick="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img src="${image}" alt="${title}" class="w-full h-64 object-cover rounded-lg mb-4">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${title}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">${description}</p>
            <div class="flex flex-wrap gap-2">
                ${tags.map(tag => `
                    <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm">
                        ${tag}
                    </span>
                `).join('')}
            </div>
        </div>
    `;

    modalOverlay.classList.remove('hidden');
    modalContent.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// Add click event listeners to project cards
projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        showProjectDetails(card);
    });
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenuBtn && navLinks && overlay) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking overlay
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking on a navigation link only
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Small delay to ensure all elements are properly rendered
    setTimeout(initTestimonials, 100);
});

// Intersection Observer for scroll animations
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Form submission handler
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('شكراً لتواصلك! سيتم الرد عليك قريباً.');
    });
}

// Smooth scroll for navigation links
document.addEventListener('click', function(e) {
    // Find closest anchor tag if clicked element is inside one
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') {
        e.preventDefault();
        return;
    }

    if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            // Close mobile menu if it's open
            const navLinks = document.querySelector('.nav-links');
            const overlay = document.querySelector('.mobile-menu-overlay');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Smooth scroll to target
            const headerOffset = 80; // Height of your fixed header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});

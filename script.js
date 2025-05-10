// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
}

// Theme toggle button handler
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Testimonials Carousel
function initTestimonials() {
    // Get DOM elements
    const wrapper = document.querySelector('.testimonials-wrapper');
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-nav-prev');
    const nextBtn = document.querySelector('.testimonial-nav-next');
    const dotsContainer = document.querySelector('.testimonial-dots');

    // Check if elements exist
    if (!wrapper || !track || !cards.length || !prevBtn || !nextBtn || !dotsContainer) {
        console.warn('Some testimonial elements are missing');
        return;
    }

    let currentIndex = 0;
    let isAnimating = false;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    // Initialize first slide
    updateSlide(0);

    // Update slide
    function updateSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Update current index
        currentIndex = index;

        // Move slide track (negative for RTL)
        track.style.transform = `translateX(${-index * 100}%)`;

        // Update active states
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });

        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Navigation functions
    function nextSlide() {
        if (!isAnimating) {
            const nextIndex = (currentIndex + 1) % cards.length;
            updateSlide(nextIndex);
        }
    }

    function prevSlide() {
        if (!isAnimating) {
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlide(prevIndex);
        }
    }

    // Event Listeners
    let autoplayInterval;

    // Click events
    nextBtn.addEventListener('click', () => {
        clearInterval(autoplayInterval);
        nextSlide();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(autoplayInterval);
        prevSlide();
        startAutoplay();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoplayInterval);
            updateSlide(index);
            startAutoplay();
        });
    });

    // Touch events
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoplayInterval);
    });

    track.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    });

    // Autoplay
    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    wrapper.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    wrapper.addEventListener('mouseleave', startAutoplay);

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoplayInterval);
        } else {
            startAutoplay();
        }
    });

    // Initialize
    updateSlidePosition();
    startAutoplay();

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoplayInterval);
        } else {
            startAutoplay();
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

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
    const dots = document.querySelectorAll('[data-index]');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    if (!slider || !track || !slides.length) return;
    
    let currentIndex = 0;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let autoplayInterval = null;
    
    function updateSlider() {
        const percentage = currentIndex * -100;
        track.style.transform = `translateX(${percentage}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
    }
    
    function navigate(direction) {
        currentIndex = direction === 'prev' 
            ? Math.max(currentIndex - 1, 0)
            : Math.min(currentIndex + 1, slides.length - 1);
        updateSlider();
    }
    
    function dragStart(e) {
        startPos = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        if (e.type !== 'touchstart') e.preventDefault();
        isDragging = true;
        track.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function dragEnd() {
        isDragging = false;
        track.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        if (Math.abs(movedBy) > 100) {
            currentIndex = movedBy < 0 
                ? Math.min(currentIndex + 1, slides.length - 1)
                : Math.max(currentIndex - 1, 0);
        }
        
        updateSlider();
    }
    
    function startAutoplay() {
        if (autoplayInterval) return;
        
        autoplayInterval = setInterval(() => {
            currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
            updateSlider();
        }, 5000);
    }
    
    function stopAutoplay() {
        if (!autoplayInterval) return;
        
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    
    // Event Listeners
    prevButton.addEventListener('click', () => navigate('prev'));
    nextButton.addEventListener('click', () => navigate('next'));
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.index);
            updateSlider();
        });
    });
    
    // Touch Events
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('touchmove', drag);
    
    // Mouse Events
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('mousemove', drag);
    
    // Hover Events
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Initialize
    updateSlider();
    startAutoplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTestimonials);

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

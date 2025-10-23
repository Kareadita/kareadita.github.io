// Extracted JS from remixed-af668bc7.html

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Fetch active installs
async function fetchActiveInstalls() {
    try {
        const response = await fetch('https://stats.kavitareader.com/api/ui/shield-badge');
        const data = await response.json();
        // Update live region value and aria-busy
        setActiveInstalls(data.message);
    } catch (error) {
        console.error('Error fetching active installs:', error);
        setActiveInstalls('53K+');
    }
}

fetchActiveInstalls();

// Helper: centralize updating the active installs display and spinner visibility
function setActiveInstalls(message) {
    const installsEl = document.getElementById('active-installs');
    const installsDisplay = document.getElementById('active-installs-display');
    const hidden = document.getElementById('active-installs-value');

    const normalized = (typeof message === 'string') ? message.trim() : '';

    // Update visible and hidden text
    if (installsDisplay) installsDisplay.textContent = message;
    if (hidden) hidden.textContent = `Active installs: ${message}`;

    // If we have a non-empty, non-whitespace value, hide/remove the spinner
    if (normalized.length > 0) {
        if (installsEl) installsEl.setAttribute('aria-busy', 'false');
        try {
            if (installsEl) {
                const spinner = installsEl.querySelector('.stat-loading');
                if (spinner && spinner.parentNode) spinner.parentNode.removeChild(spinner);
            }
        } catch (e) {}
    } else {
        // No content yet: ensure aria-busy is true and spinner is present
        if (installsEl) installsEl.setAttribute('aria-busy', 'true');
        try {
            if (installsEl && !installsEl.querySelector('.stat-loading')) {
                const i = document.createElement('i');
                i.className = 'fas fa-spinner fa-spin stat-loading';
                i.setAttribute('aria-hidden', 'true');
                // insert at start
                installsEl.insertBefore(i, installsEl.firstChild);
            }
        } catch (e) {}
    }
}

// Theme toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('theme-icon');
    const iconMobile = document.getElementById('theme-icon-mobile');
    if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    if (iconMobile) iconMobile.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    const button = document.getElementById('theme-toggle');
    const buttonMobile = document.getElementById('theme-toggle-mobile');
    if (button) button.setAttribute('aria-pressed', newTheme === 'dark');
    if (buttonMobile) buttonMobile.setAttribute('aria-pressed', newTheme === 'dark');

    // Update hero image for new theme
    updateHeroImageForTheme(newTheme);
}

// Accessibility: ensure skip link moves focus to main and announce
document.addEventListener('DOMContentLoaded', () => {
    const skip = document.querySelector('.skip-link');
    const main = document.getElementById('main-content');
    if (skip && main) {
        skip.addEventListener('click', (e) => {
            // allow anchor default behavior in case of keyboard navigation
            setTimeout(() => {
                main.focus({ preventScroll: false });
            }, 0);
        });
    }
});

// Initialize theme from localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    const iconMobile = document.getElementById('theme-icon-mobile');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    if (iconMobile) iconMobile.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    const button = document.getElementById('theme-toggle');
    const buttonMobile = document.getElementById('theme-toggle-mobile');
    if (button) button.setAttribute('aria-pressed', theme === 'dark');
    if (buttonMobile) buttonMobile.setAttribute('aria-pressed', theme === 'dark');

    // Set initial hero image
    updateHeroImageForTheme(theme);
}

// Respect user preference for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Image rotation
const lightImages = [
    'img/hero/homepage-light2.png',
    'img/hero/homepage-light3.png',
    'img/hero/homepage-light4.png',
    'img/hero/homepage-light5.png',
    'img/hero/homepage-light6.png',
    'img/hero/homepage-light7.png',
    'img/hero/homepage-light8.png',
    'img/hero/homepage-light9.png',
    'img/hero/homepage-light10.png',
    'img/hero/homepage-light11.png',
    'img/hero/homepage-light12.png',
    'img/hero/homepage-light13.png',
    'img/hero/homepage-light14.png',
    'img/hero/homepage-light15.png'
];

const darkImages = [
    'img/hero/homepage-dark2.png',
    'img/hero/homepage-dark3.png',
    'img/hero/homepage-dark4.png',
    'img/hero/homepage-dark5.png',
    'img/hero/homepage-dark6.png',
    'img/hero/homepage-dark7.png',
    'img/hero/homepage-dark8.png',
    'img/hero/homepage-dark9.png',
    'img/hero/homepage-dark10.png',
    'img/hero/homepage-dark11.png'
];

// Utility: shuffle an array (Fisher-Yates) and create shuffled copies for the carousel
function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

const shuffledLightImages = shuffleArray(lightImages);
const shuffledDarkImages = shuffleArray(darkImages);

let currentImageIndex = 0;
const heroImage = document.getElementById('hero-image');

function updateHeroImageForTheme(theme) {
    const images = theme === 'dark' ? shuffledDarkImages : shuffledLightImages;
    if (!images || images.length === 0) return;
    // Start at a random index so the carousel feels randomized on load/theme change
    currentImageIndex = Math.floor(Math.random() * images.length);
    const nextSrc = images[currentImageIndex];
    // Hide while loading
    heroImage.classList.add('hero-image-hidden');

    // Create a temporary Image to preload and detect load completion
    const tmp = new Image();
    tmp.src = nextSrc;
    tmp.onload = () => {
        heroImage.src = nextSrc;
        // reveal with fade
        heroImage.classList.remove('hero-image-hidden');
        heroImage.style.opacity = '1';
    };
    // If image is cached and already complete, trigger onload immediately
    if (tmp.complete) {
        tmp.onload();
    }
}

function rotateImage() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const images = theme === 'dark' ? shuffledDarkImages : shuffledLightImages;
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextSrc = images[currentImageIndex];
    
    // Fade out
    heroImage.style.opacity = '0';
    
    // Change src after fade out
    setTimeout(() => {
        heroImage.src = nextSrc;
        // Fade in when loaded
        heroImage.onload = () => {
            heroImage.style.opacity = '1';
        };
    }, 500); // Match transition duration
}

function initImageRotation() {
    // Only auto-rotate if the user hasn't requested reduced motion
    if (prefersReducedMotion) return;
    setInterval(rotateImage, 9000); // Rotate every 9 seconds
}

initTheme();

// If user prefers reduced motion, reveal a single hero image and skip rotation/parallax
if (prefersReducedMotion) {
    // Make sure hero image is shown (no carousel)
    try {
        if (heroImage) {
            heroImage.classList.remove('hero-image-hidden');
            heroImage.style.opacity = '1';
        }
    } catch (e) {}
} else {
    initImageRotation();
}

// Parallax Effect
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    
    // Move background shapes
    document.querySelectorAll('.parallax-shape').forEach(shape => {
        const speed = shape.getAttribute('data-speed') || 0.5;
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });

    // Move hero content elements
    document.querySelectorAll('[data-parallax]').forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Smooth parallax with requestAnimationFrame
let ticking = false;
window.addEventListener('scroll', () => {
    if (prefersReducedMotion) return; // skip parallax for motion-sensitive users
    if (!ticking) {
        window.requestAnimationFrame(() => {
            parallaxEffect();
            ticking = false;
        });
        ticking = true;
    }
});

// Feature cards parallax on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.addEventListener('DOMContentLoaded', () => {
    // Randomize extra features order on each page load
    try {
        const extraRow = document.querySelector('.extra-features .row');
        if (extraRow) {
            const items = Array.from(extraRow.children);
            const shuffled = shuffleArray(items);
            shuffled.forEach(item => extraRow.appendChild(item));
        }
    } catch (e) {
        // ignore if extra features not present
    }

    // Animate both feature-card and extra-feature-card with a stagger (skip if prefers reduced motion)
    const cards = document.querySelectorAll('.feature-card, .extra-feature-card');
    cards.forEach((card, index) => {
        if (prefersReducedMotion) {
            card.style.opacity = '1';
            card.style.transform = 'none';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.01}s`;
            observer.observe(card);
        }
    });
});

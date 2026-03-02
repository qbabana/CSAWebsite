// ═══════════════════════════════════════════
// PAGE ROUTING
// ═══════════════════════════════════════════

function navigatePage(page) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`page-${page}`).classList.add('active');
    
    // Update URL hash
    window.location.hash = page;
    
    // Update nav (only for pages with data-page attribute)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) {
        navLink.classList.add('active');
    } else if (['events','gallery','upcoming','past'].includes(page)) {
        // For events and its subpages, highlight the Events dropdown
        const eventsLink = document.querySelector('.nav-dropdown > .nav-link');
        if (eventsLink) {
            eventsLink.classList.add('active');
        }
    }
    
    // Close mobile menu
    closeMobileMenu();
}

// Handle hash changes
window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1) || 'home';
    navigatePage(page);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const initialPage = window.location.hash.slice(1) || 'home';
    navigatePage(initialPage);
    initializeStatCounters();
    initializeResourceCards();
    setupEventListeners();
    initializeLanguageToggle();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
});

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════

function closeMobileMenu() {
    document.querySelector('.hamburger').classList.remove('active');
    document.querySelector('.mobile-menu').classList.remove('active');
}

function toggleMobileMenu() {
    document.querySelector('.hamburger').classList.toggle('active');
    document.querySelector('.mobile-menu').classList.toggle('active');
}

document.querySelector('.hamburger').addEventListener('click', toggleMobileMenu);

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const page = link.getAttribute('data-page');
        if (page) {
            navigatePage(page);
        }
    });
});

// ═══════════════════════════════════════════
// DROPDOWN MENU
// ═══════════════════════════════════════════

function toggleDropdown(event) {
    event.preventDefault();
    const dropdownMenu = event.target.nextElementSibling;
    dropdownMenu.classList.toggle('active');
}

function toggleMobileDropdown(event) {
    event.preventDefault();
    const menu = event.target.nextElementSibling;
    if (menu && menu.classList.contains('mobile-dropdown-menu')) {
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    }
}

function closeDropdown() {
    // Close desktop dropdown menu
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    
    // Close mobile dropdown menu
    document.querySelectorAll('.mobile-dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}

// ═══════════════════════════════════════════
// MODAL HANDLING
// ═══════════════════════════════════════════

function openModal() {
    document.getElementById('join-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('join-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.querySelector('.join-form-state').style.display = 'block';
    document.querySelector('.thank-you-state').classList.remove('active');
    document.getElementById('join-form').reset();
}

// Open modal on button click
document.querySelectorAll('.btn-join').forEach(btn => {
    btn.addEventListener('click', openModal);
});

document.querySelector('.btn-join-hero').addEventListener('click', openModal);

// Close modal on close button
document.querySelector('.modal-close').addEventListener('click', closeModal);

// Close modal on outside click
document.getElementById('join-modal').addEventListener('click', (e) => {
    if (e.target.id === 'join-modal') {
        closeModal();
    }
});

// Handle form submission
document.getElementById('join-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show thank you state
    document.querySelector('.join-form-state').style.display = 'none';
    document.querySelector('.thank-you-state').classList.add('active');
});

// ═══════════════════════════════════════════
// STATISTICS COUNTER ANIMATION
// ═══════════════════════════════════════════

function initializeStatCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const startTime = Date.now();
    
    function update() {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
        } else {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// ═══════════════════════════════════════════
// LANGUAGE TOGGLE
// ═══════════════════════════════════════════

let currentLang = localStorage.getItem('lang') || 'en';

function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
    localStorage.setItem('lang', lang);
}

function initializeLanguageToggle() {
    const btn = document.querySelector('.btn-lang');
    if (!btn) return;
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        applyLanguage(currentLang);
    });
    applyLanguage(currentLang);
}

// ═══════════════════════════════════════════
// EVENT FILTERING
// ═══════════════════════════════════════════

function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter events
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.event-card, .signature-event-card').forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ═══════════════════════════════════════════
// RESOURCE CARDS EXPANSION
// ═══════════════════════════════════════════

function initializeResourceCards() {
    document.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', () => {
            const content = card.querySelector('.resource-content');
            content.classList.toggle('expanded');
        });
    });
}

// ═══════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// ═══════════════════════════════════════════
// KEYBOARD ACCESSIBILITY
// ═══════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

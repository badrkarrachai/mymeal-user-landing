document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('section');

    // Mobile Menu Toggle
    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    const indicator = document.querySelector('.nav-indicator');

    const updateIndicator = (activeLink) => {
        if (activeLink && indicator) {
            indicator.style.width = `${activeLink.offsetWidth}px`;
            indicator.style.left = `${activeLink.offsetLeft}px`;
        }
    };

    // Scroll Spy Logic
    const onScroll = () => {
        let currentSectionId = '';

        // Calculate which section is currently active
        // Using a threshold of 1/3 of viewport height for better UX
        const threshold = window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - threshold)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // If at top of page, force home active
        if (window.scrollY < 100) {
            currentSectionId = 'home';
        }

        let activeLink = null;

        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                activeLink = link;
            }
        });

        if (activeLink) {
            updateIndicator(activeLink);
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', onScroll);
    
    // Initial call to set active state on load
    onScroll();

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Language Switcher - Preserve Scroll Position (Senior Approach)
    const langLinks = document.querySelectorAll('.language-switcher .lang-link:not(.active)');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Store current scroll position
            sessionStorage.setItem('scrollPosition', window.scrollY);
            // Navigate
            window.location.href = link.getAttribute('href');
        });
    });

    // Restore Scroll Position on Load
    const storedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (storedScrollPosition) {
        // Restore position immediately
        window.scrollTo(0, parseInt(storedScrollPosition));
        // Clear storage
        sessionStorage.removeItem('scrollPosition');
    }

    // Update indicator on resize
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.main-nav a.active');
        if (activeLink && indicator) {
            indicator.style.transition = 'none';
            updateIndicator(activeLink);
            setTimeout(() => {
                indicator.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            }, 100);
        }
    });
});

/* FAQ Accordion */
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // Function to calculate and set height
    const setHeight = () => {
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    };

    // Initial check
    setHeight();

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
        setHeight();
    });

    // Update height on resize
    window.addEventListener('resize', () => {
        if (item.classList.contains('active')) {
             setHeight();
        }
    });
});

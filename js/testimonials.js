/**
 * Testimonials Carousel
 * Smooth, buttery animations with proper state management
 */
document.addEventListener('DOMContentLoaded', function() {
    // Testimonials Data
    // Testimonials Data
    let testimonials = [];
    
    try {
        const dataElement = document.getElementById('testimonials-data');
        if (dataElement) {
            testimonials = JSON.parse(dataElement.textContent);
        } else {
            console.error('Testimonials data not found in DOM');
        }
    } catch (e) {
        console.error('Error parsing testimonials data:', e);
    } // End of parsing logic

    // State
    let currentIndex = 2; // Start with middle testimonial
    let isTransitioning = false; // Prevent rapid clicks
    
    // Animation durations (should match CSS)
    const FADE_DURATION = 300;
    const TRANSITION_LOCK_DURATION = 500;

    // DOM Elements
    const avatarsContainer = document.getElementById('testimonial-avatars');
    const nameEl = document.getElementById('testimonial-name');
    const roleEl = document.getElementById('testimonial-role');
    const quoteEl = document.getElementById('testimonial-quote');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    /**
     * Initialize the carousel
     */
    function init() {
        renderAvatars();
        updateTextContent(currentIndex, false);
        setupEventListeners();
    }

    /**
     * Render all avatar elements
     */
    function renderAvatars() {
        avatarsContainer.innerHTML = '';
        
        testimonials.forEach((testimonial, index) => {
            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('avatar-item');
            avatarDiv.dataset.index = index;
            
            // Set initial position
            assignPositionClass(avatarDiv, index, currentIndex);
            
            // Avatar image
            const img = document.createElement('img');
            img.src = testimonial.image;
            img.alt = testimonial.name;
            img.loading = 'lazy';
            
            avatarDiv.appendChild(img);
            avatarsContainer.appendChild(avatarDiv);
            
            // Click handler
            avatarDiv.addEventListener('click', () => {
                if (!isTransitioning && index !== currentIndex) {
                    navigateTo(index);
                }
            });
        });
    }

    /**
     * Assign position class based on relative distance from center
     */
    function assignPositionClass(element, index, centerIndex) {
        const total = testimonials.length;
        
        // Remove all position classes
        element.classList.remove(
            'pos-center', 
            'pos-left', 
            'pos-right', 
            'pos-far-left', 
            'pos-far-right', 
            'pos-hidden'
        );
        
        // Calculate relative position (handling wraparound)
        let diff = index - centerIndex;
        
        // Normalize difference for circular navigation
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        
        // Assign appropriate class
        switch (diff) {
            case 0:
                element.classList.add('pos-center');
                break;
            case -1:
                element.classList.add('pos-left');
                break;
            case 1:
                element.classList.add('pos-right');
                break;
            case -2:
                element.classList.add('pos-far-left');
                break;
            case 2:
                element.classList.add('pos-far-right');
                break;
            default:
                element.classList.add('pos-hidden');
                break;
        }
    }

    /**
     * Update text content with fade animation
     */
    function updateTextContent(index, animate = true) {
        const testimonial = testimonials[index];
        
        if (!animate) {
            // Initial load - no animation
            nameEl.textContent = testimonial.name;
            roleEl.textContent = testimonial.role;
            quoteEl.textContent = testimonial.quote;
            return;
        }
        
        // Step 1: Fade out
        nameEl.classList.add('fade-out');
        roleEl.classList.add('fade-out');
        quoteEl.classList.add('fade-out');
        
        // Step 2: Update content after fade out
        setTimeout(() => {
            nameEl.textContent = testimonial.name;
            roleEl.textContent = testimonial.role;
            quoteEl.textContent = testimonial.quote;
            
            // Step 3: Fade in
            nameEl.classList.remove('fade-out');
            roleEl.classList.remove('fade-out');
            quoteEl.classList.remove('fade-out');
        }, FADE_DURATION);
    }

    /**
     * Navigate to specific index
     */
    function navigateTo(newIndex) {
        if (isTransitioning) return;
        
        // Normalize index for circular navigation
        if (newIndex < 0) {
            newIndex = testimonials.length - 1;
        } else if (newIndex >= testimonials.length) {
            newIndex = 0;
        }
        
        // Lock transitions
        isTransitioning = true;
        
        // Update current index
        currentIndex = newIndex;
        
        // Update avatar positions
        const avatarElements = document.querySelectorAll('.avatar-item');
        avatarElements.forEach((el, idx) => {
            assignPositionClass(el, idx, currentIndex);
        });
        
        // Update text with fade
        updateTextContent(currentIndex, true);
        
        // Unlock after transition completes
        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_LOCK_DURATION);
    }

    /**
     * Navigate to previous testimonial
     */
    function navigatePrev() {
        navigateTo(currentIndex - 1);
    }

    /**
     * Navigate to next testimonial
     */
    function navigateNext() {
        navigateTo(currentIndex + 1);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Button clicks
        btnPrev.addEventListener('click', navigatePrev);
        btnNext.addEventListener('click', navigateNext);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navigatePrev();
            } else if (e.key === 'ArrowRight') {
                navigateNext();
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        avatarsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        avatarsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) {
                    // Swipe left - go next
                    navigateNext();
                } else {
                    // Swipe right - go prev
                    navigatePrev();
                }
            }
        }
    }

    // Initialize
    init();
});

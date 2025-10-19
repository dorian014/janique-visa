document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    const progressDotsContainer = document.getElementById('progress-dots');
    let currentSlide = 0;

    // Format slide number with leading zero
    function formatSlideNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // Create progress dots
    function createProgressDots() {
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.className = 'progress-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
            progressDotsContainer.appendChild(dot);
        });
    }

    // Update progress dots
    function updateProgressDots() {
        const dots = progressDotsContainer.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Show specific slide with direction
    function showSlide(index, direction = 'none') {
        // Ensure index is within bounds
        if (index < 0 || index >= slides.length) return;

        const previousSlide = slides[currentSlide];
        const nextSlide = slides[index];

        // Remove all transition classes
        slides.forEach(slide => {
            slide.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
        });

        if (direction === 'forward') {
            previousSlide?.classList.add('slide-out-left');
            nextSlide.classList.remove('hidden');
            nextSlide.classList.add('slide-in-right');
        } else if (direction === 'backward') {
            previousSlide?.classList.add('slide-out-right');
            nextSlide.classList.remove('hidden');
            nextSlide.classList.add('slide-in-left');
        } else {
            // Simple fade for dot navigation
            slides.forEach((slide, i) => {
                slide.classList.toggle('hidden', i !== index);
            });
        }

        // Hide previous slide after animation
        setTimeout(() => {
            slides.forEach((slide, i) => {
                if (i !== index) {
                    slide.classList.add('hidden');
                }
            });
        }, 400);

        // Update button states
        prevButton.disabled = index === 0;
        nextButton.disabled = index === slides.length - 1;

        // Add a class to the body for slide-specific styling if needed
        document.body.dataset.currentSlide = index;

        // Update slide counter with formatted numbers
        currentSlideElement.textContent = formatSlideNumber(index + 1);

        // Update progress dots
        updateProgressDots();
    }

    // Navigation button handlers
    nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide, 'forward');
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide, 'backward');
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && !nextButton.disabled) {
            nextButton.click();
        } else if (e.key === 'ArrowLeft' && !prevButton.disabled) {
            prevButton.click();
        }
    });

    // Initialize
    totalSlidesElement.textContent = formatSlideNumber(slides.length);
    createProgressDots();
    showSlide(currentSlide);
});
document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    const progressDotsContainer = document.getElementById('progress-dots');
    let currentSlide = 0;

    // Create particle effect
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random positioning
            particle.style.left = Math.random() * 100 + '%';

            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Random animation
            const animationType = Math.random() > 0.5 ? 'floatUp' : 'floatDiagonal';
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 20;

            particle.style.animation = `${animationType} ${duration}s linear ${delay}s infinite`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;

            particlesContainer.appendChild(particle);
        }
    }

    // Initialize particles
    createParticles();

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
            slide.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right', 'fade-in', 'fade-out');
        });

        if (direction === 'forward') {
            // Scale out to the left, scale in from the right
            previousSlide?.classList.add('slide-out-left');
            nextSlide.classList.remove('hidden');
            nextSlide.classList.add('slide-in-right');
        } else if (direction === 'backward') {
            // Scale out to the right, scale in from the left
            previousSlide?.classList.add('slide-out-right');
            nextSlide.classList.remove('hidden');
            nextSlide.classList.add('slide-in-left');
        } else {
            // Crossfade for dot navigation
            if (previousSlide && previousSlide !== nextSlide) {
                previousSlide.classList.add('fade-out');
            }
            nextSlide.classList.remove('hidden');
            nextSlide.classList.add('fade-in');
        }

        // Hide previous slide after animation completes
        setTimeout(() => {
            slides.forEach((slide, i) => {
                if (i !== index) {
                    slide.classList.add('hidden');
                    slide.classList.remove('fade-out', 'slide-out-left', 'slide-out-right');
                }
            });
        }, 600); // Match the subtle transition animation duration

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

    // Typewriter effect for titles
    function typewriterEffect(element, text, speed = 50) {
        element.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Number counter animation
    function animateCounter(element, start, end, duration) {
        const startTime = Date.now();
        const range = end - start;

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + range * easeOutQuart);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end.toLocaleString();
            }
        }
        update();
    }

    // Apply animations to specific slides
    function applySlideAnimations(index) {
        const currentSlideElement = slides[index];

        // Typewriter for title slide
        if (index === 0) {
            const taglines = currentSlideElement.querySelectorAll('.tagline-text');
            taglines.forEach((tag, i) => {
                setTimeout(() => {
                    tag.style.opacity = '0';
                    tag.style.animation = 'fadeInUp 0.6s ease forwards';
                }, i * 200);
            });
        }

        // Counter animations for slide 2 (The Challenge & Opportunity)
        if (index === 1) {
            const counters = currentSlideElement.querySelectorAll('.counter-animation');
            counters.forEach((counter, i) => {
                const targetValue = parseInt(counter.dataset.value);
                const suffix = counter.dataset.suffix || '';
                const startValue = 100; // Start from 100

                // Reset to 100 and animate down to target
                counter.textContent = startValue + suffix;
                setTimeout(() => {
                    const duration = 1500; // Animation duration in ms
                    const startTime = Date.now();

                    function updateCounter() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        // Count down from 100 to target value
                        const current = Math.floor(startValue - (startValue - targetValue) * easeOutQuart);

                        counter.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = targetValue + suffix;
                        }
                    }
                    updateCounter();
                }, 300 + (i * 200)); // Stagger the animations
            });
        }

        // Counter animations for KPIs slide
        if (currentSlideElement.id === 'marketing-kpis') {
            const kpiCounters = currentSlideElement.querySelectorAll('.kpi-counter');
            kpiCounters.forEach((counter, i) => {
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';

                // Reset to 0
                counter.textContent = '0';

                setTimeout(() => {
                    const duration = 1500;
                    const startTime = Date.now();

                    function updateCounter() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(target * easeOutQuart);

                        counter.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + suffix;
                        }
                    }
                    updateCounter();
                }, 300 + (i * 150)); // Stagger the animations
            });
        }
    }

    // Modify showSlide to include animation triggers
    const originalShowSlide = showSlide;
    showSlide = function(index, direction = 'none') {
        originalShowSlide(index, direction);
        setTimeout(() => applySlideAnimations(index), 100);
    };

    // Initialize
    totalSlidesElement.textContent = formatSlideNumber(slides.length);
    createProgressDots();
    showSlide(currentSlide);
});
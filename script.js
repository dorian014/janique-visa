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
        }, 900); // Match the liquid morph animation duration

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

        // Counter animations for KPIs slide
        if (currentSlideElement.id === 'marketing-kpis') {
            const counters = [
                { selector: 'strong:contains("250K")', value: 250000 },
                { selector: 'strong:contains("35%")', value: 35 },
                { selector: 'strong:contains("75%")', value: 75 },
                { selector: 'strong:contains("20")', value: 20 }
            ];

            // Find and animate counters
            const listItems = currentSlideElement.querySelectorAll('li');
            listItems.forEach(li => {
                const text = li.textContent;
                if (text.includes('250K')) {
                    const strong = li.querySelector('strong');
                    if (strong) {
                        strong.textContent = '0';
                        setTimeout(() => animateCounter(strong, 0, 250, 2000), 500);
                        setTimeout(() => strong.textContent += 'K new app downloads', 2500);
                    }
                } else if (text.includes('+35%')) {
                    const strong = li.querySelector('strong');
                    if (strong) {
                        strong.textContent = '+0%';
                        setTimeout(() => {
                            const span = document.createElement('span');
                            span.textContent = '+';
                            strong.textContent = '';
                            strong.appendChild(span);
                            const num = document.createElement('span');
                            num.textContent = '0';
                            strong.appendChild(num);
                            animateCounter(num, 0, 35, 1500);
                            setTimeout(() => strong.textContent = '+35%', 1600);
                        }, 600);
                    }
                }
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
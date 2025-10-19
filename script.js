document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    let currentSlide = 0;

    // Set total slides count
    totalSlidesElement.textContent = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('hidden', i !== index);
        });
        prevButton.disabled = index === 0;
        nextButton.disabled = index === slides.length - 1;
        // Add a class to the body for slide-specific styling if needed
        document.body.dataset.currentSlide = index;

        // Update slide counter
        currentSlideElement.textContent = index + 1;
    }

    nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextButton.click();
        } else if (e.key === 'ArrowLeft') {
            prevButton.click();
        }
    });

    showSlide(currentSlide);
});
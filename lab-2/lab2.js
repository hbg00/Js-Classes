const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const playPauseBtn = document.querySelector('.play-pause');

let slideIndex = 0;
let autoPlay = true;
let autoPlayInterval;
let isAutoPlaying = false;
let direction = 1;

slides.forEach((slide, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dotsContainer.appendChild(dot);
    dot.addEventListener('click', () => {
        slideIndex = index;
        updateSlider();
    });
});

const dots = document.querySelectorAll('.dot');

updateSlider();

prevBtn.addEventListener('click', () => {
    clearInterval(autoPlayInterval);
    isAutoPlaying = false;
    playPauseBtn.innerHTML = '&#9658;';

    slideIndex = (slideIndex === 0) ? slides.length - 1 : slideIndex - 1;
    updateSlider();
});

nextBtn.addEventListener('click', () => {
    clearInterval(autoPlayInterval);
    isAutoPlaying = false;
    playPauseBtn.innerHTML = '&#9658;';

    slideIndex = (slideIndex === slides.length - 1) ? 0 : slideIndex + 1;
    updateSlider();
});

playPauseBtn.addEventListener('click', () => {
    if (isAutoPlaying) {
        clearInterval(autoPlayInterval);
        isAutoPlaying = false;
        playPauseBtn.innerHTML = '&#9658;';
    } else {
        autoPlayInterval = setInterval(() => {
            slideIndex = (slideIndex + direction + slides.length) % slides.length;
            updateSlider();
        }, 3000);
        isAutoPlaying = true;
        playPauseBtn.innerHTML = '&#10074;&#10074;';
    }
});

function updateSlider() {
    const translateValue = `translateX(-${slideIndex * 100}%)`;
    document.querySelector('.slider').style.transform = translateValue;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

if (autoPlay) {
    autoPlayInterval = setInterval(() => {
        slideIndex = (slideIndex + direction + slides.length) % slides.length;
        updateSlider();
    }, 3000);
    isAutoPlaying = true;
    playPauseBtn.innerHTML = '&#10074;&#10074;'; 
}
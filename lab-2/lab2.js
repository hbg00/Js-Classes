    // JavaScript for Slider
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const playPauseBtn = document.querySelector('.play-pause');
    
    let slideIndex = 0;
    let autoPlay = true;
    let autoPlayInterval;
    
    // Add dots
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
    
    // Initialize slider
    updateSlider();
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
      slideIndex = (slideIndex === 0) ? slides.length - 1 : slideIndex - 1;
      updateSlider();
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
      slideIndex = (slideIndex === slides.length - 1) ? 0 : slideIndex + 1;
      updateSlider();
    });
    
    // Play/Pause button click
    playPauseBtn.addEventListener('click', () => {
      if (autoPlay) {
        autoPlay = false;
        playPauseBtn.innerHTML = '&#9658;';
        clearInterval(autoPlayInterval);
      } else {
        autoPlay = true;
        playPauseBtn.innerHTML = '&#10074;&#10074;';
        autoPlayInterval = setInterval(() => {
          slideIndex = (slideIndex === slides.length - 1) ? 0 : slideIndex + 1;
          updateSlider();
        }, 3000);
      }
    });
  
    // Click on Play/Pause button to restart slider
    playPauseBtn.addEventListener('click', () => {
      slideIndex = 0;
      updateSlider();
    });
    
    // Function to update slider
    function updateSlider() {
      slider.style.transform = `translateX(-${slideIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
      });
    }
  
    // Set initial state of play/pause button
    playPauseBtn.innerHTML = autoPlay ? '&#10074;&#10074;' : '&#9658;';
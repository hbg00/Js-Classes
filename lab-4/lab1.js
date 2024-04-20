const openButton = document.querySelector('#note-open-form');
const closeButton = document.querySelector('#note-close-form');
const addNoteModalWrapper = document.querySelector('.note-form-wrapper');

openButton.addEventListener('click', ()=>{
    changeVisibility();
});

closeButton.addEventListener('click', () => {
    changeVisibility();
});

function changeVisibility(){
    addNoteModalWrapper.classList.toggle('hidden');
}
// Declaration/Setup Section
const openWindowBtn = document.querySelector('.openCreateWindow');
const closeWindowBtn = document.querySelector('.closeCreateWindow');
const createNote = document.querySelector('.createNote');
const titleNote = document.querySelector('.titleNote');

const form = document.querySelector('.noteForm');
const titleInput = document.querySelector('#titleNote');
const descriptionInput = document.querySelector('#descriptionNote');
const pinInput = document.querySelector('#pinCheckbox');
const colorInput = document.querySelector('#colorNote');
const tagsInput = document.querySelector('#tagsNote');
const reminderDateInput = document.querySelector('#reminderDateNote');
const dateInput = document.querySelector('#dateNote');

const submitFormBtn = document.querySelector('.submitForm');

const activeSection = document.querySelector('.activeNotesSection');
const archivedSection = document.querySelector('.archivedNotesSection');

const archiveBtn = document.querySelector('.archiveButton');

const filterInput = document.querySelector('#search');

const maxNoteNumber = 6;
let isInEditMode = false;
let nodeIdForUpdate = -1;

////////////////////////////////////////////////////////////////////////////


// Event Listeners
openWindowBtn.addEventListener('click', changeVisibilityOn);
closeWindowBtn.addEventListener('click', changeVisibilityOff);

form.addEventListener('submit', () => {
    if(isInEditMode){
        updateAlreadyExistsNote(nodeIdForUpdate);
    }
    else{
        createNewNote();
    }
    form.reset();
});

filterInput.addEventListener('input', () => {
    const text = filterInput.value.toLowerCase();
    const filteredNotes = filterNotesBySearchText(text);
    updateNotesView(filteredNotes);
});

////////////////////////////////////////////////////////////////////////////


// Loading notes on start
function loadNotesFromLocalStorage() {
    const notesInMemoryDb = getNotesFromLocalStorage();
    for(const noteId in notesInMemoryDb){
        if(notesInMemoryDb.hasOwnProperty(noteId)){
            addNoteToSpecificPlace(noteId, notesInMemoryDb[noteId]);
        }
    }
}

loadNotesFromLocalStorage();

////////////////////////////////////////////////////////////////////////////


// Access for localStorage
function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notesInMemoryDb')) || {};
}

////////////////////////////////////////////////////////////////////////////


// Visibility Functions
function changeVisibilityOn() {
    createNote.style.visibility = "visible";
}

function changeVisibilityOff() {
    createNote.style.visibility = "hidden";
    titleNote.innerText = 'Create Note';
    submitFormBtn.value = 'Create Note'
    form.reset();
}

////////////////////////////////////////////////////////////////////////////



// Function that handle placing of Note
function addNoteToSpecificPlace(noteId, note) {
    const newNote = document.createElement('div');
    newNote.className = 'note';
    newNote.id = noteId;
    newNote.style.backgroundColor = note.color;

    newNote.innerHTML = `
        <div class="noteHeader">
            <h4>${note.title}</h4>
            <button class="archiveButton" onclick="archiveHandler('${noteId}')">
                 <i class="fa ${note.archived ? 'fa-folder-open' : 'fa-folder'}"></i>
            </button>
        </div>
        <p>${note.description}</p>
        <p><strong>Tags:</strong> ${note.tags.join(', ')}</p>
        <p><strong>Date:</strong> ${note.date}</p>
        <button class="updateButton" onclick="updateNoteView('${noteId}')">Update</button>
        <button class="deleteButton" onclick="deleteNote('${noteId}')">Delete</button>
    `;

    if(note.pin){
        activeSection.insertBefore(newNote, activeSection.firstChild);
    } 
    else{
        if(note.archived){
            archivedSection.appendChild(newNote);
        } 
        else{
            activeSection.appendChild(newNote);
        }
    }
}
////////////////////////////////////////////////////////////////////////////


// Setting up update window
function updateNoteView(noteId) {
    var notesInMemoryDb = getNotesFromLocalStorage();
    var note = notesInMemoryDb[noteId];
    titleNote.innerHTML = 'Update note';
    submitFormBtn.value = 'Update note';

    titleInput.value = note.title ? note.title : '';
    descriptionInput.value = note.description ? note.description : '';
    pinInput.checked = note.pin ? note.pin : false;
    tagsInput.value = note.tags ? note.tags.join(' ') : '';
    colorInput.value = note.color ? note.color : '#6E3030';
    dateInput.value = note.date ? note.date : '';

    isInEditMode = true;
    nodeIdForUpdate = noteId;
    changeVisibilityOn();
}

////////////////////////////////////////////////////////////////////////////


// CRUD operations
function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notesInMemoryDb', JSON.stringify(notes));
}

function createNewNote() {
    const notesInMemoryDb = getNotesFromLocalStorage();
    const count = Object.keys(notesInMemoryDb).length;

    if(maxNoteNumber > count){
        const note = {
            title: titleInput.value,
            description: descriptionInput.value,
            archived: false,
            pin: pinInput.checked,
            color: colorInput.value === '#000000'? '#6E3030' : colorInput.value ,
            tags: tagsInput.value.split(' '),
            date: dateInput.value
        };
        const noteId = `note${count + 1}`;
        notesInMemoryDb[noteId] = note;

        saveNotesToLocalStorage(notesInMemoryDb);
        addNoteToSpecificPlace(noteId, note);
        changeVisibilityOff();
    }
    else{
        alert('You have reached the maximum amount of notes.')
    }
}

function updateAlreadyExistsNote(noteId) {
    var notesInMemoryDb = getNotesFromLocalStorage();
    var note = notesInMemoryDb[noteId];

    note = {
        title: titleInput.value,
        description: descriptionInput.value,
        pin: pinInput.checked,
        color: colorInput.value === '#000000' ? '#6E3030' : colorInput.value,
        tags: tagsInput.value.split(' '),
        date: dateInput.value
    };

    notesInMemoryDb[noteId] = note;

    saveNotesToLocalStorage(notesInMemoryDb);

    nodeIdForUpdate = -1;
    changeVisibilityOff();
}

function deleteNote(noteId) {
    const note = document.getElementById(noteId);
    if(note){
        note.remove();
        const notesInMemoryDb = getNotesFromLocalStorage();
        delete notesInMemoryDb[noteId];
        saveNotesToLocalStorage(notesInMemoryDb);
    }
}

////////////////////////////////////////////////////////////////////////////


// Filter Section

function filterNotesBySearchText(searchText) {
    const notes = getNotesFromLocalStorage();
    const filteredNotes = {};

    for (const noteId in notes){
        if(notes.hasOwnProperty(noteId)){
            const note = notes[noteId];
            const titleMatches = note.title.toLowerCase().includes(searchText);
            const descriptionMatches = note.description.toLowerCase().includes(searchText);
            const tagsMatches = note.tags.some(tag => tag.toLowerCase().includes(searchText));
            const dateMatches = note.date.includes(searchText);

            if(titleMatches || descriptionMatches || tagsMatches || dateMatches){
                filteredNotes[noteId] = note;
            }
        }
    }

    return filteredNotes;
}

function updateNotesView(notes) {
    activeSection.innerHTML = '';
    archivedSection.innerHTML = '';

    for (const noteId in notes){
        if (notes.hasOwnProperty(noteId)){
            const note = notes[noteId];
            addNoteToSpecificPlace(noteId, note);
        }
    }
}

////////////////////////////////////////////////////////////////////////////


// Archive Handler
function archiveHandler(noteId) {
    const notesInMemoryDb = getNotesFromLocalStorage();
    const note = notesInMemoryDb[noteId];

    if (note){
        note.archived = !note.archived;
        saveNotesToLocalStorage(notesInMemoryDb);
        updateNotesView(getNotesFromLocalStorage());
    }
}

////////////////////////////////////////////////////////////////////////////
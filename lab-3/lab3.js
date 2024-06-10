// Declaration/Setup Section
const overrideCheckBox = document.querySelector('#overrideCheckboxId');
const bpmInput = document.querySelector('#bpmInput');
const tracksRecordingOptions = document.querySelector('#tracksRecordingOptions');
const tracksSection = document.querySelector('.tracks');

let override = false;
let isRecording = false;
let currentTrack = 'track1';
let intervalId = null;
let isMetronomeOn = false;
let maxTrackCount = 5;

const sounds = {
    'q': document.querySelector('#s1'),
    'w': document.querySelector('#s2'),
    'e': document.querySelector('#s3'),
    'r': document.querySelector('#s4')
};

const recordedTracks = {
    'track1': {bpm: 60, sounds: []}
};

/////////////////////////////////////////////////////

// Helpers Section
function getSelectedValue() {
    currentTrack = tracksRecordingOptions.value;
}

function changingOverride(){
    override = overrideCheckBox.checked;
}
/////////////////////////////////////////////////////


// Metronome section
function toggleMetronome() {
    isMetronomeOn = !isMetronomeOn;
    if (isMetronomeOn){
        startMetronome();
    }else{
        stopMetronome();
    }
}

function startMetronome() {
    intervalId = setInterval(() => {
    }, 60000 / recordedTracks[currentTrack].bpm);
}

function stopMetronome() {
    clearInterval(intervalId);
}

function setBPM() {
    const newBPM = parseInt(bpmInput.value);
    if (!isNaN(newBPM) && newBPM > 0){
        recordedTracks[currentTrack].bpm = newBPM;
        if (isMetronomeOn) {
            stopMetronome();
            startMetronome();
        }
    }else{
        alert('Please enter a valid positive BPM value.');
    }
}
/////////////////////////////////////////////////////


// Recording section
function startRecording() {
    changingOverride();
    isRecording = true;
    if (override) {
        recordedTracks[currentTrack].sounds = [];
    }
    getSelectedValue();
}

function stopRecording() {
    isRecording = false;
}

/////////////////////////////////////////////////////


// Tracks Section
document.addEventListener('keypress', (ev) => {
    const key = ev.key.toLowerCase();
    const sound = sounds[key];
    if (sound) {
        if (isRecording) {
            recordedTracks[currentTrack].sounds.push(key);
        }
        sound.currentTime = 0;
        sound.play();
    }
});

function playTrack(track) {
    const trackData = recordedTracks[track];
    const trackBPM = trackData.bpm;
    const trackSounds = trackData.sounds;

    if (trackSounds.length === 0) return;

    let time = 0;
    const interval = 60000 / trackBPM; 

    trackSounds.forEach(soundKey => {
        setTimeout(() => {
            const sound = sounds[soundKey];
            sound.currentTime = 0;
            sound.play();
        }, time);
        time += interval; 
    });
}

function playTracks() {
    const selectedCheckBoxes = document.querySelectorAll('.selectToPlay:checked');
    selectedCheckBoxes.forEach(checkbox => {
        playTrack(checkbox.id);
    });
};
/////////////////////////////////////////////////////


// Creating/Deleting section
function createTrack(){
    const count = Object.keys(recordedTracks).length;
    if(count < maxTrackCount){
        const trackName = `track${count + 1}`;
        recordedTracks[trackName] = { bpm: 60, sounds: [] };

        const option = document.createElement('option');
        option.value = trackName;
        option.textContent = `Track ${count + 1}`;
        tracksRecordingOptions.appendChild(option);

        const div = document.createElement('div');
        div.id = `div-${trackName}`;

        const label = document.createElement('label');
        label.setAttribute('for', trackName);
        label.textContent = `Track ${count + 1}`;
        div.appendChild(label);

        const input = document.createElement('input');
        input.id = trackName;
        input.classList.add('selectToPlay');
        input.type = 'checkbox';
        div.appendChild(input);

        const br = document.createElement('br');
        div.appendChild(br);

        const button = document.createElement('button');
        button.id = `delete-${trackName}`;
        button.textContent = 'Delete Track';
        button.onclick = () => deleteTrack(trackName);
        div.appendChild(button);

        tracksSection.appendChild(div);
    } else {
        alert('You have reached the maximum amount of tracks.');
    }
}

function deleteTrack(trackName){
    delete recordedTracks[trackName];

    const optionToRemove = document.querySelector(`#tracksRecordingOptions option[value="${trackName}"]`);
    if (optionToRemove) {
        optionToRemove.remove();
    }

    const divToRemove = document.getElementById(`div-${trackName}`);
    if (divToRemove) {
        divToRemove.remove();
    }
}
/////////////////////////////////////////////////////

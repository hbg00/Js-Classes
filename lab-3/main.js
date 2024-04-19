let isRecording = false;
let currentTrack = 'track1';

const sounds = {
    'q': document.querySelector('#s1'),
    'w': document.querySelector('#s2'),
    'e': document.querySelector('#s3'),
    'r': document.querySelector('#s4')
};

const recordedTracks = {
    'track1': [],
    'track2': [],
    'track3': [],
    'track4': []
};

document.addEventListener('keypress', (ev) => {
    const key = ev.key.toLowerCase();
    const sound = sounds[key];
    if (sound) {
        if (isRecording) {
            recordedTracks[currentTrack].push(key);
        }
        sound.currentTime = 0;
        sound.play();
    }
});

function startRecording() {
    isRecording = true;
    getSelectedValue();
}

function stopRecording() {
    isRecording = false;
}

function playTrack(key) {
    const track = recordedTracks[key];
    if (track.length === 0) return;

    track.forEach((soundKey, index) => {
        setTimeout(() => {
            const sound = sounds[soundKey];
            sound.currentTime = 0;
            sound.play();
        }, index * 500);
    });
}

function playAllTracks() {
    Object.keys(recordedTracks).forEach(track => {
        playTrack(track);
    });
}

function getSelectedValue() {
    const selectElement = document.getElementById("tracksRecordingOptions");
    currentTrack = selectElement.value;
}


let timeDisplay = document.getElementById('time');
let alarmTimeInput = document.getElementById('alarmTime');
let setAlarmButton = document.getElementById('setAlarm');
let stopAlarmButton = document.getElementById('stopAlarm');
let alarmStatus = document.getElementById('alarmStatus');
let clockContainer = document.getElementById('clockContainer');

let alarmTime = null;
let isAlarmRinging = false;

function updateTime() {
    let now = new Date();
    let timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    timeDisplay.textContent = timeString;

    if(alarmTime && !isAlarmRinging) {
        let currentTime = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        });
        if(currentTime === alarmTime) {
            startAlarm();
        }
    }
}

function startAlarm() {
    isAlarmRinging = true;
    clockContainer.classList.add('ringing');
    stopAlarmButton.style.display = 'inline-block';
    setAlarmButton.style.display = 'none';
    playAlarm();
}

function playAlarm() {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.5;

    oscillator.start();

    setTimeout(function() {
        oscillator.stop();
        if (isAlarmRinging) {
            setTimeout(playAlarm, 1000);
        }
    }, 1000);
}

function stopAlarm() {
    isAlarmRinging = false;
    clockContainer.classList.remove('ringing');
    stopAlarmButton.style.display = 'none';
    setAlarmButton.style.display = 'inline-block';
    alarmStatus.textContent = '';
    alarmTime = null;
    alarmTimeInput.value = '';
}

function setAlarm() {
    if (alarmTimeInput.value) {
        alarmTime = alarmTimeInput.value;

        let tmpDate = new Date();
        let [hours, minutes] = alarmTime.split(':');
            tmpDate.setHours(parseInt(hours));
            tmpDate.setMinutes(parseInt(minutes));
                
        let alarmTimeDisplay = tmpDate.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
        });

        alarmStatus.textContent = 'Alarm set for ' + alarmTime;
    }
}

setAlarmButton.addEventListener('click', setAlarm);
stopAlarmButton.addEventListener('click', stopAlarm);

setInterval(updateTime, 1000);
updateTime();
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startStopBtn = document.getElementById('startStopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapsList = document.getElementById('lapsList');
    const progressCircle = document.querySelector('.ring-circle');
    
    // Variables
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapTimes = [];
    const circumference = 283; // 2 * π * r (where r is 45 in our SVG)
    
    // Event Listeners
    startStopBtn.addEventListener('click', toggleStartStop);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);
    
    // Functions
    function toggleStartStop() {
        if (isRunning) {
            stopStopwatch();
            startStopBtn.textContent = 'Start';
            startStopBtn.classList.remove('start-btn');
            startStopBtn.classList.add('reset-btn');
        } else {
            startStopwatch();
            startStopBtn.textContent = 'Stop';
            startStopBtn.classList.remove('reset-btn');
            startStopBtn.classList.add('start-btn');
        }
    }
    
    function startStopwatch() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateTime, 10);
            isRunning = true;
            lapBtn.disabled = false;
        }
    }
    
    function stopStopwatch() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            lapBtn.disabled = true;
        }
    }
    
    function resetStopwatch() {
        stopStopwatch();
        elapsedTime = 0;
        updateDisplay(0, 0, 0, 0);
        lapsList.innerHTML = '';
        lapTimes = [];
        updateProgressCircle(0);
    }
    
    function updateTime() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        
        const milliseconds = Math.floor(elapsedTime % 1000 / 10);
        const seconds = Math.floor(elapsedTime / 1000) % 60;
        const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        
        updateDisplay(hours, minutes, seconds, milliseconds);
        
        // Update progress circle (for seconds)
        const progress = (seconds / 60) * circumference;
        updateProgressCircle(progress);
    }
    
    function updateDisplay(hours, minutes, seconds, milliseconds) {
        hoursDisplay.textContent = padTime(hours);
        minutesDisplay.textContent = padTime(minutes);
        secondsDisplay.textContent = padTime(seconds);
        millisecondsDisplay.textContent = padTime(milliseconds, true);
    }
    
    function padTime(time, isMilliseconds = false) {
        return time.toString().padStart(isMilliseconds ? 2 : 2, '0');
    }
    
    function updateProgressCircle(progress) {
        progressCircle.style.strokeDashoffset = circumference - progress;
    }
    
    function recordLap() {
        if (isRunning) {
            const currentTime = Date.now();
            const lapTime = currentTime - startTime;
            
            const lapObject = {
                time: lapTime,
                display: formatLapTime(lapTime)
            };
            
            lapTimes.unshift(lapObject);
            renderLaps();
            
            // Add visual feedback
            lapBtn.classList.add('active');
            setTimeout(() => {
                lapBtn.classList.remove('active');
            }, 200);
        }
    }
    
    function formatLapTime(time) {
        const milliseconds = Math.floor(time % 1000 / 10);
        const seconds = Math.floor(time / 1000) % 60;
        const minutes = Math.floor(time / (1000 * 60)) % 60;
        const hours = Math.floor(time / (1000 * 60 * 60));
        
        return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}.${padTime(milliseconds, true)}`;
    }
    
    function renderLaps() {
        lapsList.innerHTML = '';
        
        lapTimes.forEach((lap, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.textContent = `Lap ${lapTimes.length - index}`;
            
            const lapTimeDisplay = document.createElement('span');
            lapTimeDisplay.textContent = lap.display;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTimeDisplay);
            lapsList.appendChild(lapItem);
        });
    }
    
    // Initialize
    lapBtn.disabled = true;
    updateProgressCircle(0);
});
const display = document.getElementById('timer-display');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const pomodoroButton = document.getElementById('pomodoro-button');
const shortBreakButton = document.getElementById('short-break-button');
const longBreakButton = document.getElementById('long-break-button');
const ringProgress = document.querySelector('.timer__ring-progress');
const statusText = document.getElementById('status-text');

const RING_LENGTH = 339.292;
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let intervalId = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateDisplay = () => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = totalSeconds === 0 ? 0 : remainingSeconds / totalSeconds;
  ringProgress.style.strokeDashoffset = `${RING_LENGTH * (1 - progress)}`;
};

const readInputs = () => {
  const minutes = clamp(parseInt(minutesInput.value, 10) || 0, 0, 120);
  const seconds = clamp(parseInt(secondsInput.value, 10) || 0, 0, 59);
  minutesInput.value = minutes;
  secondsInput.value = seconds;
  totalSeconds = minutes * 60 + seconds;
  remainingSeconds = totalSeconds;
  updateDisplay();
};

const setPreset = (minutes, seconds = 0) => {
  minutesInput.value = minutes;
  secondsInput.value = seconds;
  resetTimer();
};

const tick = () => {
  if (remainingSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = 'Start';
    statusText.textContent = 'Done';
    return;
  }
  remainingSeconds -= 1;
  updateDisplay();
};

const startTimer = () => {
  if (intervalId) {
    return;
  }
  if (remainingSeconds === 0) {
    readInputs();
  }
  if (totalSeconds === 0) {
    statusText.textContent = 'Set Time';
    return;
  }
  intervalId = setInterval(tick, 1000);
  startButton.textContent = 'Running';
  statusText.textContent = 'Focus';
};

const pauseTimer = () => {
  if (!intervalId) {
    return;
  }
  clearInterval(intervalId);
  intervalId = null;
  startButton.textContent = 'Start';
  statusText.textContent = 'Paused';
};

const resetTimer = () => {
  pauseTimer();
  readInputs();
  statusText.textContent = 'Ready';
};

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
minutesInput.addEventListener('change', resetTimer);
secondsInput.addEventListener('change', resetTimer);
pomodoroButton.addEventListener('click', () => setPreset(25));
shortBreakButton.addEventListener('click', () => setPreset(5));
longBreakButton.addEventListener('click', () => setPreset(15));

updateDisplay();

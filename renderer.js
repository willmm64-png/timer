const display = document.getElementById('timer-display');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const ringProgress = document.querySelector('.timer__ring-progress');

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

const tick = () => {
  if (remainingSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = 'Start';
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
  intervalId = setInterval(tick, 1000);
  startButton.textContent = 'Running';
};

const pauseTimer = () => {
  if (!intervalId) {
    return;
  }
  clearInterval(intervalId);
  intervalId = null;
  startButton.textContent = 'Start';
};

const resetTimer = () => {
  pauseTimer();
  readInputs();
};

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
minutesInput.addEventListener('change', resetTimer);
secondsInput.addEventListener('change', resetTimer);

updateDisplay();

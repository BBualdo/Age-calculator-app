const startingDay = document.querySelector('.js-day-input');
const startingMonth = document.querySelector('.js-month-input');
const startingYear = document.querySelector('.js-year-input');
// selects inputs
const dayError = document.querySelector('.js-day-error');
const monthError = document.querySelector('.js-month-error');
const yearError = document.querySelector('.js-year-error');
// selects error paragraphs
const dayLabel = document.getElementById('day');
const monthLabel = document.getElementById('month');
const yearLabel = document.getElementById('year');
// selects labels to color them later

const calculateButton = document.querySelector('button');

calculateButton.addEventListener('click', () => {
  lookForErrors();
});

function lookForErrors() {
  if (startingDay.value === '') {
    displayError(startingDay, dayError, 'This field is required', dayLabel);
  } else if ((startingDay.value < 1 || startingDay.value > 31)) {
    displayError(startingDay, dayError, 'Must be valid day', dayLabel);
  } else {
    clearError(startingDay, dayError, dayLabel);
  };
  // day errors

  if (startingMonth.value === '') {
    displayError(startingMonth, monthError, 'This field is required', monthLabel);
  } else if (startingMonth.value < 1 || startingMonth.value > 12) {
    displayError(startingMonth, monthError, 'Must be a valid month', monthLabel);
  } else if ((startingMonth.value == 4 && startingDay.value > 30 && startingDay.value < 32) 
  || (startingMonth.value == 6 && startingDay.value > 30 && startingDay.value < 32) 
  || (startingMonth.value == 9 && startingDay.value > 30 && startingDay.value < 32) 
  || (startingMonth.value == 11 && startingDay.value > 30 && startingDay.value < 32) 
  || (startingMonth.value == 2 && startingDay.value > 28) 
  || (startingMonth.value == 2 && startingDay.value > 29 && startingYear.value % 4 !== 0)) {
    displayError(startingDay, dayError, 'Must be valid date', dayLabel);
  // some complicated regular-months errors...
  } else {
    clearError(startingMonth, monthError, monthLabel);
  };
  // month errors

  if (startingYear.value === '') {
    displayError(startingYear, yearError, 'This field is required', yearLabel);
  } else {
    clearError(startingYear, yearError, yearLabel);
  };
  // year errors

  if (dayError.classList.contains('hidden') && monthError.classList.contains('hidden') && yearError.classList.contains('hidden')) {
    calculateDates();
  }
  // if all errors are hidden run the function
}
  // errors

function calculateDates() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  // takes current date

  const inputDate = new Date(`${startingMonth.value}/${startingDay.value}/${startingYear.value}`);
  // puts date from inputs together
  
  let dateYearsDiff = currentDate.getFullYear() - inputDate.getFullYear();
  let dateMonthsDiff = (currentDate.getMonth() + 1) - (inputDate.getMonth() + 1); 
  let dateDaysDiff = currentDate.getDate() - inputDate.getDate();
  // calculates years, months and days difference

  if (currentDate - inputDate < 0) {
    dayError.innerHTML = 'Must be in the past';
    monthError.innerHTML = 'Must be in the past';
    yearError.innerHTML = 'Must be in the past';
    dayError.classList.remove('hidden');
    monthError.classList.remove('hidden');
    yearError.classList.remove('hidden');
    startingDay.classList.add('input-error');
    startingMonth.classList.add('input-error');
    startingYear.classList.add('input-error');
    dayLabel.classList.add('label-error');
    monthLabel.classList.add('label-error');
    yearLabel.classList.add('label-error');
    document.querySelector('.js-years').innerHTML = '--';
    document.querySelector('.js-months').innerHTML = '--';
    document.querySelector('.js-days').innerHTML = '--';
    return;
  }
  // check if date is in the past
  // Q: Scope doesn't let me write this statement with other errors. How to do it better way? 

  if (dateDaysDiff < 0) {
      dateMonthsDiff--;
  // checks if days will be negative
      if (startingMonth.value == 4 || startingMonth.value == 6 || startingMonth.value == 9 || startingMonth.value == 11) {
        dateDaysDiff += 30;
      } else if (startingMonth.value == 2) {
        if (startingYear.value % 4 === 0) {
          dateDaysDiff += 29;
        } else {
          dateDaysDiff += 28;
        }
      } else {
        dateDaysDiff += 31;
      }
  // checks how much days has month

      if (dateMonthsDiff < 0) {
        dateYearsDiff--;
        dateMonthsDiff += 12;
  // checks if months will be negative
      }
    }
  if (dateMonthsDiff < 0) {
      dateYearsDiff--;
      dateMonthsDiff += 12;
  // checks if months will be negative when switching only months number
  }
  // avoids negative values and month-lenght inaccuracies
  document.querySelector('.js-years').innerHTML = dateYearsDiff;
  document.querySelector('.js-months').innerHTML = dateMonthsDiff;
  document.querySelector('.js-days').innerHTML = dateDaysDiff;
  // adds results to span;
  calculateAnimation();
  // runs the animation
};

function displayError(input, errorElement, errorMessage, label) {
  errorElement.innerHTML = errorMessage;
  errorElement.classList.remove('hidden');
  input.classList.add('input-error');
  label.classList.add('label-error');
}

function clearError(input, errorElement, label) {
  errorElement.classList.add('hidden');
  input.classList.remove('input-error');
  label.classList.remove('label-error');
}

function calculateAnimation() {
  // Select all <span> elements
  let valueDisplays = document.querySelectorAll("span");

  // Define a function to animate the value change
  function animateValue(displayElement, start, end, duration) {
    const startTime = performance.now();

    // Define a function to update the animated value
    function updateValue(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Calculate the animated value based on progress
      const animatedValue = Math.round(start + progress * (end - start));

      // Update the displayed value
      displayElement.textContent = animatedValue;

      // If animation is not complete, request the next animation frame
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    }

    // Start the animation by requesting the first animation frame
    requestAnimationFrame(updateValue);
  }

  // Iterate through each <span> element and animate its value change
  valueDisplays.forEach((valueDisplay) => {
    const startValue = 0;
    const endValue = parseInt(valueDisplay.innerHTML);
    const animationDuration = 1000; // Duration in milliseconds

    // Initiate the animation for the current value display
    animateValue(valueDisplay, startValue, endValue, animationDuration);
  });
}
    // animation
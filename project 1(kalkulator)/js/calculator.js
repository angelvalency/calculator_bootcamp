var theme = document.getElementById("theme");
theme.onclick = function() {
  document.body.classList.toggle("dark-mode");
}

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
      calculator.displayValue = digit;
      calculator.waitingForSecondOperand = false;
  } else {
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  
  if (!calculator.displayValue.includes(dot)) {
      
      calculator.displayValue += dot;
  }
}

function inputDigitOrOperator(key) {
  if (/\d/.test(key)) {
      inputDigit(key);
  } else if (/[\+\-\*\/%]/.test(key)) {
      handleOperator(key);
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue);

  if (nextOperator === '%') {
      const result = performCalculation['%'](inputValue);
      calculator.displayValue = String(result);
      calculator.firstOperand = result;
      calculator.operator = null;
      calculator.waitingForSecondOperand = false;
      updateDisplay();
      return;
  }

  if (operator && calculator.waitingForSecondOperand) {
      calculator.operator = nextOperator;
      return;
  }

  if (firstOperand == null) {
      calculator.firstOperand = inputValue;
  } else if (operator) {
      const currentValue = firstOperand || 0;
      const result = performCalculation[operator](currentValue, inputValue);

      calculator.displayValue = String(result);
      calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

const performCalculation = {
  '%': (firstOperand) => firstOperand / 100,

  '/': (firstOperand, secondOperand) => firstOperand / secondOperand,

  '*': (firstOperand, secondOperand) => firstOperand * secondOperand,

  '+': (firstOperand, secondOperand) => firstOperand + secondOperand,

  '-': (firstOperand, secondOperand) => firstOperand - secondOperand,

  '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function updateDisplay() {
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
      return;
  }

  if (target.classList.contains('operator')) {
      handleOperator(target.value);
      updateDisplay();
      return;
  }

  if (target.classList.contains('decimal')) {
      inputDecimal(target.value);
      updateDisplay();
      return;
  }

  if (target.classList.contains('all-clear')) {
      resetCalculator();
      updateDisplay();
      return;
  }

  if (target.classList.contains('delete')) {
      calculator.displayValue = calculator.displayValue.slice(0, -1);
      if (calculator.displayValue === '') {
          calculator.displayValue = '0';
      }
      updateDisplay();
      return;
  }

  if (target.classList.contains('plus-minus')) {
      calculator.displayValue = (parseFloat(calculator.displayValue) * -1).toString();
      updateDisplay();
      return;
  }

  inputDigit(target.value);
  updateDisplay();
});

document.addEventListener('keydown', handleKeyboardInput);
function handleKeyboardInput(event) {
  const key = event.key;

  if (/\d|[\+\-\*\/%]/.test(key)) {
      inputDigitOrOperator(key);
      updateDisplay();
  } else if (key === '.') {
      inputDecimal(key);
      updateDisplay();
  } else if (key === 'Enter') {
      handleOperator('=');
      updateDisplay();
  } else if (key === 'Backspace') {
      calculator.displayValue = calculator.displayValue.slice(0, -1);
      if (calculator.displayValue === '') {
          calculator.displayValue = '0';
      }
      updateDisplay();
  }
}
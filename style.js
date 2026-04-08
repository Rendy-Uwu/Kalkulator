let display = document.getElementById('layar');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForOperand = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function inputDigit(digit) {
    if (waitingForOperand) {
        clearDisplay();
        waitingForOperand = false;
    }
    currentInput = currentInput === '0' || currentInput === 'Error' 
        ? digit 
        : currentInput + digit;
    updateDisplay();
}

function inputDecimal() {
    if (waitingForOperand) {
        clearDisplay();
        waitingForOperand = false;
    }
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
        updateDisplay();
    }
}

function appendToDisplay(value) {
    if ('0123456789'.includes(value)) {
        inputDigit(value);
    } else if (value === '.') {
        inputDecimal();
    } else {
        performOperation(value);
    }
}

function performOperation(nextOperator) {
    const input = parseFloat(currentInput);

    if (isNaN(input)) {
        if (nextOperator !== null) {
            operator = nextOperator;
        }
        return;
    }

    if (operator === null) {
        previousInput = input;
    } else if (waitingForOperand) {
        operator = nextOperator;
        return;
    } else {
        switch (operator) {
            case '+':
                previousInput += input;
                break;
            case '-':
                previousInput -= input;
                break;
            case '*':
                previousInput *= input;
                break;
            case '/':
                if (input === 0) {
                    currentInput = 'Error';
                    updateDisplay();
                    setTimeout(() => {
                        clearAll();
                    }, 1500);
                    return;
                }
                previousInput /= input;
                break;
        }
    }

    previousInput = parseFloat(previousInput.toPrecision(12));
    currentInput = previousInput.toString();
    updateDisplay();
    
    // Siap untuk operand berikutnya
    waitingForOperand = true;
    operator = nextOperator;
}

function hitung() {
    performOperation(null);
    operator = null;
    waitingForOperand = false;
}

function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForOperand = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Keyboard Support (AKURAT)
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputDigit(key);
        event.preventDefault();
    } else if (key === '.') {
        inputDecimal();
        event.preventDefault();
    } else if (['+', '-', '*', '/'].includes(key)) {
        performOperation(key);
        event.preventDefault();
    } else if (key === 'Enter' || key === '=') {
        hitung();
        event.preventDefault();
    } else if (key === 'Escape') {
        clearAll();
        event.preventDefault();
    } else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
        event.preventDefault();
    }
});

// Test Akurasi - Uncomment untuk test
/*
console.log("Test Akurasi:");
console.log(0.1 + 0.2); // 0.30000000000000004 → Fixed!
console.log((0.1 + 0.2) * 3); 
*/

// Inisialisasi
updateDisplay();
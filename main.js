// change input on button click {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
// if value has been added allow operator
// if value has been added

const input = document.querySelector(".calculation");
const numButtons = document.querySelectorAll(".number");
const decimalButton = document.querySelector("#decimal");
const clearButton = document.querySelector('#clear');
const invertButton = document.querySelector('#invert');
const percent = document.querySelector('#percent');
const addition = document.querySelector('#addition');
const subtraction = document.querySelector('#subtract');
const equals = document.querySelector('#equals');

const maxLength = 50;
let equation = "";
let currentNumber = "";
let clearTimeoutId;
let equalsClicked = false; // Track if equals was clicked

function updateClearButton() {
    if (input.textContent !== "0" && !equalsClicked) {
        clearButton.innerHTML = '<img src="delete.svg" alt="Back Arrow" style="filter: invert(100%); height: 60%; width: 60%; object-fit: contain;">';
    } else {
        clearButton.textContent = "AC";
    }
}

numButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (input.textContent.length < maxLength) {
            if (input.textContent === "0") {
                input.textContent = button.textContent;
                currentNumber = button.textContent;
            } else {
                input.textContent += button.textContent;
                currentNumber += button.textContent;
            }
            updateClearButton();
        }
    });
});

decimalButton.addEventListener("click", () => {
    if (input.textContent.length < maxLength && !currentNumber.includes(".")) {
        // Only add a decimal point if there's a current number to append to
        if (currentNumber === "") {
            currentNumber = "0."; // Start a new number with "0."
            input.textContent += "0."; // Display the new number with "0."
        } else {
            currentNumber += ".";
            input.textContent += ".";
        }
        updateClearButton();
    }
});

addition.addEventListener("click", () => {
    if (input.textContent.length < maxLength) {
        input.textContent += " + ";
        equation += currentNumber + " + ";
        currentNumber = "";
    }
});

subtraction.addEventListener("click", () => {
    if (input.textContent.length < maxLength) {
        input.textContent += " - ";
        equation += currentNumber + " - ";
        currentNumber = "";
    }
})

equals.addEventListener("click", () => {
    if (currentNumber !== "") {
        equation += currentNumber;
        const result = calculateEquation(equation);
        input.textContent = result.toString();
        equation = result.toString();
        currentNumber = "";
        equalsClicked = true; // Set flag to true
        updateClearButton();
    }
});


function clearInput() {
    input.textContent = "0";
}

function startClearing () {
    clearTimeoutId = setTimeout(clearInput, 500);    
}

function stopClearing () {
    clearTimeout(clearTimeoutId);
}

function formatNumber(num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

clearButton.addEventListener("click", () => {
    if (equalsClicked) {
        // If equals was clicked, clear the input entirely
        input.textContent = "0";
        equation = "";
        currentNumber = "";
        equalsClicked = false; // Reset flag
        updateClearButton();
    } else if (input.textContent.length > 1) {
        // Backspace functionality when equals hasn't been clicked
        input.textContent = input.textContent.slice(0, -1);
        input.textContent = formatNumber(input.textContent.replace(/,/g, ''));
    } else {
        input.textContent = "0";
        updateClearButton();
    }
});

clearButton.addEventListener("mousedown", startClearing);
clearButton.addEventListener("mouseup", stopClearing);
clearButton.addEventListener("touchstart", startClearing); // for touch devices
clearButton.addEventListener("touchend", stopClearing); // for touch devices


function calculateEquation(eq) {
    const numbers = eq.split(/(\+|\-)/).map((item, index) => {
        if (item === "+" || item === "-") {
            return item;
        } else {
            return Number(item);
        }
    });

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i += 2) {
        const operator = numbers[i];
        const nextNumber = numbers[i + 1];
        if (operator === "+") {
            result += nextNumber;
        } else if (operator === "-") {
            result -= nextNumber;
        }
    }
    return result;
}
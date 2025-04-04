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
const multiply = document.querySelector('#multiply'); // Added multiply button
const divide = document.querySelector('#divide'); // Added divide button
const equals = document.querySelector('#equals');

const maxLength = 50;
let equation = "";
let currentNumber = "";
let clearTimeoutId;
let equalsClicked = false; // Track if equals was clicked

function updateClearButton() {
    if (input.textContent !== "0" && !equalsClicked) {
        // Keep the back button image
        clearButton.innerHTML = '<img src="delete.svg" alt="Back Arrow" style="filter: invert(100%); height: 60%; width: 60%; object-fit: contain;">';
    } else {
        // Set to "AC" when appropriate
        clearButton.innerHTML = "AC";
    }
}

function handleOperatorClick(operator) {
    if (equalsClicked) {
        // Start a new equation after equals
        equation = input.textContent;
        input.textContent += ` ${operator} `;
        equation += ` ${operator} `;
        currentNumber = "";
        equalsClicked = false; // Reset flag
    } else if (input.textContent.length < maxLength) {
        input.textContent += ` ${operator} `;
        equation += currentNumber + ` ${operator} `;
        currentNumber = "";
    }
}

numButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (equalsClicked) {
            input.textContent = button.textContent;
            equation = "";
            currentNumber = button.textContent;
            equalsClicked = false;
        } else if (input.textContent.length < maxLength) {
            if (input.textContent === "0") {
                input.textContent = button.textContent;
                currentNumber = button.textContent;
            } else {
                input.textContent += button.textContent;
                currentNumber += button.textContent;
            }
        }
        updateClearButton();
    });
});

decimalButton.addEventListener("click", () => {
    if (input.textContent.length < maxLength && !currentNumber.includes(".")) {
        currentNumber += currentNumber === "" ? "0." : ".";
        input.textContent += currentNumber === "0." ? "0." : ".";
        updateClearButton();
    }
});

addition.addEventListener("click", () => handleOperatorClick("+"));
subtraction.addEventListener("click", () => handleOperatorClick("-"));
multiply.addEventListener("click", () => handleOperatorClick("x"));
divide.addEventListener("click", () => handleOperatorClick("/"));
percent.addEventListener("click", () => handleOperatorClick("%"));

equals.addEventListener("click", () => {
    if (currentNumber !== "" || (equation.includes("%") && currentNumber === "")) {
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
        const textArray = input.textContent.trim().split(" "); // Split input by spaces

        // Check if the last element is an operator
        if (["+", "-", "x", "/", "%"].includes(textArray[textArray.length - 1])) {
            // If the last element is an operator, simply remove it
            textArray.pop();
            equation = textArray.join(" ");
            currentNumber = ""; // Reset currentNumber
        } else {
            // If the last element is part of the number, handle backspace
            textArray[textArray.length - 1] = textArray[textArray.length - 1].slice(0, -1);
            currentNumber = textArray[textArray.length - 1]; // Update currentNumber

            // If the last number is now empty, remove it
            if (!currentNumber) {
                textArray.pop();
            }

            equation = textArray.join(" ");
        }

        // Update input display
        input.textContent = equation || "0"; // Default to "0" if input is empty
    } else {
        input.textContent = "0";
        currentNumber = ""; // Clear currentNumber if input length is 1
        updateClearButton();
    }
});

clearButton.addEventListener("mousedown", startClearing);
clearButton.addEventListener("mouseup", stopClearing);
clearButton.addEventListener("touchstart", startClearing); // for touch devices
clearButton.addEventListener("touchend", stopClearing); // for touch devices


function calculateEquation(eq) {
    // Tokenize the equation and handle numbers and operators
    const tokens = eq.match(/(-?\d+\.?\d*|\.\d+|[-+x/%()])/g); // Match numbers, decimals, and operators
    if (tokens[1] === "%" && tokens.length === 2) {
        let result;
        result = parseFloat(tokens[0]) / 100; // Handle percentage at the start
        return result;
    } else {
        // Step 2: Handle multiplication, division, and modulus
        for (let i = 0; i < tokens.length; i++) {
            if (["x", "/", "%"].includes(tokens[i])) {
                const prevNumber = parseFloat(tokens[i - 1]);
                const nextNumber = parseFloat(tokens[i + 1]);
                let result;

                if (tokens[i] === "x") {
                    result = prevNumber * nextNumber;
                } else if (tokens[i] === "/") {
                    result = prevNumber / nextNumber;
                } else if (tokens[i] === "%") {
                    result = prevNumber % nextNumber; // Calculate modulus
                }
                tokens.splice(i - 1, 3, result.toString()); // Replace with the result
                i -= 1; // Step back for continuity
            }
        }

        // Step 3: Handle addition and subtraction
        let result = parseFloat(tokens[0]);
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const nextNumber = parseFloat(tokens[i + 1]);
            result = operator === "+" ? result + nextNumber : result - nextNumber;
        }

        return result;
    }
}



// negative
invertButton.addEventListener("click", () => {
    if (currentNumber === "" && equation !== "") {
        // If there's no currentNumber but an equation exists, toggle the last number in the equation
        const tokens = equation.trim().split(" ");
        const lastNumber = tokens[tokens.length - 1];
        if (!isNaN(parseFloat(lastNumber))) {
            tokens[tokens.length - 1] = lastNumber.startsWith("-") 
                ? lastNumber.slice(1) 
                : "-" + lastNumber;
            equation = tokens.join(" ");
            input.textContent = equation; 
        }
    } else if (currentNumber !== "") {
        // Toggle the sign of the current number
        currentNumber = currentNumber.startsWith("-") 
            ? currentNumber.slice(1) 
            : "-" + currentNumber;

        // Update the displayed input
        const inputText = input.textContent.trim().split(" "); 
        inputText[inputText.length - 1] = currentNumber; 
        input.textContent = inputText.join(" "); 
    }
});

document.addEventListener("keydown", (event) => {
    const key = event.key; // Get the key pressed

    // Find the corresponding button using the data-key attribute
    const button = document.querySelector(`[data-key="${key}"]`);

    if (button) {
        // Simulate the button click
        button.click();

        // Update the input display (as if button was clicked)
        if (button.classList.contains("number")) {
            // If the key is a number
            if (input.textContent === "0") {
                input.textContent = key;
            } else {
                input.textContent += key;
            }
        } else if (key === ".") {
            // If the key is a decimal point
            if (!input.textContent.includes(".")) {
                input.textContent += key;
            }
        } else if (["+","-","*","/","%"].includes(key)) {
            // If the key is an operator
            input.textContent += ` ${key} `;
        }
    }

    // Handle "Enter" for equals
    if (key === "Enter") {
        equals.click();
    }

    // Handle "Backspace" for clearing last input
    if (key === "Backspace") {
        clearButton.click();
    }
});

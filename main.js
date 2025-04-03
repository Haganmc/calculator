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
        }
    });
});

decimalButton.addEventListener("click", () => {
    if (input.textContent.length < maxLength && !input.textContent.includes(".")) {
            input.textContent += ".";
            currentNumber += ".";
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
    }
});


clearButton.addEventListener("click", () => {
    if (input.textContent.length > 1){
        input.textContent = input.textContent.slice(0, -1);
        input.textContent = formatNumber(input.textContent.replace(/,/g,''));

    } else {
        input.textContent = "0";
        clearButton.textContent = "AC";
    }
});

clearButton.addEventListener("mousedown", () => {
    clearTimeoutId = setTimeout(() => {
        input.textContent = "0";
        clearButton.textContent = "AC";
    }, 500)
});

clearButton.addEventListener("mouseup", () => {
    clearTimeout(clearTimeoutId);
})

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
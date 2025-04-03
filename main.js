// change input on button click {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
// if value has been added allow operator
// if value has been added 

const input = document.querySelector(".calculation");
const buttons = document.querySelectorAll(".number");
const decimalButton = document.querySelector("#decimal");
const clearButton = document.querySelector('#clear');
const invertButton = document.querySelector('#invert');
const percent = document.querySelector('#percent');
const maxLength = 50;
let clearTimeoutId;

function formatNumber(number) {
    const parts = number.split('.');
    parts[0] = Number(parts[0]).toLocaleString('en-US');
    return parts.join('.');
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (input.textContent.length < maxLength) {
            if (input.textContent === "0") {
                input.textContent = button.textContent;
            } else {
                input.textContent += button.textContent;
            }
            input.textContent = formatNumber(input.textContent.replace(/,/g, ''));
            clearButton.textContent = "⌫";
        }
    });
});

decimalButton.addEventListener("click", () => {
    if (input.textContent.length < maxLength && !input.textContent.includes(".")) {
        input.textContent += ".";
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


invertButton.addEventListener("click", () => {
    const numberString = input.textContent.replace(/,/g,'');
    input.textContent = parseFloat(numberString) * -1;
    input.textContent = formatNumber(input.textContent.replace(/,/g,''));
});





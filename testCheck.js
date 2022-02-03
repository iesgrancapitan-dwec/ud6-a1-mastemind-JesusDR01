const test2 = () => {
    const solution = ["red", "red", "yellow", "green"];
    const input = ["red", "red", "red", "red"];
    const expectedOutput = { white: 0, black: 2 };
    const result = check(solution, input);
    return result.white === expectedOutput.white && result.black === expectedOutput.black;
};

const test3 = () => {
    const solution = ["red", "red", "yellow", "green"];
    const input = ["red", "red", "red", "yellow"];
    const expectedOutput = { white: 1, black: 2 };
    const result = check(solution, input);
    return result.white === expectedOutput.white && result.black === expectedOutput.black;
};

const test4 = () => {
    const solution = ["red", "red", "yellow", "green"];
    const input = ["red", "red", "yellow", "red"];
    const expectedOutput = { white: 0, black: 3 };
    const result = check(solution, input);
    return result.white === expectedOutput.white && result.black === expectedOutput.black;
};

const test5 = () => {
    const solution = ["red", "red", "yellow", "green"];
    const input = ["red", "red", "yellow", "green"];
    const expectedOutput = { white: 0, black: 4 };
    const result = check(solution, input);
    return result.white === expectedOutput.white && result.black === expectedOutput.black;
};
const test1 = () => {
    const solution = ["red", "red", "yellow", "green"];
    const input = ["red", "white", "purple", "pink"];
    const expectedOutput = { white: 0, black: 1 };
    const result = check(solution, input);
    return result.white === expectedOutput.white && result.black === expectedOutput.black;
};
function check(validColors, inputColors) {
    if (validColors.length > 4) {
        throw new Error(`You can only request for ${MAX_REQUESTED_COLORS} colors`);
    }
    const auxInputColors = [...inputColors];
    const output = validColors.reduce(
        (colors, validColor, index) => {
            if (validColor === inputColors[index]) {
                colors.black++;
            } else if (auxInputColors.includes(validColor)) {
                colors.white++;
            }
            auxInputColors.splice(auxInputColors.indexOf(validColor), 1);
            return colors;
        },
        { black: 0, white: 0 }
    );
    return output;
}

console.log(test1());
console.log(test2());
console.log(test3());
console.log(test4());
console.log(test5());

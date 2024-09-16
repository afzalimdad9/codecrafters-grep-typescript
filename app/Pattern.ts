import _ from "lodash";

interface PatternResult {
    matchInput: string | null;
    remainingInput: string;
    remainingPattern: string;
}

class Pattern {
    constructor(
        public readonly pattern: (arg0: string, arg1: string) => PatternResult
    ) {
        this.pattern = pattern;
    }
}

function isDigit(c: string): boolean {
    return !_.isNaN(Number.parseInt(c, 10));
}

export const Patterns = {
    SingleCharacter: new Pattern((pattern,input) => {
        let [matchInput, remainingInput, remainingPattern]: [string|null, string, string] = [null, input, pattern];
        if (pattern.length < 1) return {matchInput, remainingInput, remainingPattern};

        const patternFirstChar = pattern.charAt(0);
        if (input.charAt(0) !== patternFirstChar) return {matchInput, remainingInput, remainingPattern};

        matchInput = patternFirstChar;
        remainingInput = input.slice(1);
        remainingPattern = pattern.slice(1);

        return {matchInput, remainingInput, remainingPattern};
    }),
    Digit: new Pattern((pattern,input) => {
        let [matchInput, remainingInput, remainingPattern]: [string|null, string, string] = [null, input, pattern];

        const PATTERN = "\\d";
        if (!_.startsWith(pattern, PATTERN)) return {matchInput, remainingInput, remainingPattern};

        const firstChar = input.charAt(0);
        if (!isDigit(firstChar)) return {matchInput, remainingInput, remainingPattern};

        matchInput = firstChar;
        remainingInput = input.slice(1);
        remainingPattern = pattern.slice(PATTERN.length);

        return {matchInput, remainingInput, remainingPattern};
    }),
    Alphanumeric: new Pattern((pattern,input) => {
        let [matchInput, remainingInput, remainingPattern]: [string|null, string, string] = [null, input, pattern];

        const PATTERN = "\\w";
        if (!pattern.startsWith(PATTERN)) return {matchInput, remainingInput, remainingPattern};

        const CHAR_CODE_A = 65;
        const CHAR_CODE_Z = 90;
        const CHAR_CODE_a = 97;
        const CHAR_CODE_z = 122;

        const firstChar = input.charAt(0);
        const firstCharCode = firstChar.charCodeAt(0);
        if (!(firstCharCode >= CHAR_CODE_A && firstCharCode<= CHAR_CODE_Z ||
            firstCharCode >= CHAR_CODE_a && firstCharCode <= CHAR_CODE_z ||
            isDigit(firstChar)
        )) return {matchInput, remainingInput, remainingPattern};

        matchInput = firstChar;
        remainingInput = input.slice(1);
        remainingPattern = pattern.slice(PATTERN.length);

        return {matchInput, remainingInput, remainingPattern};
    }),
    SquareBrackets: new Pattern((pattern,input) => {
        let [matchInput, remainingInput, remainingPattern]: [string|null, string, string] = [null, input, pattern];

        const start = pattern.indexOf("[");
        const end = pattern.indexOf("]");

        if (start !== 0) return {matchInput, remainingInput, remainingPattern};
        if (end === -1) return {matchInput, remainingInput, remainingPattern};

        const subPattern = pattern.substring(start + 1, end);
        remainingInput = input.slice(end + 1);
        remainingPattern = pattern.slice(end + 1);

        const isNegation = subPattern.startsWith("^");
        const subPatternChars = subPattern.split("");

        if (!isNegation) {
            matchInput = subPatternChars.find(c => input.includes(c)) ?? null;
            return {matchInput, remainingInput, remainingPattern};
        }

        matchInput = input.split("").find(c => !subPatternChars.includes(c)) ?? null;
        return {matchInput, remainingInput, remainingPattern};
    }),
    Void: new Pattern((pattern,input) => {
        let [matchInput, remainingInput, remainingPattern]: [string | null, string, string] = [input.charAt(0), input.slice(1), pattern];
        return {matchInput, remainingInput, remainingPattern};
    }),

    values: function(): Pattern[]{
        // @ts-ignore
        return Object.values(Patterns)
            .filter(it => it instanceof Pattern);
    }
}
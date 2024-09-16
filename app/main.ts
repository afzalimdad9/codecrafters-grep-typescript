const args = process.argv;
const pattern = args[3];
// @ts-ignore toplevel await error
const inputLine: string = (await Bun.stdin.text()).trim();
function isDigit(c: string): boolean {
    if (c.length !== 1) throw new Error("Unintended use of `isDigit(char)`");
    const code = c.charCodeAt(0);
    if (code >= 48 && code <= 57) return true;
    return false;
}
function isAlphabet(c: string): boolean {
    if (c.length !== 1) throw new Error("Unintended use of `isAlphabet(char)`");
    const code = c.charCodeAt(0);
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        return true;
    }
    return false;
}
function isUnderscore(c: string): boolean {
    if (c.length !== 1)
        throw new Error("Unintended use of `isUnderscore(char)`");
    return c === "_";
}
function matchChar(m: string, c: string): boolean {
    if (m.length !== 1)
        throw new Error("Unintended use of `matchChar(char, char)`");
    if (c.length !== 1)
        throw new Error("Unintended use of `matchChar(char, char)`");
    return m === c;
}
function matchChars(ms: string[], c: string): boolean {
    if (ms.length < 1)
        throw new Error("Unintended use of `matchChar(char[], char)`");
    if (c.length !== 1)
        throw new Error("Unintended use of `matchChar(char[], char)`");
    for (const m of ms) {
        if (matchChar(m, c)) return true;
    }
    return false;
}
function matchPattern(inputLine: string, pattern: string): boolean {
    if (pattern.length === 1) {
        return inputLine.includes(pattern);
    } else if (pattern === "\\d") {
        for (const c of inputLine) {
            if (isDigit(c)) return true;
        }
        return false;
    } else if (pattern === "\\w") {
        for (const c of inputLine) {
            console.log(isDigit(c), isAlphabet(c), isUnderscore(c));
            if (isDigit(c) || isAlphabet(c) || isUnderscore(c)) return true;
        }
        return false;
    } else if (pattern.startsWith("[") && pattern.endsWith("]")) {
        const charGroup = [...pattern.slice(1, -1)];
        const isNegative = charGroup[0] === "^";
        for (const c of inputLine) {
            if (
                isNegative
                    ? !matchChars(charGroup.slice(1), c)
                    : matchChars(charGroup, c)
            ) {
                return true;
            }
        }
        return false;
    } else {
        throw new Error(`Unhandled pattern: ${pattern}`);
    }
}
if (args[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
}
if (matchPattern(inputLine, pattern)) {
    process.exit(0);
} else {
    process.exit(1);
}
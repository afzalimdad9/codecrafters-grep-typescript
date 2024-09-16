const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

const isDigit = (c: string): boolean => {
  const code = c.charCodeAt(0);
  return code >= 48 && code <= 57;
};
const isAlphabetic = (c: string): boolean => {
  const code = c.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};
const isUnderscore = (c: string): boolean => {
  return c === "_";
};


function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  } else if (pattern === "\\d") {
    return /\d/g.test(inputLine);
  } else if (pattern === "\\w") {
    console.log(inputLine, "inputLine");
    for (const c of inputLine) {
      return isDigit(c) || isAlphabetic(c) || isUnderscore(c);
    }
  } else {
    throw new Error(`Unhandled pattern: ${pattern}`);
  }
}

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
if (matchPattern(inputLine, pattern)) {
  process.exit(0);
} else {
  process.exit(1);
}

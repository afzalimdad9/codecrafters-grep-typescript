import {Patterns} from "./Pattern";

const args = process.argv;
const pattern = args[3];

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

function matchPatternFull(fullInput: string, pattern: string): boolean {
  let remainingInput = fullInput.trim();
  let remainingPattern = pattern.trim();

  while (remainingPattern.length > 0) {
    if (remainingInput.length === 0) return false;

    const result = Patterns.values()
        .map(it => it.pattern(remainingPattern,remainingInput))
        .find(it => it.matchInput !== null);

    if (result === undefined) return false;

    remainingInput = result.remainingInput;
    remainingPattern = result.remainingPattern;

    // console.log({remainingInput, remainingPattern});
  }

  return true;
}

async function main(){
  const inputLine: string = await Bun.stdin.text();

  if (!matchPatternFull(inputLine, pattern)) {
    console.log("You have failed me!", inputLine, pattern);
    process.exit(1);
  }

  process.exit(0);
}

main()
    .then(r => console.log(r));
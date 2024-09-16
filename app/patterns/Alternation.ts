import {PatternResult} from "../Pattern";
import {Pattern} from "./Pattern";
import _ from "lodash";
import {matchPatternLine} from "../main";

export class Alternation extends Pattern {

    constructor() {
        super("Alternation", "|");
    }

    override _resolveOnce(pattern: string, input: string): PatternResult {
        let [matchInput, remainingInput, remainingPattern, patternName, matchedPattern]:
            [string | null, string, string, string, string | null] =
            [null, input, pattern, this.name, null];

        resolve: {
            if (!pattern.includes(this.pattern)) break resolve;

            let leftPattern = pattern.split(this.pattern)[0];
            let rightPattern = pattern.split(this.pattern)[1];
            // console.log("no parens", {leftPattern, rightPattern});

            const openParen = leftPattern.indexOf("(");
            const closeParen = rightPattern.indexOf(")");

            if (openParen !== -1 && closeParen === -1) break resolve;
            if (openParen === -1 && closeParen !== -1) break resolve;

            if (openParen !== -1 && closeParen !== -1) {
                leftPattern = leftPattern.substring(openParen + 1, leftPattern.length);
                rightPattern = rightPattern.substring(0, closeParen);
            }
            // console.log({leftPattern, rightPattern});

            const leftResolve = matchPatternLine(input, leftPattern);
            const rightResolve = matchPatternLine(input, rightPattern);

            const okResolve = !_.isNil(leftResolve?.matchInput)? leftResolve : rightResolve;
            if (_.isNil(okResolve?.matchInput)) break resolve;

            return okResolve;
        }

        return {matchInput, remainingInput, remainingPattern, patternName, matchedPattern};
    }
}
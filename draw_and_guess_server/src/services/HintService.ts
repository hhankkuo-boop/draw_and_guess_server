/**
 * 提示。負責人:徐育聖
 */
export class HintService {
    // TODO @徐育聖: initialHint(answer) 只提示字數;revealMore(answer, hint) 隨時間揭露部分字母
    static initialHint(answer: string): string {
        return [...answer].map(() => "_").join(" ");
    }

    static revealMore(answer: string, hint: string): string {
        const answerCharacters = [...answer];
        const hintCharacters = hint.split(" ");

        if (answerCharacters.length !== hintCharacters.length) {
            return this.initialHint(answer);
        }

        const hiddenIndexes = hintCharacters
            .map((character, index) => (character === "_" ? index : -1))
            .filter((index) => index !== -1);

        if (hiddenIndexes.length === 0) {
            return hint;
        }

        const randomHiddenIndex = Math.floor(Math.random() * hiddenIndexes.length);
        const answerIndex = hiddenIndexes[randomHiddenIndex];

        hintCharacters[answerIndex] = answerCharacters[answerIndex];

        return hintCharacters.join(" ");
    }
}

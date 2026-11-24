/**
 * 抽選單字。負責人:徐育聖
 */
import words from "../data/words.json" with { type: "json" };

export class WordService {
    static all: string[] = words;

    // TODO @徐育聖: pickChoices(n = 3) 隨機抽三個不重複的字(避免本場已用過的)
    static pickChoices(
        choiceCount = 3,
        usedWords: ReadonlySet<string> = new Set(),
    ): string[] {

        const availableWords = this.all.filter((candidateWord) => !usedWords.has(candidateWord));
        const choices: string[] = [];
        const numberOfChoices = Math.min(Math.max(0, Math.floor(choiceCount)), availableWords.length);

        for (let choiceIndex = 0; choiceIndex < numberOfChoices; choiceIndex += 1) {
            const randomChoiceIndex = Math.floor(Math.random() * availableWords.length);
            choices.push(availableWords.splice(randomChoiceIndex, 1)[0]);
        }
        
        return choices;
    }
}

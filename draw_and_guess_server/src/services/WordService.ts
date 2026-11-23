/**
 * 抽選單字。負責人:徐育聖
 */
import words from "../data/words.json" with { type: "json" };

export class WordService {
    static all: string[] = words;

    // TODO @徐育聖: pickChoices(n = 3) 隨機抽三個不重複的字(避免本場已用過的)
}

/**
 * 一場遊戲的回合與狀態機。負責人:郭奇翰
 *
 * 只負責「狀態與資料」。抽字(WordService)、提示(HintService)、
 * 計分(ScoreService)、計時與廣播由徐育聖的 services 呼叫這裡的方法。
 *
 * 狀態流程: waitingRoom → selecting → drawing → revealing → (下一回合 selecting ... ) → awarding → waitingRoom
 */
import type { Room } from "./Room.js";
import { GameState } from "../protocol/types.js";

export const MIN_PLAYERS = 2;

export class Game {
    state: GameState = GameState.waitingRoom;
    round = 0;          // 目前第幾回合(從 1 開始)
    totalRounds = 0;    // 本場總回合數(開始時=玩家數,每人畫一次)
    drawerId = "";
    answer = "";
    wordChoices: string[] = [];
    roundStartTime = 0;
    private drawerQueue: string[] = [];

    constructor(public readonly room: Room) {}

    isPlaying(): boolean {
        return this.state !== GameState.waitingRoom;
    }

    canStart(): boolean {
        return !this.isPlaying() && this.room.size >= MIN_PLAYERS;
    }

    /** 開始遊戲並進入第一回合。成功回傳 true。 */
    start(): boolean {
        if (!this.canStart()) return false;
        this.room.players.forEach((p) => p.resetAll());
        this.drawerQueue = [...this.room.players.keys()];
        this.totalRounds = this.drawerQueue.length;
        this.round = 0;
        return this.nextRound();
    }

    /**
     * 進入下一回合(state=selecting,指定新畫圖者)。
     * 回合都結束時會呼叫 end() 並回傳 false。
     */
    nextRound(): boolean {
        // 跳過已離開的玩家
        while (this.drawerQueue.length > 0 && !this.room.players.has(this.drawerQueue[0])) {
            this.drawerQueue.shift();
        }
        if (this.drawerQueue.length === 0 || this.room.size < MIN_PLAYERS) {
            this.end();
            return false;
        }
        this.round += 1;
        this.room.players.forEach((p) => p.resetRound());
        this.drawerId = this.drawerQueue.shift()!;
        this.room.players.get(this.drawerId)!.isDrawer = true;
        this.answer = "";
        this.wordChoices = [];
        this.roundStartTime = 0;
        this.state = GameState.selecting;
        return true;
    }

    /** 設定供畫圖者選擇的三個字(由 WordService 抽出後傳入) */
    setWordChoices(words: string[]): void {
        this.wordChoices = words;
    }

    /** 畫圖者選字,成功後進入 drawing 並開始計時 */
    selectWord(playerId: string, word: string): boolean {
        if (this.state !== GameState.selecting) return false;
        if (playerId !== this.drawerId || !this.wordChoices.includes(word)) return false;
        this.answer = word;
        this.roundStartTime = Date.now();
        this.state = GameState.drawing;
        return true;
    }

    /** 畫圖者超時沒選字時,自動選第一個 */
    autoSelectWord(): boolean {
        return this.selectWord(this.drawerId, this.wordChoices[0]);
    }

    /** 本回合已經過的毫秒數 */
    elapsedMs(): number {
        return this.roundStartTime ? Date.now() - this.roundStartTime : 0;
    }

    /** 判斷文字是否猜中(畫圖者與已猜中者不能再猜) */
    isCorrectGuess(playerId: string, text: string): boolean {
        if (this.state !== GameState.drawing) return false;
        const p = this.room.players.get(playerId);
        if (!p || p.isDrawer || p.hasGuessed) return false;
        return text.trim().toLowerCase() === this.answer.toLowerCase();
    }

    /** 記錄某玩家猜中。回傳是否成功標記。 */
    markGuessed(playerId: string): boolean {
        const p = this.room.players.get(playerId);
        if (!p || p.hasGuessed || p.isDrawer) return false;
        p.hasGuessed = true;
        return true;
    }

    guessedCount(): number {
        return [...this.room.players.values()].filter((p) => p.hasGuessed).length;
    }

    /** 除了畫圖者以外的人是否都猜中了(可提早結束回合) */
    allGuessed(): boolean {
        const guessers = [...this.room.players.values()].filter((p) => !p.isDrawer);
        return guessers.length > 0 && guessers.every((p) => p.hasGuessed);
    }

    /** 結束本回合,公佈答案 */
    endRound(): void {
        if (this.state === GameState.drawing || this.state === GameState.selecting) {
            this.state = GameState.revealing;
        }
    }

    /** 整場遊戲結束,顯示排名 */
    end(): void {
        this.state = GameState.awarding;
    }

    /** 回到等待房間,準備重新開始 */
    reset(): void {
        this.state = GameState.waitingRoom;
        this.round = 0;
        this.totalRounds = 0;
        this.drawerId = "";
        this.answer = "";
        this.wordChoices = [];
        this.roundStartTime = 0;
        this.drawerQueue = [];
        this.room.players.forEach((p) => p.resetAll());
    }

    /** 目前畫圖者是否已離開房間(需要提早結束回合) */
    drawerLeft(): boolean {
        return this.isPlaying() && !!this.drawerId && !this.room.players.has(this.drawerId);
    }

    /** 依分數高到低排名 */
    ranking() {
        return [...this.room.players.values()].sort((a, b) => b.score - a.score);
    }
}

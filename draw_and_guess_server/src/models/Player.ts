/**
 * 玩家。負責人:郭奇翰
 */
import type { PlayerInfo } from "../protocol/types.js";

export class Player {
    score = 0;
    isDrawer = false;
    hasGuessed = false;
    roomId = "";

    constructor(
        public readonly id: string, // socket id
        public nickname: string,
    ) {}

    /** 每回合開始時重置 */
    resetRound(): void {
        this.isDrawer = false;
        this.hasGuessed = false;
    }

    /** 整場遊戲重新開始時重置 */
    resetAll(): void {
        this.resetRound();
        this.score = 0;
    }

    addScore(delta: number): void {
        this.score += delta;
    }

    /** 轉成傳給前端的資料 */
    toInfo(): PlayerInfo {
        return {
            id: this.id,
            nickname: this.nickname,
            score: this.score,
            isDrawer: this.isDrawer,
        };
    }
}

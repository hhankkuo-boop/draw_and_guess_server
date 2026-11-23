/**
 * 一場遊戲的回合與狀態機。Class 由 郭奇翰 設計,流程邏輯與 徐育聖 協作。
 */
import type { Room } from "./Room.js";
import { GameState } from "../protocol/types.js";

export class Game {
    state: GameState = GameState.waitingRoom;
    round = 0;
    drawerId = "";
    answer = "";
    wordChoices: string[] = [];
    roundStartTime = 0;

    constructor(public readonly room: Room) {}

    // TODO @郭奇翰: start() / nextRound() / endRound() / end()
}

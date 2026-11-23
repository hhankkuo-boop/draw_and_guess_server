/**
 * 房間。負責人:郭奇翰
 */
import { Player } from "./Player.js";
import { Game } from "./Game.js";
import type { PlayerInfo } from "../protocol/types.js";

export class Room {
    /** 依加入順序排列(Map 會保留插入順序) */
    players: Map<string, Player> = new Map();
    game: Game = new Game(this);
    hostId = "";

    constructor(
        public readonly id: string, // 4 位數房號 "0001" ~ "9999"
        public readonly maxPlayers: number = 8,
    ) {}

    get size(): number {
        return this.players.size;
    }

    isFull(): boolean {
        return this.players.size >= this.maxPlayers;
    }

    isEmpty(): boolean {
        return this.players.size === 0;
    }

    /** 遊戲進行中不能中途加入 */
    canJoin(): boolean {
        return !this.isFull() && !this.game.isPlaying();
    }

    getPlayer(id: string): Player | undefined {
        return this.players.get(id);
    }

    /** 加入房間。第一位玩家自動成為房主。成功回傳 true。 */
    addPlayer(player: Player): boolean {
        if (this.players.has(player.id) || !this.canJoin()) return false;
        player.roomId = this.id;
        this.players.set(player.id, player);
        if (!this.hostId) this.hostId = player.id;
        return true;
    }

    /** 離開房間。房主離開時自動換房主。回傳被移除的玩家。 */
    removePlayer(id: string): Player | undefined {
        const player = this.players.get(id);
        if (!player) return undefined;
        this.players.delete(id);
        player.roomId = "";
        if (this.hostId === id) {
            this.hostId = this.players.keys().next().value ?? "";
        }
        return player;
    }

    isHost(id: string): boolean {
        return this.hostId === id;
    }

    toPlayerInfos(): PlayerInfo[] {
        return [...this.players.values()].map((p) => p.toInfo());
    }
}

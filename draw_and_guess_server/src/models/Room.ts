/**
 * 房間。負責人:郭奇翰
 */
import { Player } from "./Player.js";
import { Game } from "./Game.js";

export class Room {
    players: Map<string, Player> = new Map();
    game: Game = new Game(this);
    hostId = "";

    constructor(
        public readonly id: string,
        public readonly isPublic: boolean = true,
        public readonly maxPlayers: number = 8,
    ) {}

    // TODO @郭奇翰: addPlayer / removePlayer / isFull / 換房主
}

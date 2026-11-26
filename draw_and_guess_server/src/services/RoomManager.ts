/**
 * 房間管理。負責人:徐育聖
 *
 * 規則:沒有公開房間,只有房號(4 位數字字串 "0001" ~ "9999")。
 */
import { Room } from "../models/Room.js";
import { Player } from "../models/Player.js";
import { ErrorCode, NAME_MAX_LENGTH, ROOM_ID_PATTERN } from "../protocol/types.js";

type CreateRoomResult = | { ok: true; room: Room } | { ok: false; error: ErrorCode };
type JoinRoomResult = | { ok: true; room: Room } | { ok: false; error: ErrorCode };

export class RoomManager {
    static rooms: Map<string, Room> = new Map();

    // TODO @徐育聖:
    // - generateRoomId(): 從 0001~9999 隨機挑一個「尚未被使用」的,補零成 4 碼;全部用完回傳錯誤 roomsExhausted
    static generateRoomId(): string | undefined {
        const availableIds: string[] = [];

        for (let number = 1; number <= 9999; number += 1) {
            const id = String(number).padStart(4, "0");
            if (!this.rooms.has(id)) {
                availableIds.push(id);
            }
        }

        if (availableIds.length === 0) {
            return undefined;
        }

        const randomIndex = Math.floor(Math.random() * availableIds.length);
        return availableIds[randomIndex];
    }

    // - createRoom(player): 產生房號、建立 Room、玩家加入並成為房主
    static createRoom(player: Player): CreateRoomResult {
        const nickname = player.nickname.trim();

        if (nickname.length === 0 || nickname.length > NAME_MAX_LENGTH) {
            return { ok: false, error: ErrorCode.invalidName };
        }

        const roomId = this.generateRoomId();

        if (roomId === undefined) {
            return { ok: false, error: ErrorCode.roomsExhausted };
        }

        player.nickname = nickname;

        const room = new Room(roomId);
        room.addPlayer(player);
        this.rooms.set(roomId, room);

        return { ok: true, room };
    }

    // - joinRoom(roomId, player): 驗證房號格式(ROOM_ID_PATTERN)、房間存在、未滿、遊戲未開始、名稱重複則在後方加上後綴
    //   失敗時回傳對應 ErrorCode(見 protocol/types.ts)
    static joinRoom(roomId: string, player: Player): JoinRoomResult {
        if (!ROOM_ID_PATTERN.test(roomId) || roomId === "0000") {
            return { ok: false, error: ErrorCode.invalidRoomId };
        }

        const room = this.rooms.get(roomId);
        if (!room) {
            return { ok: false, error: ErrorCode.roomNotFound };
        }

        const nickname = player.nickname.trim();
        if (nickname.length === 0 || nickname.length > NAME_MAX_LENGTH) {
            return { ok: false, error: ErrorCode.invalidName };
        }

        if (room.isFull()) {
            return { ok: false, error: ErrorCode.roomFull };
        }

        if (room.game.isPlaying()) {
            return { ok: false, error: ErrorCode.gameStarted };
        }

        const usedNicknames = new Set(
            [...room.players.values()].map((existingPlayer) =>
                existingPlayer.nickname.trim().toLowerCase(),
            ),
        );

        let assignedNickname = nickname;
        if (usedNicknames.has(assignedNickname.toLowerCase())) {
            let suffixNumber = 2;

            while (true) {
                const suffix = `(${suffixNumber})`;
                const baseNickname = nickname.slice(0, NAME_MAX_LENGTH - suffix.length);
                assignedNickname = `${baseNickname}${suffix}`;

                if (!usedNicknames.has(assignedNickname.toLowerCase())) break;
                suffixNumber += 1;
            }
        }

        player.nickname = assignedNickname;

        if (!room.addPlayer(player)) {
            return { ok: false, error: ErrorCode.gameStarted };
        }

        return { ok: true, room };
    }

    // - leave(player): 玩家離開;房間空了就刪除並釋放房號
    static leave(player: Player): Room | undefined {
        const room = this.rooms.get(player.roomId);

        if (!room) {
            return undefined;
        }

        const removedPlayer = room.removePlayer(player.id);

        if (!removedPlayer) {
            return undefined;
        }

        if (room.isEmpty()) {
            this.rooms.delete(room.id);
        }

        return room;
    }
}

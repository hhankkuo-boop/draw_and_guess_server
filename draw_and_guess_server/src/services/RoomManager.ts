/**
 * 房間管理。負責人:徐育聖
 */
import { Room } from "../models/Room.js";

export class RoomManager {
    static rooms: Map<string, Room> = new Map();

    // TODO @徐育聖: joinOrCreatePublic(player) 自動配對公開房間 / leave(player) / 清除空房
}

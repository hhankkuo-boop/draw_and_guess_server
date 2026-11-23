/**
 * 房間管理。負責人:徐育聖
 *
 * 規則:沒有公開房間,只有房號(4 位數字字串 "0001" ~ "9999")。
 */
import { Room } from "../models/Room.js";

export class RoomManager {
    static rooms: Map<string, Room> = new Map();

    // TODO @徐育聖:
    // - generateRoomId(): 從 0001~9999 隨機挑一個「尚未被使用」的,補零成 4 碼;全部用完回傳錯誤 roomsExhausted
    // - createRoom(player): 產生房號、建立 Room、玩家加入並成為房主
    // - joinRoom(roomId, player): 驗證房號格式(ROOM_ID_PATTERN)、房間存在、未滿、遊戲未開始、名字不重複,
    //   失敗時回傳對應 ErrorCode(見 protocol/types.ts)
    // - leave(player): 玩家離開;房間空了就刪除並釋放房號
}

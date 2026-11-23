/**
 * Socket.IO 事件收發。負責人:彭于誠(呼叫 services,邏輯由徐育聖實作)
 */
import type { Server, Socket } from "socket.io";
import { ClientEvent } from "../protocol/events.js";

export function registerHandlers(io: Server, socket: Socket): void {
    console.log("connected", socket.id);

    // TODO @彭于誠: 依下列事件呼叫 services
    socket.on(ClientEvent.CreateRoom, (_req) => {}); // CreateRoomReq → RoomJoinedRes 或 ErrorRes
    socket.on(ClientEvent.JoinRoom, (_req) => {});   // JoinRoomReq → RoomJoinedRes 或 ErrorRes
    socket.on(ClientEvent.StartGame, () => {});
    socket.on(ClientEvent.SelectWord, (_req) => {});
    socket.on(ClientEvent.Draw, (_data) => {});
    socket.on(ClientEvent.Chat, (_msg) => {});
    socket.on("disconnect", () => {});
}

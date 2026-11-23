/**
 * 封包型別。負責人:彭于誠。需與前端 src/models/types.ts 保持一致。
 */
export enum GameState {
    waitingRoom = "waitingRoom",
    selecting = "selecting",
    drawing = "drawing",
    revealing = "revealing",
    awarding = "awarding",
}

// 沒有公開房間,只有「房號」:4 位數字字串 "0001" ~ "9999"
export const ROOM_ID_PATTERN = /^\d{4}$/;
export const NAME_MAX_LENGTH = 12;

export type CreateRoomReq = { nickname: string };
export type JoinRoomReq = { nickname: string; roomId: string };
export type RoomJoinedRes = { roomId: string; isHost: boolean };

export enum ErrorCode {
    invalidName = "invalidName",       // 名字空白或過長
    invalidRoomId = "invalidRoomId",   // 房號格式不是 0001~9999
    roomNotFound = "roomNotFound",     // 房號不存在
    roomFull = "roomFull",
    gameStarted = "gameStarted",       // 遊戲已開始,不能加入
    nameTaken = "nameTaken",           // 同房間已有相同名字
    roomsExhausted = "roomsExhausted", // 9999 個房號都用完
}
export type ErrorRes = { code: ErrorCode; message: string };

export type PlayerInfo = { id: string; nickname: string; score: number; isDrawer: boolean };
export type ChatMessage = { sender: string; content: string; isAnswer: boolean };

export type StateChangedRes = { state: GameState; countDown: number; drawerId?: string };
export type WordChoicesRes = { words: string[] };
export type SelectWordReq = { word: string };
export type HintRes = { hint: string }; // 例如 "_ _ 蘋 _"

// TODO @彭于誠 @魏晨名: 設計繪圖資料格式(筆畫點、顏色、粗細、填滿、清除)
export type DrawData = {
    type: "stroke" | "fill" | "clear";
    color?: string;
    width?: number;
    points?: { x: number; y: number }[];
};

export type ScoreItem = { id: string; nickname: string; score: number; delta: number };
export type RoundEndRes = { answer: string; scores: ScoreItem[] };

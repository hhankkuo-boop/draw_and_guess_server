/**
 * Socket.IO 事件名稱。負責人:彭于誠(與前端魏晨名確認)
 */
export const ClientEvent = {
    JoinPublic: "joinPublic",   // 按下開始,自動創建或加入公開房間
    StartGame: "startGame",
    SelectWord: "selectWord",   // 畫圖者選字
    Draw: "draw",               // 畫圖資料
    Chat: "chat",               // 聊天/猜字
} as const;

export const ServerEvent = {
    RoomJoined: "roomJoined",
    PlayerList: "playerList",
    StateChanged: "stateChanged",
    WordChoices: "wordChoices", // 只傳給畫圖者
    Hint: "hint",               // 字數/部分字母提示
    Draw: "draw",               // 轉發給其他人
    Chat: "chat",
    GuessCorrect: "guessCorrect",
    RoundEnd: "roundEnd",
    GameEnd: "gameEnd",
    Error: "error",
} as const;

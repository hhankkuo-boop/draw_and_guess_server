# draw_and_guess_server

你畫我猜 後端(Node.js + TypeScript + Express + Socket.IO)

## 啟動

```sh
npm install
npm run dev     # 開發模式,預設 http://localhost:3000
npm run build   # 編譯到 dist/
```

## 分工與檔案對應

| 負責人 | 工作 | 負責檔案 |
| --- | --- | --- |
| 郭奇翰 | 後端架構與建置 | `src/index.ts`, `src/models/*` |
| 彭于誠 | 通訊(API 介面、資料結構) | `src/protocol/*`, `src/socket/handlers.ts` |
| 徐育聖 | 遊戲與房間管理 | `src/services/*`, `src/data/words.json` |

- 前端對應:魏晨名 ↔ 彭于誠(事件與封包格式),`src/protocol/types.ts` 需與前端 `src/models/types.ts` 保持一致。
- 房間/遊戲流程:徐育聖實作 `services/*`,透過 `models/*`(郭奇翰)的 Class 操作。

## 目錄

```
src/
├─ index.ts              啟動 server
├─ models/               核心 Class: Player / Room / Game
├─ protocol/             事件名稱與封包型別
├─ socket/handlers.ts    Socket.IO 事件收發
├─ services/             RoomManager / WordService / HintService / ScoreService / Broadcast
└─ data/words.json       題庫
```

## 房間規則

- 網站只有首頁。玩家輸入名字(最多 12 字)後,二選一:
  - **Create Room**:系統從 `0001`~`9999` 挑一個未使用的房號建立房間,玩家成為房主。
  - **Join Room**:輸入房號加入已存在的房間。
- **沒有公開房間**、沒有自動配對。
- 事件:`createRoom`(`{nickname}`)、`joinRoom`(`{nickname, roomId}`),成功回 `roomJoined`,失敗回 `error`(`ErrorCode`,見 `protocol/types.ts`)。
- 無法加入的情況:房號格式錯、房間不存在、房間已滿、遊戲已開始、名字重複。

## 遊戲狀態(對應前端 GameState)

`waitingRoom → selecting → drawing → revealing → awarding`

## Git 流程

- `main` 為穩定分支,不直接 push。
- 每人開自己的 branch(例如 `feature/room-manager`),完成後發 Pull Request,由郭奇翰 review 後 merge。

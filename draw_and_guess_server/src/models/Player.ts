/**
 * 玩家。負責人:郭奇翰
 */
export class Player {
    score = 0;
    isDrawer = false;
    hasGuessed = false;

    constructor(
        public readonly id: string, // socket id
        public nickname: string,
    ) {}

    // TODO @郭奇翰: reset 每回合狀態等
}

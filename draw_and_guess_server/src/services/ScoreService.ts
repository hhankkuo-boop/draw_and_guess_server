/**
 * 計分。負責人:徐育聖
 */
export class ScoreService {
    // TODO @徐育聖: guesserScore(elapsed, total) 越早猜中越高 drawerScore(correctCount)
    static guesserScore(elapsed: number, total: number): number {
        if (total <= 0) {
            return 10;
        }

        const clampedElapsed = Math.min(Math.max(elapsed, 0), total);
        const score = Math.round(100 * (1 - clampedElapsed / total));

        return Math.max(10, score);
    }

    static drawerScore(correctCount: number): number {
        const pointsPerCorrectGuesser = 20;
        const safeCount = Math.max(0, Math.floor(correctCount));

        return safeCount * pointsPerCorrectGuesser;
    }
}

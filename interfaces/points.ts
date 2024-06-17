export interface PointsBase {
  id: number;
  actionName: string;
  pointsPerAction: number;
  scalingFactor: number;
  counter: string;
}

export interface PointsEvents {
  id: number;
  userId: number;
  actionName: string;
  pointsWon: number;
  pointsCounted: boolean;
  info: object;
  createdAt: number;
  updatedAt: number;
}

export interface PointsLeaderboardItem {
  position: number;
  totalPoints: number;
  address: string;
  avatar: string;
  handle: string;
}

export interface PointsLeaderboard {
  top: PointsLeaderboardItem[];
  user?: PointsLeaderboardItem;
}
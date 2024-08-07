import {PaginatedData} from "./paginated-data";

export type NotificationsType =
  | "NOTIF_TASK_CREATED"
  | "NOTIF_DELIVERABLE_CREATED"
  | "NOTIF_DELIVERABLE_READY"
  | "NOTIF_PROPOSAL_OPEN"
  | "NOTIF_PROPOSAL_DISPUTED"

export interface UserNotification {
  id: number;
  type?: NotificationsType;
  userId?: number;
  read?: boolean;
  uuid?: string;
  user?: {
    address: string;
  };
  hide?: boolean;
  template?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SearchNotificationsPaginated
  extends PaginatedData<UserNotification> {
  currentPage: number;
  pages: number;
}

export interface NotificationSettings {
  id: number;
  userId: number;
  taskOpen: boolean;
  deliverableReady: boolean;
  proposalCreated: boolean;
  proposalDisputed: boolean;
  commentsOnTasks: boolean;
  commentsOnProposals: boolean;
  commentsOnDeliverables: boolean;
  replyOnThreads: boolean;
  subscriptions: number[];
}
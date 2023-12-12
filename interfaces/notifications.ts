import { PaginatedData } from "./paginated-data";

export type NotificationsType =
  | "task"
  | "deliverable"
  | "proposal"
  | "dispute"
  | "open"
  | "ready"
  | "canceled";

export interface Notifications {
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
  extends PaginatedData<Notifications> {
  currentPage: number;
  pages: number;
}

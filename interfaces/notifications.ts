import { PaginatedData } from "./paginated-data";

export type NotificationsType = 'task' | 'deliverable' | 'proposal' | 'dispute' | 'open' | 'ready' | 'canceled'

export interface Notifications {
    id: number,
    type: NotificationsType;
    userId: number;
    read: boolean;
    uuid?: string;
    hide: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export type SearchNotificationsPaginated = PaginatedData<Notifications>
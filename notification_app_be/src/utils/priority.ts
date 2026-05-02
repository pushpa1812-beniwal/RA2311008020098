export interface Notification {
    id: string;
    type: 'Placement' | 'Result' | 'Event' | string;
    message: string;
    timestamp: number; // Unix timestamp
    [key: string]: any;
}

const getPriorityWeight = (type: string): number => {
    switch (type) {
        case 'Placement':
            return 3;
        case 'Result':
            return 2;
        case 'Event':
            return 1;
        default:
            return 0; // Unknown types have lowest priority
    }
};

/**
 * Sorts notifications based on:
 * 1. Priority Weight (Placement > Result > Event)
 * 2. Recency (latest first)
 */
export const prioritizeNotifications = (notifications: Notification[], topN: number): Notification[] => {
    const sorted = [...notifications].sort((a, b) => {
        const weightA = getPriorityWeight(a.type);
        const weightB = getPriorityWeight(b.type);

        if (weightA !== weightB) {
            return weightB - weightA; // Higher weight comes first
        }

        // If weights are equal, sort by recency (latest first)
        return b.timestamp - a.timestamp;
    });

    return sorted.slice(0, topN);
};

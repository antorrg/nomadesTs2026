import type { AnyAction } from '@reduxjs/toolkit';

export interface RejectedAction extends AnyAction {
    error: {
        message?: string;
    }
}

export function isRejectedAction(action: AnyAction): action is RejectedAction {
    return action.type.endsWith('/rejected');
}

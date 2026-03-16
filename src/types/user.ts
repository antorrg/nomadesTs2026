export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER' | 'EMPLOYEE';

export interface IUser {
    id: string;
    email: string;
    nickname?: string | null;
    name: string;
    picture?: string | null;
    role: UserRole;
    enabled: boolean;
}

export type AuthUser = Pick<IUser, 'id' | 'email' | 'role' | 'enabled'>;

export interface CreateUserInput {
    email: string;
    password?: string;
    nickname?: string | null;
    name: string;
    picture?: string | null;
    enabled: boolean;
}
export type LoginUser = Pick<IUser, 'email'> & { password: string }

export type UpdateUserInput = Partial<Omit<IUser, 'id' | 'enabled'> & { password?: string }> & { useImg?: boolean; saver?: boolean };
export type UpgradeUserInput = { enabled: boolean, role: UserRole };

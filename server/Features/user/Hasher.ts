import bcrypt from 'bcrypt'

export class Hasher{
    static async hashPassword(password: string){
        return bcrypt.hash(password, 12)
    }
    static async comparePassword(password: string, hash: string){
        return bcrypt.compare(password, hash)
    }
}
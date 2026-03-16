import { describe, it, expect } from 'vitest';
import { ValidContact, type EmailInput } from './validContact';

describe('ValidContact', () => {
    it('should return errors for empty fields', () => {
        const input: EmailInput = {
            email: '',
            issue: '',
            message: ''
        };
        const errors = ValidContact(input);
        expect(errors.email).toBeDefined();
        expect(errors.issue).toBeDefined();
        expect(errors.message).toBeDefined();
    });

    it('should return error for invalid email format', () => {
        const input: EmailInput = {
            email: 'invalid-email',
            issue: 'Valid Issue',
            message: 'Valid Message is long enough to pass validation'
        };
        const errors = ValidContact(input);
        expect(errors.email).toBe('Formato de email invalido');
    });

    it('should pass with valid input', () => {
        // Construct a message > 50 chars
        const longMessage = 'This is a very long message that should accurately pass the validation check because it has more than fifty characters in it.';
        const input: EmailInput = {
            email: 'test@example.com',
            issue: 'Valid Issue',
            message: longMessage
        };
        const errors = ValidContact(input);
        expect(Object.keys(errors).length).toBe(0);
    });
});

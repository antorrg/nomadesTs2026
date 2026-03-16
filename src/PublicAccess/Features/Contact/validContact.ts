
export interface EmailInput {
    email: string
    issue: string
    message: string
}
export type EmailErrors = Partial<Record<keyof EmailInput, string>>

export const ValidContact = (input:EmailInput) => {
    let errors:EmailErrors = {};
  
    // Using Regular Expressions to validate the appropriate use
    const validEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    
    // Validaciones para el campo de email
    if (!input.email.trim()) {
      errors.email = "Este campo no puede estar vacio";
    } else if (!validEmail.test(input.email.trim())) {
      errors.email = "Formato de email invalido";
    } else if (input.email.length >= 50) {
      errors.email = "El email es muy largo";
    }
     // Validaciones para el campo de issue
    if (!input.issue.trim()) {
      errors.issue = "Este campo no puede estar vacio";
    } else if (input.issue.length > 50) {
      errors.issue = "El asunto es muy largo";
    }
    //Validaciones para el campo del message
    if (!input.message.trim()) {
      errors.message = "Este campo no puede estar vacio";
    } else if (input.message.length < 50) {
      errors.message = "El mensaje es muy corto";
    }
    return errors;
  };
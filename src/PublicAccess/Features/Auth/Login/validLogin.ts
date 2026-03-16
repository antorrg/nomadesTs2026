//import { type LoginUser } from "../../../types/user";

export const ValidLogin = (input: any) => {
  let errors: any = {};

  // Using Regular Expressions to validate the appropriate use
  const validEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const validPass = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


  // Validaciones para el campo de email
  if (!input.email.trim()) {
    errors.email = "Este campo no puede estar vacio";
  } else if (!validEmail.test(input.email.trim())) {
    errors.email = "Formato de email invalido";
  } else if (input.email.length >= 50) {
    errors.email = "El email es muy largo";
  }

  // Validaciones para el campo de contraseña
  if (!input.password.trim()) {
    errors.password = "Este campo no puede estar vacio";
  } else if (!validPass.test(input.password.trim())) {
    errors.password = "La contrasena debe contener al menos una mayuscula y un numero";
  } else if (input.password.length < 8) {
    errors.password = "La contrasena debe tener al menos 8 caracteres";
  }

  return errors;
};

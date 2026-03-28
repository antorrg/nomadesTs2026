import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidLogin } from "./validLogin";
import type { LoginUser } from "../../../../types/user";



type Props = {
  loginFn: (data: LoginUser) => Promise<any>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>
};

const Login: React.FC<Props> = ({ loginFn, setLoad }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const closeLogin = () => {
    navigate("/");
  };
  const successLogin = () => {
    setLoad(false);
    navigate("/admin");
  };
  const loginReject = () => {
    setLoad(false);
  };

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
    setError({
      ...error,
      [name]: ValidLogin({ ...input, [name]: value })[name],
    });
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoad(true);
    try {
      const response = await loginFn(input as any);
      successLogin()
      return response
    } catch (error) {
      loginReject()
      console.error(error);
    }

    setInput({
      email: "",
      password: "",
    });
  };
  const permit =
    !input.email.trim() ||
      !input.password.trim() ||
      error.email ||
      error.password
      ? true
      : false;

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center">
        <img
          className="mb-4"
          src="/nomadesFav.png"
          alt=""
          width="95"
          height="57"
        />
        <button
          type="button"
          onClick={closeLogin}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <h1 className="h3 mb-3 fw-normal">Inicie sesion</h1>
      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          value={input.email}
          name="email"
          placeholder="name@example.com"
          onChange={handleChange}
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      {error.email && <p className="errorMsg">{error.email}</p>}
      <div className="form-floating d-flex justify-content-between align-items-center">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          value={input.password}
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <label htmlFor="floatingPassword">Password</label>
        <button
          type="button"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          className="buttonEye"
        >
          <i
            className={
              showPassword ? "bi bi-eye-slash" : "bi bi-eye"
            }
          ></i>
        </button>
      </div>
      {error.password && (
        <p className="errorMsg">{error.password}</p>
      )}
      <button
        className="btn btn-sm btn-primary w-100 py-2"
        onClick={handleSubmit}
        disabled={permit}
      >
        Iniciar
      </button>
    </section>
  );
};

export default Login;

import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../../../../store/hooks";
import { getUserById } from "../userAdminSlice";

import { userApi } from "../../../AdminApi/userApi";
import { passwordChangeSchema, type PasswordChangeFormValues } from "../userSchema";
import type { IUser } from "../../../../types/user";

type EditPasswordProps = {
  show: boolean;
  handleClose: () => void;
  user: IUser;
  onSuccess: () => void;
};

const EditPassword = ({ show, handleClose, user, onSuccess }: EditPasswordProps) => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    const confirmed = await userApi.confirmAction({ title: '¿Está seguro de actualizar la contraseña?' });
    if (!confirmed) return;

    try {
      console.log('passwordUpd: ', {id:user.id, password:data.password,newPassword: data.newPassword})
      await userApi.changePassword(user.id, {
        password: data.password,
        newPassword: data.newPassword,
      } as any); // Tipamos a any por extender de UpgradeUser al usar userApi, pero controlamos en data los passwords
      
      onSuccess();
      reset();
      dispatch(getUserById(user.id));
    } catch (error) {
      console.error(error);
    }
  };

  const closeForm = () => {
    reset();
    handleClose();
  };

  return (
    <Modal show={show} onHide={closeForm} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña actual:</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña actual"
                autoComplete="off"
                isInvalid={!!errors.password}
                {...register("password")}
                disabled={isSubmitting}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña:</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword1 ? "text" : "password"}
                placeholder="Nueva contraseña"
                autoComplete="off"
                isInvalid={!!errors.newPassword}
                {...register("newPassword")}
                disabled={isSubmitting}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword1(!showPassword1)}
                tabIndex={-1}
              >
                <i className={showPassword1 ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.newPassword?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirme su nueva contraseña:</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirmar nueva contraseña"
                autoComplete="off"
                isInvalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword2(!showPassword2)}
                tabIndex={-1}
              >
                <i className={showPassword2 ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeForm} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" animation="border" /> : "Cambiar contraseña"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPassword;

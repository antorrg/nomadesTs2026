import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { type IUser, type UserRole } from '../../../../../types/user';
import { userApi } from '../../../../AdminApi/userApi';

const roles: UserRole[] = ['ADMIN', 'MODERATOR', 'USER', 'EMPLOYEE'];

type ChangeRoleProps = {
    show: boolean;
    handleClose: () => void;
    user: IUser;
    onSuccess: () => void;
}

type FormValues = {
    role: UserRole;
}

const ChangeRole = ({ show, handleClose, user, onSuccess }: ChangeRoleProps) => {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { role: user.role },
    });

    const onSubmit = async (data: FormValues) => {
        const confirmed = await userApi.confirmAction({ title: '¿Está seguro de actualizar el rol?' });
        if (!confirmed) return;

        try {
            await userApi.upgradeRole(user.id, {
                enabled: user.enabled,
                role: data.role
            });
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Cambio de rol
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar el nuevo rol:</Form.Label>
                        <Form.Select {...register("role")} disabled={isSubmitting}>
                            {roles.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Guardar Cambios'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ChangeRole;

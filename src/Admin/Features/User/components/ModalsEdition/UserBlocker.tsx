import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import { type IUser } from '../../../../../types/user';
import { userApi } from '../../../../AdminApi/userApi';

type UserBlockerProps = {
    show: boolean;
    handleClose: () => void;
    user: IUser;
    onSuccess: () => void;
}

type FormValues = {
    enabled: string;
}

const UserBlocker = ({ show, handleClose, user, onSuccess }: UserBlockerProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { enabled: user.enabled ? "true" : "false" },
    });

    const onSubmit = async (data: FormValues) => {
        const confirmed = await userApi.confirmAction({ title: '¿Está seguro de realizar esta acción?' });
        if (!confirmed) return;

        try {
            await userApi.upgradeRole(user.id, {
                enabled: data.enabled === "true",
                role: user.role
            });
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Estado de {user.nickname || user.name}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar el estado:</Form.Label>
                        <Controller
                            name="enabled"
                            control={control}
                            render={({ field }) => (
                                <Form.Select {...field} disabled={isSubmitting}>
                                    <option value="true">Habilitado</option>
                                    <option value="false">Bloqueado</option>
                                </Form.Select>
                            )}
                        />
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

export default UserBlocker;

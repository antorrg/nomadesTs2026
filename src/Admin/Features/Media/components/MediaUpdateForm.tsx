import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { mediaUpdateSchema, type MediaUpdateFormData } from "../validations/mediaSchema";
import GenericButton from "../../../../components/GenericButton/GenericButton";

type MediaUpdateFormProps = {
    defaultValues: MediaUpdateFormData;
    onSubmit: (data: MediaUpdateFormData) => void;
    onCancel: () => void;
};

export function MediaUpdateForm({ defaultValues, onSubmit, onCancel }: MediaUpdateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<MediaUpdateFormData>({
        resolver: zodResolver(mediaUpdateSchema) as any,
        defaultValues,
    });

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                <div className="row">
                    <div className="mb-3 form-check form-switch col-md-5">
                        <Controller
                            control={control}
                            name="enabled"
                            render={({ field }) => (
                                <Form.Check
                                    type="switch"
                                    id="enabled-switch"
                                    label="Mostrar elemento"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título:</label>
                    <input
                        {...register("title")}
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        type="text"
                        id="title"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="url" className="form-label">URL del Video:</label>
                    <input
                        {...register("url")}
                        className={`form-control ${errors.url ? "is-invalid" : ""}`}
                        type="text"
                        id="url"
                    />
                    {errors.url && <div className="invalid-feedback">{errors.url.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label">Descripción:</label>
                    <textarea
                        {...register("text")}
                        className={`form-control ${errors.text ? "is-invalid" : ""}`}
                        id="text"
                        rows={3}
                    />
                    {errors.text && <div className="invalid-feedback">{errors.text.message}</div>}
                </div>

                <div className="d-flex flex-row mt-4 mb-5">
                    <GenericButton
                        className="btn btn-md btn-secondary mb-3 me-2"
                        type="button"
                        buttonText="Cancelar"
                        onClick={onCancel}
                    />
                    <button
                        type="submit"
                        className="btn btn-md btn-primary mb-3"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
                    </button>
                </div>
            </form>
        </div>
    );
}

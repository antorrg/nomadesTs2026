import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { frontPageUpdateSchema, type FrontPageUpdateFormData } from "../validations/frontPageSchema";
import GenericButton from "../../../../components/GenericButton/GenericButton";
import SelectImages from "../../Images/SelectImages/SelectImages";

type FrontPageUpdateFormProps = {
    defaultValues: FrontPageUpdateFormData;
    onSubmit: (data: FrontPageUpdateFormData) => void;
    onCancel: () => void;
};

export function FrontPageUpdateForm({ defaultValues, onSubmit, onCancel }: FrontPageUpdateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FrontPageUpdateFormData>({
        resolver: zodResolver(frontPageUpdateSchema) as any,
        defaultValues,
    });

    const useImg = watch("useImg");

    useEffect(() => {
        // Observers can go here without immediately rewriting picture on load
    }, [useImg]);

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
             <SelectImages control={control as any} setValue={setValue as any} useImg={useImg as boolean} />

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Título:
                    </label>
                    <input
                        {...register("title")}
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        type="text"
                        id="title"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="info_header" className="form-label">
                        Información de posicionamiento:
                    </label>
                    <input
                        {...register("info_header")}
                        className={`form-control ${errors.info_header ? "is-invalid" : ""}`}
                        type="text"
                        id="info_header"
                    />
                    {errors.info_header && <div className="invalid-feedback">{errors.info_header.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Descripción:
                    </label>
                    <textarea
                        {...register("description")}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        id="description"
                        rows={3}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>

                <div className="row">
                    <div className="mb-3 form-check form-switch col-md-5">
                        <Controller
                            control={control}
                            name="enabled"
                            render={({ field }) => (
                                <Form.Check
                                    type="switch"
                                    id="enabled-switch"
                                    label="Mostrar item"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                    </div>
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

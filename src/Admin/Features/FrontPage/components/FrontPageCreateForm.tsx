import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { frontPageCreateSchema, type FrontPageCreateFormData } from "../validations/frontPageSchema";
import ImageSelector from "../../Images/SelectImages/ImageSelector";
import ImageUploader from "../../Images/SelectImages/ImageUploader";
import GenericButton from "../../../../components/GenericButton/GenericButton";

type FrontPageCreateFormProps = {
    defaultValues?: Partial<FrontPageCreateFormData>;
    onSubmit: (data: FrontPageCreateFormData) => void;
    onCancel: () => void;
};

export function FrontPageCreateForm({ defaultValues, onSubmit, onCancel }: FrontPageCreateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FrontPageCreateFormData>({
        resolver: zodResolver(frontPageCreateSchema) as any,
        defaultValues: {
            title: defaultValues?.title ?? "",
            picture: defaultValues?.picture ?? null,
            info_header: defaultValues?.info_header ?? "",
            description: defaultValues?.description ?? "",
            enabled: defaultValues?.enabled ?? true, // explicitly true as requested
            useImg: defaultValues?.useImg ?? false,
        },
    });

    const useImg = watch("useImg");

    useEffect(() => {
        setValue("picture", null);
    }, [useImg, setValue]);

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                <div className="row">
                    {useImg ? (
                        <div className="col-md-6 mb-3">
                            <Controller
                                name="picture"
                                control={control}
                                render={({ field }) => (
                                    <ImageSelector value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>
                    ) : (
                        <div className="col-md-6 mb-3">
                            <Controller
                                name="picture"
                                control={control}
                                render={({ field }) => (
                                    <ImageUploader
                                        titleField="Imagen principal:"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    )}
                </div>

                <div className="mb-3 form-check form-switch">
                    <Controller
                        name="useImg"
                        control={control}
                        render={({ field }) => (
                            <Form.Check
                                type="switch"
                                id="imgUrlSwitch"
                                checked={field.value || false}
                                label="Active para elegir imagen guardada"
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                </div>

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
                        {isSubmitting ? "Creando..." : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
}

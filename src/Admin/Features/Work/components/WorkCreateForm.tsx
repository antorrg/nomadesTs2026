import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { workCreateSchema, type WorkCreateFormData } from "../validations/workSchema";
import SelectImages from "../../Images/SelectImages/SelectImages";
import GenericButton from "../../../../components/GenericButton/GenericButton";

type WorkCreateFormProps = {
    defaultValues?: Partial<WorkCreateFormData>;
    onSubmit: (data: WorkCreateFormData) => void;
    onCancel: () => void;
};

export function WorkCreateForm({ defaultValues, onSubmit, onCancel }: WorkCreateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<WorkCreateFormData>({
        resolver: zodResolver(workCreateSchema) as any,
        defaultValues: {
            title: defaultValues?.title ?? "",
            picture: defaultValues?.picture ?? null,
            text: defaultValues?.text ?? "",
            enabled: defaultValues?.enabled ?? false,
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
                    <label htmlFor="text" className="form-label">
                        Texto:
                    </label>
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
                        {isSubmitting ? "Creando..." : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
}

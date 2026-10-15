import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { workUpdateSchema, type WorkUpdateFormData } from "../validations/workSchema";
import SelectImages from "../../Images/SelectImages/SelectImages";
import GenericButton from "../../../../components/GenericButton/GenericButton";
import RichTextEditor from "../../../components/RichTextEditor";

type WorkUpdateFormProps = {
    defaultValues: WorkUpdateFormData;
    onSubmit: (data: WorkUpdateFormData) => void;
    onCancel: () => void;
};

export function WorkUpdateForm({ defaultValues, onSubmit, onCancel }: WorkUpdateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<WorkUpdateFormData>({
        resolver: zodResolver(workUpdateSchema) as any,
        defaultValues,
    });

    const useImg = watch("useImg");

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>

            <SelectImages control={control as any} setValue={setValue as any} useImg={useImg as boolean} />

               
                    <div className="mb-3 form-check form-switch">
                        <Controller
                            name="saver"
                            control={control}
                            render={({ field }) => (
                                <Form.Check
                                    type="switch"
                                    id="saverSwitch"
                                    checked={field.value || false}
                                    label="Guardar imagen para su posterior uso"
                                    onChange={field.onChange}
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
                    <label htmlFor="text" className="form-label">
                        Texto:
                    </label>
                    <Controller
                        control={control}
                        name="text"
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                isInvalid={!!errors.text}
                            />
                        )}
                    />
                    {errors.text && <div className="text-danger small mt-1">{errors.text.message}</div>}
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

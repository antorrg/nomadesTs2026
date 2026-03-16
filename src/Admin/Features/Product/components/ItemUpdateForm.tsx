import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import ImageSelector from "../../Images/SelectImages/ImageSelector";
import ImageUploader from "../../Images/SelectImages/ImageUploader";
import DoubleButton from "./DoubleButton/DoubleButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ItemUpdateFormData, itemUpdateSchema } from "../validations/productSchema";

interface ItemUpdateFormProps {
    defaultValues: ItemUpdateFormData;
    onSubmit: (data: ItemUpdateFormData) => void;
    onCancel: () => void;
}

export function ItemUpdateForm({ defaultValues, onSubmit, onCancel }: ItemUpdateFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ItemUpdateFormData>({
        resolver: zodResolver(itemUpdateSchema) as any,
        defaultValues,
    });

    const useImg = watch("useImg");

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
                                        titleField="Imagen del item:"
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
                                id="useImg"
                                checked={field.value || false}
                                label={
                                    field.value
                                        ? "Desactive para subir una imagen nueva"
                                        : "Active para elegir imagen guardada"
                                }
                                onChange={(e) => {
                                    field.onChange(e.target.checked);
                                    setValue("picture", null);
                                }}
                            />
                        )}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label">
                        Texto del Item:
                    </label>
                    <input
                        {...register("text")}
                        className={`form-control ${errors.text ? "is-invalid" : ""}`}
                        type="text"
                        id="text"
                        placeholder="Ej. Característica 1"
                    />
                    {errors.text && <div className="invalid-feedback">{errors.text.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="enabled" className="form-label">
                        Mostrar al publico
                    </label>
                    <Controller
                        name="enabled"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="form-select mb-2"
                                id="enabled"
                                value={field.value ? "true" : "false"}
                                onChange={(e) => field.onChange(e.target.value === "true")}
                            >
                                <option value="true">Mostrar</option>
                                <option value="false">No mostrar</option>
                            </select>
                        )}
                    />
                </div>

                <div className="mb-3 form-check form-switch">
                    <Controller
                        name="saver"
                        control={control}
                        render={({ field }) => (
                            <Form.Check
                                type="switch"
                                id="saver"
                                checked={field.value}
                                label={
                                    field.value
                                        ? "Desactive para eliminar imagen antigua"
                                        : "Active para conservar imagen antigua"
                                }
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                </div>

                <div className="d-flex flex-row mt-4 mb-5">
                    <DoubleButton
                        className1="btn btn-sm btn-primary mb-3 me-2"
                        type1="submit"
                        id1="submitButton"
                        buttonText1={isSubmitting ? "Actualizando..." : "Actualizar Item"}
                        disabled1={isSubmitting}
                        onClick1={() => { }}
                        className2="btn btn-sm btn-secondary mb-3"
                        type2="button"
                        onClick2={onCancel}
                        buttonText2="Cancelar"
                    />
                </div>
            </form>
        </div>
    );
}

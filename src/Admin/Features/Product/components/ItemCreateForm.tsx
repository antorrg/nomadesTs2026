import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import SelectImages from "../../Images/SelectImages/SelectImages";
import GenericButton from "../../../../components/GenericButton/GenericButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ItemCreateFormData, itemCreateSchema } from "../validations/productSchema";

interface ItemCreateFormProps {
    productId: number;
    onSubmit: (data: ItemCreateFormData) => void;
    onCancel: () => void;
}

export function ItemCreateForm({ productId, onSubmit, onCancel }: ItemCreateFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ItemCreateFormData>({
        resolver: zodResolver(itemCreateSchema) as any,
        defaultValues: {
            ProductId: productId,
            text: "",
            picture: null,
            useImg: false
        },
    });

    const useImg = watch("useImg");

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                {/* ProductId */}
                <input type="hidden" {...register("ProductId", { valueAsNumber: true })} />

            <SelectImages control={control as any} setValue={setValue as any} useImg={useImg as boolean} />

                <div className="mb-3 form-check form-switch">
                    <Controller
                        name="useImg"
                        control={control}
                        render={({ field }) => (
                            <Form.Check
                                type="switch"
                                id="useImg"
                                checked={field.value || false}
                                label="Active para elegir imagen guardada para este item"
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
                        {isSubmitting ? "Guardando..." : "Guardar Item"}
                    </button>
                </div>
            </form>
        </div>
    );
}

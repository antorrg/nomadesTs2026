import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { productUpdateSchema, type ProductUpdateFormData } from "../validations/productSchema";
import ImageSelector from "../../Images/SelectImages/ImageSelector";
import ImageUploader from "../../Images/SelectImages/ImageUploader";
import InfoFormField from "../../../InfoFormField";
import { aboutSeo } from "../../../../utils/infoHelpers";
import DoubleButton from "./DoubleButton/DoubleButton";

type ProductUpdateFormProps = {
    defaultValues: Partial<ProductUpdateFormData>;
    onSubmit: (data: ProductUpdateFormData) => void;
    onCancel: () => void;
};

export function ProductUpdateForm({ defaultValues, onSubmit, onCancel }: ProductUpdateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductUpdateFormData>({
        resolver: zodResolver(productUpdateSchema) as any,
        defaultValues: defaultValues || {},
    });

    const useImg = watch("useImg");

    return (
        <div className="container mt-2">
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
                                        titleField="Imagen:"
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
                                onChange={(e) => {
                                    field.onChange(e.target.checked);
                                    setValue("picture", null);
                                }}
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
                        Info posicionamiento:
                    </label>
                    <InfoFormField info={aboutSeo} place="bottom" />
                    <textarea
                        {...register("info_header")}
                        className="form-control"
                        id="info_header"
                        rows={3}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="info_body" className="form-label">
                        Descripción:
                    </label>
                    <textarea
                        {...register("info_body")}
                        className="form-control"
                        id="info_body"
                        rows={3}
                    />
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
                                className="form-select"
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
                        className1="btn btn-md btn-primary mb-3 me-2"
                        type1="submit"
                        id1="submitButton"
                        buttonText1={isSubmitting ? "Actualizando..." : "Actualizar"}
                        disabled1={isSubmitting}
                        onClick1={() => { }}
                        className2="btn btn-md btn-secondary mb-3"
                        type2="button"
                        onClick2={onCancel}
                        buttonText2="Cancelar"
                    />
                </div>
            </form>
        </div>
    );
}

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { highLightCreateSchema, type HighLightCreateFormData } from "../validations/highLightSchema";
import SelectImages from "../../Images/SelectImages/SelectImages";
import GenericButton from "../../../../components/GenericButton/GenericButton";
import Loader2 from "../../../../components/Loader2";
import RichTextEditor from "../../../components/RichTextEditor";

type HighLightCreateFormProps = {
    defaultValues?: Partial<HighLightCreateFormData>;
    onSubmit: (data: HighLightCreateFormData) => void;
    onCancel: () => void;
    loader: boolean
};

export function HighLightCreateForm({ defaultValues, onSubmit, onCancel, loader }: HighLightCreateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<HighLightCreateFormData>({
        resolver: zodResolver(highLightCreateSchema) as any,//eslint-disable-line
        defaultValues: {
            title: defaultValues?.title ?? "",
            picture: defaultValues?.picture ?? null,
            text: defaultValues?.text ?? "",
            showTitle: defaultValues?.showTitle ?? true,
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
            {loader ?
                <Loader2
                    fullScreen={false}
                    scale={0.5}
                />
                :
                <>
                <SelectImages control={control as any} setValue={setValue as any} useImg={useImg as boolean} />{/* eslint-disable-line */}

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
                            name="showTitle"
                            render={({ field }) => (
                                <Form.Check
                                    type="switch"
                                    id="showTitle-switch"
                                    label="Mostrar título"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                    </div>
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
                </>
                }
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
                        disabled={isSubmitting || loader}
                    >
                        {isSubmitting ? "Creando..." : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
}

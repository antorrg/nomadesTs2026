import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { aboutUpdateSchema, type AboutUpdateFormData } from "../validations/aboutSchema";
import GenericButton from "../../../../components/GenericButton/GenericButton";
import SelectImages from "../../Images/SelectImages/SelectImages";
import InfoFormField from "../../../InfoFormField";
import { aboutImgShowExplanation, aboutEnabledExplanation } from "../../../../utils/infoHelpers";

import RichTextEditor from "../../../components/RichTextEditor";

type AboutUpdateFormProps = {
    defaultValues: AboutUpdateFormData;
    onSubmit: (data: AboutUpdateFormData) => void;
    onCancel: () => void;
};

export function AboutUpdateForm({ defaultValues, onSubmit, onCancel }: AboutUpdateFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AboutUpdateFormData>({
        resolver: zodResolver(aboutUpdateSchema) as any,
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
                        Texto principal:
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

                <div className="row my-3">
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <Controller
                            control={control}
                            name="imgShow"
                            render={({ field }) => (
                                <Form.Check
                                    type="switch"
                                    id="imgShow-switch-update"
                                    label={field.value ? "Modo: Con Imagen" : "Modo: Sólo Texto"}
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                        <InfoFormField info={aboutImgShowExplanation} place="bottom" />
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <Controller
                            control={control}
                            name="enabled"
                            render={({ field }) => (
                                <Form.Check
                                    type="switch"
                                    id="enabled-switch-update"
                                    label={field.value ? "Visible" : "Oculto"}
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                        <InfoFormField info={aboutEnabledExplanation} place="bottom" />
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

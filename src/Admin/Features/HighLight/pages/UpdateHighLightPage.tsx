import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HighLightUpdateForm } from "../components/HighLightUpdateForm";
import { type HighLightUpdateFormData } from "../validations/highLightSchema";
import { useReduxFetch } from "../../../../hooks/useReduxFetch";
import { getHighLightById, clearSelectedHighLight } from "../highLightAdminSlice";
import { highLightApi } from '../../../AdminApi/highLightApi';
import { type UpdateHighLight } from "../../../../types/hightLight";
import Loader2 from "../../../../components/Loader2";

const UpdateHighLightPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { selectedHighLight } = useReduxFetch({
        action: getHighLightById,
        arg: Number(id),
        selector: (state) => state.adminHigh,
        deps: [id],
        condition: !!id,
        cleanupAction: clearSelectedHighLight
    });

    const [load, setLoad] = useState<boolean>(false);

    const onClose = () => {
        navigate(-1);
        setLoad(false);
    };

    const handleSubmit = async (data: HighLightUpdateFormData) => {
        const confirmed = await highLightApi.confirmAction({ title: 'Esta seguro de actualizar este destacado?' });
        if (!confirmed) return;

        setLoad(true);

        const payload: UpdateHighLight = {
            title: data.title,
            picture: data.picture ?? undefined,
            text: data.text,
            showTitle: data.showTitle ?? true,
            order: data.order ?? null,
            enabled: data.enabled ?? false,
            saver: data.saver,
            useImg: data.useImg,
        };

        try {
            const res = await highLightApi.update(Number(id), payload);
            if (res) {
                onClose();
            } else {
                setLoad(false);
            }
        } catch (e) {
            console.error(e);
            setLoad(false);
        }
    };

    // Evita mostrar datos de un destacado anterior mientras carga el actual
    const isCurrent = selectedHighLight && Number(selectedHighLight.id) === Number(id);

    return (
        <div className="imageBack">
            <div className="coverBack">
                <div className="container-md modal-content colorBack formProductContainer rounded-3 shadow p-4">
                    <h2 className="title-form m-0">Actualizar destacado:</h2>
                    {(!isCurrent && !load)?
                    <Loader2
                        fullScreen={false}
                        scale={0.5}
                     />
                    :
                    <>
                    {selectedHighLight && (
                        <HighLightUpdateForm
                        defaultValues={{
                            title: selectedHighLight.title || "",
                            picture: selectedHighLight.picture || null,
                            text: selectedHighLight.text || "",
                            showTitle: typeof selectedHighLight.showTitle === "boolean" ? selectedHighLight.showTitle : true,
                            order: selectedHighLight.order ?? null,
                            enabled: typeof selectedHighLight.enabled === "boolean" ? selectedHighLight.enabled : true,
                            saver: false,
                            useImg: false,
                        }}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        loader={load}
                        />
                    )}
                    </>
                     }
                </div>
            </div>
        </div>
    );
};

export default UpdateHighLightPage;

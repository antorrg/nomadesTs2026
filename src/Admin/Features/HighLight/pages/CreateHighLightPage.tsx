import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HighLightCreateForm } from "../components/HighLightCreateForm";
import { type HighLightCreateFormData } from "../validations/highLightSchema";
import { highLightApi } from "../../../AdminApi/highLightApi";
import { type CreateHighLight } from "../../../../types/hightLight";


const CreateHighLightPage = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState<boolean>(false);

    const onClose = () => {
        setLoad(false);
        navigate(-1);
    };

    const handleSubmit = async (data: HighLightCreateFormData) => {
        const confirmed = await highLightApi.confirmAction({ title: 'Esta seguro de crear este destacado?' });
        if (!confirmed) return;

        setLoad(true);

        const payload: CreateHighLight = {
            title: data.title,
            picture: data.picture ?? undefined,
            text: data.text,
            showTitle: data.showTitle ?? true,
            enabled: data.enabled ?? false,
            useImg: data.useImg,
        };

        try {
            const res = await highLightApi.create(payload);
            if (res) onClose();
            else setLoad(false);
        } catch (e) {
            console.error(e)
            setLoad(false);
        }
    };

    return (
        <div className="imageBack">
            <div className="coverBack">
                <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow p-4">
                    <h3 className="mb-4">Creación de Destacado: </h3>
                    <HighLightCreateForm
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        loader={load}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateHighLightPage;

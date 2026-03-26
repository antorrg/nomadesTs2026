import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaCreateForm } from "../components/MediaCreateForm";
import { type MediaCreateFormData } from "../validations/mediaSchema";
import { mediaApi } from "../../../AdminApi/mediaApi";
import { type CreateMedia } from "../../../../types/media";
import Loader2 from "../../../../components/Loader2";
import { displayType } from "../helperVideo";

const CreateMediaPage = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [load, setLoad] = useState(false);

    const onClose = () => {
        setLoad(false);
        navigate(-1);
    };
    const showType = displayType(type!)
 

    const handleSubmit = async (data: MediaCreateFormData) => {
        const confirmed = await mediaApi.confirmAction({ title: 'Esta seguro de crear este elemento?' });
        if (!confirmed) return;

        setLoad(true);

        const payload: CreateMedia = {
            title: data.title,
            text: data.text,
            url: data.url,
            enabled: data.enabled ?? true,
            type: showType ?? 'default', 
        };

        try {
            const res = await mediaApi.create(payload);
            if (res) onClose();
            else setLoad(false);
        } catch (e) {
            console.error(e)
            setLoad(false);
        }
    };

    return (
        <div className="imageBack">
            {load ? (
                <Loader2 />
            ) : (
                <div className="coverBack">
                    <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow p-4">
                        <h3 className="mb-4">Guardar Video de {showType}:</h3>
                        <MediaCreateForm
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateMediaPage;

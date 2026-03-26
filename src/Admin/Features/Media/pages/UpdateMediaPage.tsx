import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MediaUpdateForm } from "../components/MediaUpdateForm";
import { type MediaUpdateFormData } from "../validations/mediaSchema";
import { useReduxFetch } from "../../../../hooks/useReduxFetch";
import { getMediaById } from "../mediaAdminSlice";
import { mediaApi } from '../../../AdminApi/mediaApi';
import Loader2 from "../../../../components/Loader2";


const UpdateMediaPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const urlType = searchParams.get("type") || "video";

    const { selectedMedia } = useReduxFetch({
        action: getMediaById,
        arg: Number(id),
        selector: (state) => state.adminMedia,
        deps: [id],
        condition: !!id
    });
    
    const showType = urlType;
    
    const [load, setLoad] = useState(false);

    const onClose = () => {
        navigate(-1);
        setLoad(false);
    };

    const handleSubmit = async (data: MediaUpdateFormData) => {
        const confirmed = await mediaApi.confirmAction({ title: 'Esta seguro de actualizar este elemento?' });
        if (!confirmed) return;

        setLoad(true);

        const payload = {
            title: data.title,
            text: data.text,
            url: data.url,
            enabled: data.enabled ?? true,
            type: selectedMedia?.type || urlType || 'default', 
        };

        try {
            const res = await mediaApi.update(Number(id), payload);
            if(res){
               onClose();
            } else {
               setLoad(false);
            }
        } catch (e) {
            console.error(e);
            setLoad(false);
        }
    };

    if (!selectedMedia && !load) {
        return <div className="imageBack"><Loader2 /></div>
    }

    return (
        <div className="imageBack">
            {load ? (
                <Loader2 />
            ) : (
                <div className="coverBack">
                    <div className="container-md modal-content colorBack formProductContainer rounded-3 shadow p-4">
                        <h2 className="title-form m-0">Actualizar publicacion {showType}:</h2>
                        {selectedMedia && (
                            <MediaUpdateForm
                                defaultValues={{
                                    title: selectedMedia.title || "",
                                    text: selectedMedia.text || "",
                                    url: selectedMedia.url || "",
                                    enabled: typeof selectedMedia.enabled === "boolean" ? selectedMedia.enabled : true,
                                }}
                                onSubmit={handleSubmit}
                                onCancel={onClose}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateMediaPage;

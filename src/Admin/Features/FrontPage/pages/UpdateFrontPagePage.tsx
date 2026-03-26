import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FrontPageUpdateForm } from "../components/FrontPageUpdateForm";
import { type FrontPageUpdateFormData } from "../validations/frontPageSchema";
import { useReduxFetch } from "../../../../hooks/useReduxFetch";
import { getLandingById } from "../homeaAdminSlice";
import { frontPageApi } from '../../../AdminApi/frontPageApi';
import Loader2 from "../../../../components/Loader2";

const UpdateFrontPagePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { selectedLanding } = useReduxFetch({
        action: getLandingById,
        arg: Number(id),
        selector: (state: any) => state.adminHome,
        deps: [id],
        condition: !!id
    });
    
    // Extracción de results
    const item = selectedLanding//?.results;

    const [load, setLoad] = useState(false);

    const onClose = () => {
        navigate(-1);
        setLoad(false);
    };

    const handleSubmit = async (data: FrontPageUpdateFormData) => {
        const confirmed = await frontPageApi.confirmAction({ title: 'Esta seguro de actualizar este elemento?' });
        if (!confirmed) return;

        setLoad(true);

        const payload = {
            title: data.title,
            picture: data.picture ?? undefined,
            info_header: data.info_header,
            description: data.description,
            enabled: data.enabled ?? true,
            saver: data.saver,
            useImg: data.useImg,
        };

        try {
            const res = await frontPageApi.update(Number(id), payload);
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

    if (!item && !load) {
        return <div className="imageBack"><Loader2 /></div>
    }

    return (
        <div className="imageBack">
            {load ? (
                <Loader2 />
            ) : (
                <div className="coverBack">
                    <div className="container-md modal-content colorBack formProductContainer rounded-3 shadow p-4">
                        <h2 className="title-form m-0">Actualizar Portada:</h2>
                        {item && (
                            <FrontPageUpdateForm
                                defaultValues={{
                                    title: item.title || "",
                                    picture: item.picture || null,
                                    info_header: item.info_header || "",
                                    description: item.description || "",
                                    enabled: typeof item.enabled === "boolean" ? item.enabled : true,
                                    saver: false,
                                    useImg: false,
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

export default UpdateFrontPagePage;

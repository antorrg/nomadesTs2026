import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WorkUpdateForm } from "../components/WorkUpdateForm";
import { type WorkUpdateFormData } from "../validations/workSchema";
import { useReduxFetch } from "../../../../hooks/useReduxFetch";
import { getWorkById } from "../workAdminSlice";
import { workApi } from '../../../AdminApi/workApi';
import Loader2 from "../../../../components/Loader2";

const UpdateWorkPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { selectedWork } = useReduxFetch({
        action: getWorkById,
        arg: Number(id),
        selector: (state) => state.adminWork,
        deps: [id],
        condition: !!id
    });
    
    const [load, setLoad] = useState(false);

    const onClose = () => {
        navigate(-1);
        setLoad(false);
    };

    const handleSubmit = async (data: WorkUpdateFormData) => {
        const confirmed = await workApi.confirmAction({ title: 'Esta seguro de actualizar este trabajo?' });
        if (!confirmed) return;

        setLoad(true);

        const payload = {
            title: data.title,
            picture: data.picture ?? undefined,
            text: data.text,
            enabled: data.enabled ?? false,
            saver: data.saver,
            useImg: data.useImg,
        };

        try {
            const res = await workApi.update(Number(id), payload);
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

    if (!selectedWork && !load) {
        return <div className="imageBack"><Loader2 /></div>
    }

    return (
        <div className="imageBack">
            {load ? (
                <Loader2 />
            ) : (
                <div className="coverBack">
                    <div className="container-md modal-content colorBack formProductContainer rounded-3 shadow p-4">
                        <h2 className="title-form m-0">Actualizar "nuestro trabajo":</h2>
                        {selectedWork && (
                            <WorkUpdateForm
                                defaultValues={{
                                    title: selectedWork.title || "",
                                    picture: selectedWork.picture || null,
                                    text: selectedWork.text || "",
                                    enabled: typeof selectedWork.enabled === "boolean" ? selectedWork.enabled : true,
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

export default UpdateWorkPage;

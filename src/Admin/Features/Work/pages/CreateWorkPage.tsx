import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkCreateForm } from "../components/WorkCreateForm";
import { type WorkCreateFormData } from "../validations/workSchema";
import { workApi } from "../../../AdminApi/workApi";
import { type CreateWork } from "../../../../types/work";
import Loader2 from "../../../../components/Loader2";

const CreateWorkPage = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);

    const onClose = () => {
        setLoad(false);
        navigate(-1);
    };

    const handleSubmit = async (data: WorkCreateFormData) => {
        const confirmed = await workApi.confirmAction({ title: 'Esta seguro de crear este trabajo?' });
        if (!confirmed) return;

        setLoad(true);

        const payload: CreateWork = {
            title: data.title,
            picture: data.picture ?? undefined,
            text: data.text,
            enabled: data.enabled ?? false,
            useImg: data.useImg,
        };

        try {
            const res = await workApi.create(payload);
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
                        <h3 className="mb-4">Creación de Trabajo: </h3>
                        <WorkCreateForm
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateWorkPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FrontPageCreateForm } from "../components/FrontPageCreateForm";
import { type FrontPageCreateFormData } from "../validations/frontPageSchema";
import { frontPageApi } from "../../../AdminApi/frontPageApi";
import { type CreateFrontPage } from "../../../../types/frontPage";
import Loader2 from "../../../../components/Loader2";

const CreateFrontPagePage = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);

    const onClose = () => {
        setLoad(false);
        navigate(-1);
    };

    const handleSubmit = async (data: FrontPageCreateFormData) => {
        const confirmed = await frontPageApi.confirmAction({ title: 'Esta seguro de crear este elemento?' });
        if (!confirmed) return;

        setLoad(true);

        const payload: CreateFrontPage = {
            title: data.title,
            picture: data.picture ?? undefined,
            info_header: data.info_header,
            description: data.description,
            enabled: data.enabled ?? true,
            useImg: data.useImg,
        };

        try {
            const res = await frontPageApi.create(payload);
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
                        <h3 className="mb-4">Creación de Portada: </h3>
                        <FrontPageCreateForm
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateFrontPagePage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AboutCreateForm } from "../components/AboutCreateForm";
import { type AboutCreateFormData } from "../validations/aboutSchema";
import { aboutAdminApi } from "../../../AdminApi/aboutApi";
import { type CreateAbout } from "../../../../types/about";
import Loader2 from "../../../../components/Loader2";

const CreateAboutPage = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);

    const onClose = () => {
        setLoad(false);
        navigate(-1);
    };

    const handleSubmit = async (data: AboutCreateFormData) => {
        const confirmed = await aboutAdminApi.confirmAction({ title: '¿Está seguro de crear esta sección?' });
        if (!confirmed) return;

        setLoad(true);

        const payload: CreateAbout = {
            title: data.title,
            picture: data.picture ?? undefined,
            text: data.text,
            imgShow: data.imgShow ?? true,
            enabled: data.enabled ?? true,
            useImg: data.useImg,
        };

        try {
            const res = await aboutAdminApi.create(payload);
            if (res) onClose();
            else setLoad(false);
        } catch (e) {
            console.error(e);
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
                        <h3 className="mb-4">Creación de Sección Acerca de: </h3>
                        <AboutCreateForm
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAboutPage;

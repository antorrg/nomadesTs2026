import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AboutUpdateForm } from "../components/AboutUpdateForm";
import { type AboutUpdateFormData } from "../validations/aboutSchema";
import { useReduxFetch } from "../../../../hooks/useReduxFetch";
import { getAboutById, clearSelectedAbout } from "../aboutAdminSlice";
import { aboutAdminApi } from "../../../AdminApi/aboutApi";
import Loader2 from "../../../../components/Loader2";

const UpdateAboutPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { selectedAbout } = useReduxFetch({
        action: getAboutById,
        arg: Number(id),
        selector: (state: any) => state.adminAbout,
        deps: [id],
        condition: !!id,
        cleanupAction: clearSelectedAbout
    });

    const item = selectedAbout;

    const [load, setLoad] = useState(false);

    const onClose = () => {
        navigate(-1);
        setLoad(false);
    };

    const handleSubmit = async (data: AboutUpdateFormData) => {
        const confirmed = await aboutAdminApi.confirmAction({ title: '¿Está seguro de actualizar esta sección?' });
        if (!confirmed) return;

        setLoad(true);

        const payload = {
            title: data.title,
            picture: data.picture || item?.picture || undefined,
            text: data.text,
            imgShow: typeof data.imgShow === "boolean" ? data.imgShow : Boolean(Number(data.imgShow)),
            enabled: typeof data.enabled === "boolean" ? data.enabled : Boolean(Number(data.enabled)),
            saver: data.saver,
            useImg: data.useImg,
        };

        try {
            const res = await aboutAdminApi.update(Number(id), payload);
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
                        <h2 className="title-form m-0 mb-4">Actualizar Sección:</h2>
                        {item && (
                            <AboutUpdateForm
                                defaultValues={{
                                    title: item.title || "",
                                    picture: item.picture || null,
                                    text: item.text || "",
                                    imgShow: item.imgShow !== undefined ? Boolean(Number(item.imgShow)) : true,
                                    enabled: item.enabled !== undefined ? Boolean(Number(item.enabled)) : true,
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

export default UpdateAboutPage;

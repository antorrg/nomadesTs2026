import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductUpdateForm } from "../components/ProductUpdateForm";
import { type ProductUpdateFormData } from "../validations/productSchema";
import { useReduxFetch } from "../../../../hooks/useReduxFetch";
import { getProductById } from "../productAdminSlice";
import { productsApi } from '../../../AdminApi/productsApi';
import Loader2 from "../../../../components/Loader2";

const UpdateProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();


  const {selectedProduct}= useReduxFetch({
    action: getProductById,
    arg: Number(id),
    selector: (state) => state.adminProduct,
    deps: [id],
    condition: !!id
  });
 
  const [load, setLoad] = useState(false);

  const onClose = () => {
    navigate(-1);
    setLoad(false);
  };

  const onRetry = () => {
    setTimeout(() => {
      onClose();
    }, 3000);
  };



  const handleSubmit = async (data: ProductUpdateFormData) => {
    const confirmed = await productsApi.confirmAction({ title: "¿Está seguro de actualizar el producto?" });
    if (confirmed) {
      setLoad(true);

      const payload = {
        title: data.title,
        picture: data.picture ?? null,
        info_header: data.info_header ?? null,
        info_body: data.info_body ?? null,
        enabled: data.enabled ?? false,
        saver: data.saver,
        useImg: data.useImg,
      };

      try {
        await productsApi.update(Number(id), payload, { success: onClose, reject: onRetry });
      } catch (e) {
        console.error(e)
        setLoad(false)
      }
    }
  };

  if (!selectedProduct && !load) {
    return <div className="imageBack"><Loader2 /></div>
  }

  return (
    <div className="imageBack">
      {load ? (
        <Loader2 />
      ) : (
        <div className="coverBack">
          <div className="container-md modal-content colorBack formProductContainer rounded-3 shadow p-4">
            <h2 className="title-form m-0">Actualizar producto:</h2>
            {selectedProduct && (
              <ProductUpdateForm
                defaultValues={{
                  title: selectedProduct.title || "",
                  picture: selectedProduct.picture || null,
                  info_header: selectedProduct.info_header || "",
                  info_body: selectedProduct.info_body || "",
                  enabled: typeof selectedProduct.enabled === "boolean" ? selectedProduct.enabled : true,
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

export default UpdateProductPage;
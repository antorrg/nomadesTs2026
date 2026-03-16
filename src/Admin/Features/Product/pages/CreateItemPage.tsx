import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemCreateForm } from "../components/ItemCreateForm";
import { type ItemCreateFormData } from "../validations/productSchema";
import { productsApi } from "../../../AdminApi/productsApi";
import Loader2 from "../../../../components/Loader2";

const CreateItemPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [load, setLoad] = useState(false);

  const onClose = () => {
    setLoad(false);
  };

  const cancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (data: ItemCreateFormData) => {
    const confirmed = await productsApi.confirmAction({
      title: '¿Está seguro de crear el item?'
    })

    if (confirmed) {
      setLoad(true);

      const payload = {
        ProductId: data.ProductId,
        text: data.text,
        picture: data.picture ?? null,
        useImg: data.useImg
      };

      try {
        const result = await productsApi.createItem(payload);

        if (result) {
          alert("Item creado con éxito"); // Fallback alert
          navigate(-1);
        } else {
          alert("Error al crear item");
          onClose();
        }
      } catch (error) {
        alert("Error al procesar la solicitud");
        console.error(error);
        onClose();
      }
    }
  };

  if (!productId) {
    return <div>Error: Product ID is missing</div>;
  }

  return (
    <div className="section mt-5 mt-md-0 d-flex flex-column align-items-center">
      {load && <Loader2 />}

      <div className="card shadow-sm border-0 mb-4 p-4 w-100" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="title-form m-0">Agregar Nuevo Item</h2>
          <button className="btn btn-outline-secondary btn-sm" onClick={cancel}>
            Volver Atrás
          </button>
        </div>
{/* 
        <div className="alert alert-info py-2">
          Agregando ítem al producto ID: <strong>{productId}</strong>
        </div> */}

        <ItemCreateForm
          productId={Number(productId)}
          onSubmit={handleSubmit}
          onCancel={cancel}
        />
      </div>
    </div>
  );
};

export default CreateItemPage;
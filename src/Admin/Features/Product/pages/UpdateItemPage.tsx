import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemUpdateForm } from "../components/ItemUpdateForm";
import { type ItemUpdateFormData } from "../validations/productSchema";
import { productsApi } from "../../../AdminApi/productsApi";
import Loader2 from "../../../../components/Loader2";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getItem, clearSelectedItem } from "../productAdminSlice";

const UpdateItemPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const [load, setLoad] = useState(false);

  const selectedItem = useAppSelector(state => state.adminProduct.selectedItem);
  const adminLoading = useAppSelector(state => state.adminProduct.adminLoading);
  const error = useAppSelector(state => state.adminProduct.error);

  useEffect(() => {
    if (id) {
      dispatch(getItem(Number(id)));
    }
    return () => {
      dispatch(clearSelectedItem());
    }
  }, [id, dispatch]);

  const onClose = () => {
    setLoad(false);
  };

  const cancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (data: ItemUpdateFormData) => {
    if (!id) return;

    const confirmed = await productsApi.confirmAction({
      title: '¿Está seguro de actualizar este item?'
    });

    if (confirmed) {
      setLoad(true);

      const payload = {
        id: Number(id),
        text: data.text,
        picture: data.picture ?? null,
        useImg: data.useImg,
        saver: data.saver ?? false,
        enabled: data.enabled ?? false,
      };

      try {
        const result = await productsApi.updateItem(payload.id, payload);

        if (result) {
         // alert("Item actualizado con éxito"); // Fallback alert
          navigate(-1);
        } else {
         // alert("Error al actualizar item");
          onClose();
        }
      } catch (error) {
        //alert("Error al procesar la solicitud");
        console.error(error);
        onClose();
      }
    }
  };

  if (!id) {
    return <div>Error: Item ID is missing</div>;
  }

  if (adminLoading) {
    return <div className="d-flex justify-content-center mt-5"><Loader2 /></div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">Error: {error}</div>;
  }

  return (
    <div className="section mt-5 mt-md-0 d-flex flex-column align-items-center">
      {load && <Loader2 />}

      <div className="card shadow-sm border-0 mb-4 p-4 w-100" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="title-form m-0">Actualizar Item</h2>
          <button className="btn btn-outline-secondary btn-sm" onClick={cancel}>
            Volver Atrás
          </button>
        </div>

        {selectedItem && (
          <ItemUpdateForm
            defaultValues={{
              text: selectedItem.text ?? "",
              picture: selectedItem.picture ?? "",
              useImg: false, // IItem from type doesn't contain useImg natively so we provide a safe fallback locally for the form
              saver: true, // Default true on edit
              enabled: selectedItem.enabled ?? false
            }}
            onSubmit={handleSubmit}
            onCancel={cancel}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateItemPage;
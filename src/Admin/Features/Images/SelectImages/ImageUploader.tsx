import React, { useState, useEffect, type ChangeEvent } from "react";
import { imagesApi } from "../../../AdminApi/imagesApi";
import InfoFormField from "../../../InfoFormField"; 
import { imageUpladmessage } from "../../../../utils/infoHelpers";

type ImageUploaderProps = {
  titleField?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
}

const ImageUploader = ({ titleField = "Imagen:", value, onChange }: ImageUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [alert, setAlert] = useState<boolean>(false);

  // Actualiza previewUrl si el prop imageValue cambia
  useEffect(() => {
    if (value !== undefined) {
      setPreviewUrl(value);
      setImageUrl(value);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => setPreviewUrl(e.target?.result as string); // Previsualiza imagen seleccionada
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setPreviewUrl(value || null); // Restaura la imagen original si la hay
    onChange(value || null);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;
    try{
      const response = await imagesApi.upload(file)
      // Simular la respuesta para la demo
      if (response.url) {
        setImageUrl(response.url); // Actualiza imageUrl con la URL de la imagen cargada
        setPreviewUrl(response.url)
        onChange(response.url);
        console.log('imagen url: ', response.url)
        setAlert(true);
      }
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
    }
  };

  return (
    <div className="row">
      <div className="co-md-8 mb-3 me2">
        <section>
          <div className="d-flex justify-content-start align-items-center">
            <label className="form-label">{titleField}</label>
             <InfoFormField
              info={imageUpladmessage}
              place={"bottom"}
              action={"hover"}
            /> 
          </div>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
          {previewUrl && (
            <>
              {alert ? (
                <p className="text-success">Imagen cargada exitosamente</p>
              ) : (
                <p className="text-success">Imagen existente:</p>
              )}

              {file && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mr-3 mt-1 mb-1"
                  onClick={handleDelete}
                >
                  Borrar selección
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-sm btn-outline-primary mt-1 mb-1"
            disabled={!file}
          >
            Subir
          </button>
        </section>

        {imageUrl && !file ? (
          <div>
            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "20rem" }} />
          </div>
        )
        :
          <img
            src={previewUrl!}
            alt="Preview"
            style={{maxWidth: "20rem", marginTop: "10px" }}
          />
      }
      </div>
    </div>
  );
};

export default ImageUploader;

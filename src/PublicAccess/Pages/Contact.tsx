import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailForm from "../Features/Contact/EmailForm";
import MailReject from "../Features/Contact/MailReject";

const Contact = () => {
    const navigate = useNavigate();
  const [isReject, setIsReject] = useState<boolean>(false);

  const onClose = () => {
    setIsReject(false);
    navigate(-1);
  };

  return (
    <>
    <title>Nomades Cabañas de pastores Contacto</title>
    <meta name="description" content='Contactenos por email o whatsapp' />
    <div className="imageBack">
      <div className="coverMail">
        {isReject?
        <MailReject retry={onClose}/>
        :
        <EmailForm setIsReject={setIsReject}/>
        }
      </div>
    </div>
    </>
  )
}

export default Contact
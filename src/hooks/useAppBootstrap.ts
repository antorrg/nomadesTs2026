// app/hooks/useAppBootstrap.ts
import { useEffect } from "react";
import  interceptor  from "../api/network/interceptor";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export const useAppBootstrap = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToError = (status: number|string, message: string):void => {
      navigate("/error", { state: { status, message } });
    };

   // const eject = interceptor(logout, redirectToError);

    return () => interceptor(logout, redirectToError); // limpieza al desmontar
  }, [logout, navigate]);
};

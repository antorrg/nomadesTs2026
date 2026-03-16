import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { showSuccess } from '../../utils/toastify';
import { showConfirmationDialog } from '../../utils/sweetalert';
import TabsLayout from './TabsLayout';
import Products from '../Features/Product/pages/Products';
import AdminFrontPage from '../Features/FrontPage/AdminFrontPage';
import WorkView from '../Features/Work/WorkView';
import UserView from '../Features/User/UserView';
import ViewImages from '../Features/Images/ViewImages';
import VideosPage from '../Features/Media/videoTabsComponents/VideosPage'
import Config from '../Features/Config/Config'
import HelpView from './TabsComponents/HelpView';
import AboutView from '../Features/About/AboutView'



const TabsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lee el parámetro "tab" de la URL. Si no existe, usa un valor predeterminado.
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "producto";

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabChange = (activeTab: string) => {
    activeTab === "videos"
      ? navigate(`/admin?tab=videos&subtab=facebook`)
      : navigate(`/admin?tab=${activeTab}`);
    setActiveTab(activeTab);
  };

  const sessionCleaner = async () => {
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de cerrar sesión?"
    );
    if (confirmed) {
      showSuccess("Sesión cerrada");
      navigate("/");
      setTimeout(() => {
        logout();
      }, 1000);
    }
  };

  return (
    <>
      <TabsLayout
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        sessionCleaner={sessionCleaner}
      >
        {activeTab === "producto" && <Products />}
        {activeTab === "portada" && <AdminFrontPage />}
        {activeTab === "trabajo" && <WorkView/>}
        {activeTab === "usuarios" && <UserView/>}
        {activeTab === "imagenes" && <ViewImages />}
        {activeTab === "videos" && <VideosPage/>}
        {activeTab === "config" && <Config user={user!}/>}
        {activeTab === "acerca" && <AboutView/>}
        {activeTab === "ayuda" && <HelpView />}
      </TabsLayout>
    </>
  );
};

export default TabsPage;

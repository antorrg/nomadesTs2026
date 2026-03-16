import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../PublicAccess/Features/FrontPage/homeSlice';
import productReducer from '../PublicAccess/Features/Product/productSlice';
import mediaReducer from '../PublicAccess/Features/Media/mediaSlice';
import workReducer from '../PublicAccess/Features/Work/workSlice';
import userReducer from '../Admin/Features/User/userAdminSlice';
import adminProducReducer from '../Admin/Features/Product/productAdminSlice'
import imagesSlice from '../Admin/Features/Images/imagesAdminSlice'
import homeAdminSlice from '../Admin/Features/FrontPage/homeaAdminSlice'
import adminWorkSlice from '../Admin/Features/Work/workAdminSlice'
import adminMediaSlice from '../Admin/Features/Media/mediaAdminSlice'


export const store = configureStore({
    reducer: {
        home: homeReducer,
        product: productReducer,
        media: mediaReducer,
        work: workReducer,
        user: userReducer,
        adminProduct: adminProducReducer,
        adminImages : imagesSlice,
        adminHome: homeAdminSlice,
        adminWork: adminWorkSlice,
        adminMedia: adminMediaSlice
    }
});

// Tipos inferidos del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
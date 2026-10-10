import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getPublicAbout, clearError as clearAboutError } from '../PublicAccess/Features/About/aboutSlice';
import { getPublicLanding } from '../PublicAccess/Features/FrontPage/homeSlice';

export const useAboutPageData = () => {
  const dispatch = useAppDispatch();

  const { publicAbout, publicLoading, error } = useAppSelector((state) => state.about);
  const { publicLanding } = useAppSelector((state) => state.home);

  useEffect(() => {
    dispatch(getPublicAbout());
  }, [dispatch]);

  useEffect(() => {
    if (!publicLanding || publicLanding.length === 0) {
      dispatch(getPublicLanding());
    }
  }, [dispatch, publicLanding]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearAboutError());
      }
    };
  }, [dispatch, error]);

  const isInitialLoading = (!publicAbout || publicAbout.length === 0) && publicLoading;

  return {
    publicAbout,
    publicLanding,
    publicLoading,
    isInitialLoading,
    error
  };
};

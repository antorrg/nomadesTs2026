import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getPublicWorks, clearError as clearWorkError } from '../PublicAccess/Features/Work/workSlice'
import { getPublicLanding } from '../PublicAccess/Features/FrontPage/homeSlice'

export const useWorkPageData = () => {
  const dispatch = useAppDispatch()

  const { publicWorks, publicLoading, error } = useAppSelector((state) => state.work)
  const { publicLanding } = useAppSelector((state) => state.home)

  useEffect(() => {
    dispatch(getPublicWorks())
  }, [dispatch])

  useEffect(() => {
    if (!publicLanding || publicLanding.length === 0) {
      dispatch(getPublicLanding())
    }
  }, [dispatch, publicLanding])

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearWorkError())
      }
    }
  }, [dispatch, error])

  const isInitialLoading = (!publicWorks || publicWorks.length === 0) && publicLoading

  return {
    publicWorks,
    publicLanding,
    publicLoading,
    isInitialLoading,
    error
  }
}

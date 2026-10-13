import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getPublicHigh, clearError as clearHighError } from '../PublicAccess/Features/FrontPage/HighLight/highSlice'

export const useHighPageData = () => {
  const dispatch = useAppDispatch()

  const { publicHigh, publicLoading, error } = useAppSelector((state) => state.high)
 

  useEffect(() => {
    dispatch(getPublicHigh())
  }, [dispatch])


  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearHighError())
      }
    }
  }, [dispatch, error])

  const isInitialLoading = ( publicHigh.length === 0) && publicLoading

  return {
    publicHigh,
    publicLoading,
    isInitialLoading,
    error
  }
}

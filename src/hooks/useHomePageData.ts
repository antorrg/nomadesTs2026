import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { getPublicLanding, clearError as clearHomeError } from '../PublicAccess/Features/FrontPage/homeSlice'
import { getPublicProducts } from '../PublicAccess/Features/Product/productSlice'

export const useHomePageData = () => {
  const dispatch = useDispatch<AppDispatch>()

  const {publicLanding, publicLoading, error} = useSelector((state: RootState) => state.home)
  const product = useSelector((state: RootState) => state.product)

  useEffect(() => {
    if (publicLanding.length ===0 && !publicLoading) {
      dispatch(getPublicLanding())
    }
  }, [dispatch, publicLanding, publicLoading])

  useEffect(() => {
    if ((!product.publicProducts || product.publicProducts.length === 0) && !product.publicLoading) {
      dispatch(getPublicProducts())
    }
  }, [dispatch, product.publicProducts, product.publicLoading])

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearHomeError())
      }
    }
  }, [dispatch, error])

  const isInitialLoading =
    (!publicLanding && publicLoading) ||
    ((!product.publicProducts || product.publicProducts.length === 0) && product.publicLoading)

  const isReady =
    !!publicLanding &&
    !!product.publicProducts &&
    product.publicProducts.length > 0

  return {
    publicLanding: publicLanding,
    publicProducts: product.publicProducts,
    homeLoading: publicLoading,
    productLoading: product.publicLoading,
    error: error || product.error,
    isInitialLoading,
    isReady
  }
}
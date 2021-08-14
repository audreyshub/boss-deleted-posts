import { useState, useEffect } from 'react'

/**
 * ============================================================================
 * useProductHasVariants(<product variants object>)
 *
 * - Returns boolean
 * ============================================================================
 */
export function useProductHasMultipleVariants(variants) {
  const [hasVariants, setHasVariants] = useState(null)

  useEffect(() => {
    setHasVariants(variants.length > 1)
  }, [])

  return hasVariants
}

/**
 * ============================================================================
 * useProductIsAvailable(<product variants object>)
 *
 * - Returns boolean
 * ============================================================================
 */
export function useProductIsAvailable(variants) {
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    let isAvailableArr
    // First check if variant.availableForSale exists
    isAvailableArr = variants.filter((variant) => variant.availableForSale === true)
    if (isAvailableArr.length > 0) {
      setIsAvailable(true)
      return
    }

    // If not, use variant.inventoryPolicy
    isAvailableArr = variants.filter((variant) => variant.inventoryPolicy === 'CONTINUE')
    if (isAvailableArr.length > 0) {
      setIsAvailable(true)
      return
    }
  }, [])

  return isAvailable
}

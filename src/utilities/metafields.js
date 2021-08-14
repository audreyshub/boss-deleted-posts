function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * ============================================================================
 * getMetafieldValue
 *
 * Grab metafield value from Shopifiy
 * ============================================================================
 */
export const getMetafieldValue = (metafieldsArr, key, namespace = 'custom_fields') => {
  if (!metafieldsArr || !metafieldsArr.length > 0) return null
  const newArr = metafieldsArr.filter(
    (metafield) => metafield.namespace === namespace && metafield.key == key
  )
  if (newArr.length === 0) return null
  const newObject = newArr[0]
  const value = newObject.value

  if (isJson(value)) return JSON.parse(value)
  if (value.includes('|')) return value.split('|')
  // if (!Array.isArray(value)) return [value]
  // console.log('METAFIELD', value)
  return value
  // return value
  return null
}

/**
 * ============================================================================
 * validateMetafields
 *
 * Takes a one-level-deep object of metafields and validates that a specific
 * array of keys' values are not undefined
 *
 * Usage:
 *
 * validateMetafields(object)
 *  - validates all values as not being undefined
 *
 * validateMetafields(object, ['title', 'subtitl', 'link'])
 *  - Validates only the values of specified keys in the object
 * ============================================================================
 */
export const validateMetafields = (metafieldsObj, keysArr) => {
  // If metafielsObj is an array, wrap it in an object
  // if (Array.isArray(metafieldsObj)) return { metafieldsObj }

  // If no keys are specified, validate all the keys in the object
  if (keysArr === undefined) {
    const values = Object.values(metafieldsObj)
    return values.every((value) => {
      return value !== undefined && value !== null
    })
  }

  // If object keys are specified, valide only those keys
  const keys = Object.keys(metafieldsObj)
  const keysFiltered = keys.filter((key) => keysArr.includes(key))
  const valuesArr = keysFiltered.map((key) => {
    // If a key's value is an array, run recursive on that array
    if (Array.isArray(metafieldsObj[key])) {
      const nestedArr = metafieldsObj[key]
      return nestedArr.every((item) => validateMetafields(item))
    }
    return metafieldsObj[key]
  })
  if (Array.isArray(valuesArr)) return valuesArr[0]
  return valuesArr
}

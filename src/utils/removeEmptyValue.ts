/* eslint-disable @typescript-eslint/no-explicit-any */
const removeEmptyValue = (object: Record<any, any>) =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 0 &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0),
    ),
  )

export default removeEmptyValue

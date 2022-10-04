import { debounce, isNil } from 'lodash-es'

export const getDraftData = <T>(draftKey: string) => {
  const draftData = localStorage.getItem(draftKey)
  if (!draftData) {
    return null
  }
  return JSON.parse(draftData) as T
}

export const saveDraft = debounce(
  (draftKey: string, draftObject: { [key: string]: any }) => {
    const shouldSaveDraft = Object.keys(draftObject).reduce(
      (shouldSave, key) => {
        if (shouldSave) {
          return true
        }
        return !isNil(draftObject[key])
      },
      false
    )
    if (!shouldSaveDraft) {
      return
    }
    localStorage.setItem(draftKey, JSON.stringify(draftObject))
  },
  500
)

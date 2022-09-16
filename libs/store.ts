export type UserContextType = {
  id: number | null
  name: string
  email: string
  isLoading: boolean
}

export const userContextInitialValue = {
  id: null,
  name: '',
  email: '',
  isLoading: true,
}

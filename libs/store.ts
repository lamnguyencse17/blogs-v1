export type UserContext = {
  id: string
  name: string
  email: string
  isLoading: boolean
}

export const userContextInitialValue = {
  id: '',
  name: '',
  email: '',
  isLoading: true,
}

import { atom } from 'jotai'

export type TypeUserAtom = {
  id: string
  name: string
  email: string
  isLoading: boolean
}

export const userAtomInitialValue: TypeUserAtom = {
  id: '',
  name: '',
  email: '',
  isLoading: true,
}

export const userAtom = atom<TypeUserAtom>(userAtomInitialValue)

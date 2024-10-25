import { createFuncall } from 'vue-funcall'
import ConfettiDialog from '../components/ConfettiDialog.vue'

export const useCreatePointConfetti = () => {
  const create = (message: string, title = 'EXCENLLENT') => {
    createFuncall(ConfettiDialog, {
      title,
      description: message,
      open: true
    })
  }

  return create
}

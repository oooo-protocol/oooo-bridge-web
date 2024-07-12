import axios from '../axios'

export const retrieveNotification = async () => {
  return await axios<{
    warning?: string
    notice?: string
  }>({
    url: '/v1/bridge/announcement'
  })
}

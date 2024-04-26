import axios from '../axios'

export const retrieveNotification = async () => {
  return await axios<string>({
    url: '/v1/bridge/announcement'
  })
}

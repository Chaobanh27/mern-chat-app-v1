/* eslint-disable no-console */
import axios from 'axios'

const uploadToCloudinary = async (formData) => {
  return new Promise( (resolve) => {
    return axios
      .post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`, formData)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}


export const uploadFiles = async (files) => {
  let formData = new FormData()
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'chat-app-user')

  let uploaded = []
  for (const f of files) {
    const { file, type } = f
    formData.append('file', file)
    let res = await uploadToCloudinary(formData)
    uploaded.push({
      file: res,
      type: type
    })
  }
  return uploaded
}


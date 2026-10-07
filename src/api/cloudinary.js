const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // Cloudinary free plan limit

// Delivered images are resized and compressed by Cloudinary (keeps the URL well under 255 chars)
const DELIVERY_TRANSFORMATION = 'c_limit,w_1600,f_auto,q_auto'

function optimizedUrl(secureUrl) {
  return secureUrl.replace('/image/upload/', `/image/upload/${DELIVERY_TRANSFORMATION}/`)
}

// Uploads an image file; onProgress gets a number from 0 to 1. Resolves to the image URL.
export function uploadImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error('This photo is too big (max 10 MB).'))
      return
    }

    const body = new FormData()
    body.append('file', file)
    body.append('upload_preset', UPLOAD_PRESET)

    // XMLHttpRequest instead of fetch, to report upload progress
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total)
    }

    xhr.onload = () => {
      let data = null
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        // handled below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) {
        resolve(optimizedUrl(data.secure_url))
      } else {
        reject(new Error(data?.error?.message || 'The photo could not be uploaded. Please try again.'))
      }
    }

    xhr.onerror = () => reject(new Error('The photo could not be uploaded. Check your connection.'))

    xhr.send(body)
  })
}

import { useId, useState } from 'react'
import { uploadImage } from '../api/cloudinary'
import { Camera } from './Doodles'

// Photo from the device (uploaded to Cloudinary) or from a pasted link
function PhotoPicker({ value, onChange, onUploadingChange }) {
  const inputId = useId()
  const [progress, setProgress] = useState(null) // null = not uploading
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)

  const uploading = progress !== null

  async function handleFile(file) {
    if (!file || uploading) return
    setError(null)
    setProgress(0)
    onUploadingChange?.(true)
    try {
      const url = await uploadImage(file, setProgress)
      setPreviewFailed(false)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setProgress(null)
      onUploadingChange?.(false)
    }
  }

  function handleInputChange(event) {
    handleFile(event.target.files[0])
    event.target.value = '' // allow choosing the same file again
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragOver(false)
    handleFile(event.dataTransfer.files[0])
  }

  function handleUrlChange(url) {
    setPreviewFailed(false)
    onChange(url)
  }

  const fileInput = (
    <input
      id={inputId}
      type="file"
      accept="image/*"
      className="visually-hidden"
      disabled={uploading}
      onChange={handleInputChange}
    />
  )

  return (
    <div className="photo-picker">
      {value && !uploading ? (
        <div className="photo-preview">
          {previewFailed ? (
            <p className="photo-preview-error">This image could not be loaded. Check the link.</p>
          ) : (
            <img src={value} alt="Recipe" onError={() => setPreviewFailed(true)} />
          )}
          <div className="photo-preview-actions">
            {fileInput}
            <label htmlFor={inputId} className="button secondary">
              Change photo
            </label>
            <button type="button" className="button secondary" onClick={() => onChange('')}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`photo-dropzone${dragOver ? ' drag-over' : ''}${uploading ? ' uploading' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Camera className="photo-doodle" />
          {uploading ? (
            <div className="upload-progress" role="status">
              <p>Uploading… {Math.round(progress * 100)}%</p>
              <div className="progress-bar">
                <span style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
          ) : (
            <>
              <p className="photo-dropzone-text">
                <span className="desktop-only">Drag a photo here, or </span>
                pick one from your device
              </p>
              {fileInput}
              <label htmlFor={inputId} className="button">
                Choose a photo
              </label>
              <p className="hint">JPG, PNG or HEIC, up to 10 MB</p>
            </>
          )}
        </div>
      )}

      {error && <span className="field-error">{error}</span>}

      {showUrlInput ? (
        <div className="field photo-url">
          <label htmlFor={`${inputId}-url`}>Image link</label>
          <input
            id={`${inputId}-url`}
            type="url"
            maxLength={255}
            placeholder="https://…"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      ) : (
        <button type="button" className="link-button photo-url-toggle" onClick={() => setShowUrlInput(true)}>
          Or paste a link to an image
        </button>
      )}
    </div>
  )
}

export default PhotoPicker

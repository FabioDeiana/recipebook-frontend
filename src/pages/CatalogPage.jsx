import { useState } from 'react'
import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  getCategories,
  getTags,
  updateCategory,
} from '../api/catalog'
import { useApi } from '../hooks/useApi'
import ErrorMessage from '../components/ErrorMessage'

function errorText(err) {
  return err.errors ? Object.values(err.errors).join(' ') : err.message
}

function AddForm({ label, onAdd }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onAdd(name.trim())
      setName('')
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <input
        type="text"
        required
        maxLength={50}
        placeholder={label}
        aria-label={label}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="button" disabled={busy}>
        Add
      </button>
      <ErrorMessage error={error} />
    </form>
  )
}

function CategoryRow({ category, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function run(action) {
    setBusy(true)
    setError(null)
    try {
      await action()
      onChanged()
    } catch (err) {
      setError(errorText(err))
      setBusy(false)
    }
  }

  function handleSave(event) {
    event.preventDefault()
    run(async () => {
      await updateCategory(category.id, name.trim())
      setEditing(false)
      setBusy(false)
    })
  }

  function handleDelete() {
    if (!window.confirm(`Delete the category "${category.name}"?`)) return
    run(() => deleteCategory(category.id))
  }

  return (
    <li className="catalog-item">
      {editing ? (
        <form className="inline-form" onSubmit={handleSave}>
          <input
            type="text"
            required
            maxLength={50}
            aria-label="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="button" disabled={busy}>
            Save
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setEditing(false)
              setName(category.name)
              setError(null)
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span className="catalog-name">{category.name}</span>
          <div className="catalog-actions">
            <button type="button" className="link-button" onClick={() => setEditing(true)}>
              Rename
            </button>
            <button type="button" className="link-button danger" disabled={busy} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      )}
      <ErrorMessage error={error} />
    </li>
  )
}

function TagRow({ tag, onChanged }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    if (!window.confirm(`Delete the tag "${tag.name}"? It will be removed from all recipes.`)) return
    setBusy(true)
    setError(null)
    try {
      await deleteTag(tag.id)
      onChanged()
    } catch (err) {
      setError(errorText(err))
      setBusy(false)
    }
  }

  return (
    <li className="catalog-item">
      <span className="catalog-name">{tag.name}</span>
      <div className="catalog-actions">
        <button type="button" className="link-button danger" disabled={busy} onClick={handleDelete}>
          Delete
        </button>
      </div>
      <ErrorMessage error={error} />
    </li>
  )
}

function CatalogPage() {
  const categories = useApi(getCategories, [])
  const tags = useApi(getTags, [])

  return (
    <section>
      <h1>Categories &amp; tags</h1>
      <div className="catalog-columns">
        <div className="card">
          <h2>Categories</h2>
          <ErrorMessage error={categories.error} />
          <ul className="catalog-list">
            {categories.data?.map((category) => (
              <CategoryRow
                key={`${category.id}-${category.name}`}
                category={category}
                onChanged={categories.reload}
              />
            ))}
          </ul>
          <AddForm
            label="New category"
            onAdd={async (name) => {
              await createCategory(name)
              categories.reload()
            }}
          />
        </div>

        <div className="card">
          <h2>Tags</h2>
          <ErrorMessage error={tags.error} />
          {tags.data?.length === 0 && <p className="muted">No tags yet.</p>}
          <ul className="catalog-list">
            {tags.data?.map((tag) => (
              <TagRow key={tag.id} tag={tag} onChanged={tags.reload} />
            ))}
          </ul>
          <AddForm
            label="New tag"
            onAdd={async (name) => {
              await createTag(name)
              tags.reload()
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default CatalogPage

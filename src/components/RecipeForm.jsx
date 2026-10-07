import { useRef, useState } from 'react'
import { getCategories, getTags } from '../api/catalog'
import { useApi } from '../hooks/useApi'
import { UNIT_GROUPS } from '../utils/units'
import ErrorMessage from './ErrorMessage'
import IngredientNameInput from './IngredientNameInput'
import PhotoPicker from './PhotoPicker'

const MAX_ITEMS = 30

let nextKey = 1
const newKey = () => nextKey++

const emptyIngredient = () => ({ key: newKey(), name: '', quantity: '', unit: 'G', note: '' })
const emptyStep = () => ({ key: newKey(), description: '' })

const toInput = (value) => (value == null ? '' : String(value))
const toNumber = (value) => (value === '' ? null : Number(value))

// RecipeDetail (from the API) -> form values
function toFormValues(recipe) {
  if (!recipe) {
    return {
      authorName: '',
      website: '',
      title: '',
      description: '',
      servings: '4',
      prepTimeMinutes: '',
      cookTimeMinutes: '',
      imageUrl: '',
      adaptedFrom: '',
      categoryId: '',
      tagIds: [],
      ingredients: [emptyIngredient()],
      steps: [emptyStep()],
    }
  }
  return {
    authorName: '',
    website: '',
    title: recipe.title,
    description: toInput(recipe.description),
    servings: toInput(recipe.servings),
    prepTimeMinutes: toInput(recipe.prepTimeMinutes),
    cookTimeMinutes: toInput(recipe.cookTimeMinutes),
    imageUrl: toInput(recipe.imageUrl),
    adaptedFrom: toInput(recipe.adaptedFrom),
    categoryId: toInput(recipe.category?.id),
    tagIds: recipe.tags.map((tag) => tag.id),
    ingredients: recipe.ingredients.map((ingredient) => ({
      key: newKey(),
      name: ingredient.name,
      quantity: toInput(ingredient.quantity),
      unit: ingredient.unit,
      note: toInput(ingredient.note),
    })),
    steps: recipe.steps.map((step) => ({ key: newKey(), description: step.description })),
  }
}

// Form values -> RecipeRequest (admin) or friend submission
function toPayload(values, isFriend) {
  const payload = {
    title: values.title,
    description: values.description,
    servings: toNumber(values.servings),
    prepTimeMinutes: toNumber(values.prepTimeMinutes),
    cookTimeMinutes: toNumber(values.cookTimeMinutes),
    imageUrl: values.imageUrl,
    categoryId: toNumber(values.categoryId),
    tagIds: values.tagIds,
    ingredients: values.ingredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: toNumber(ingredient.quantity),
      unit: ingredient.unit,
      note: ingredient.note,
    })),
    steps: values.steps.map((step) => ({ description: step.description })),
  }
  if (isFriend) {
    payload.authorName = values.authorName
    payload.website = values.website
  } else {
    payload.adaptedFrom = values.adaptedFrom
  }
  return payload
}

function move(list, index, offset) {
  const target = index + offset
  if (target < 0 || target >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

function FieldError({ message }) {
  return message ? <span className="field-error">{message}</span> : null
}

function FormSection({ number, title, subtitle, children }) {
  return (
    <section className="form-section">
      <header className="form-section-header">
        <span className="form-section-number">{number}</span>
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
      </header>
      <div className="form-section-body">{children}</div>
    </section>
  )
}

function RowActions({ index, count, label, onMove, onRemove }) {
  return (
    <div className="row-actions">
      <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={index === count - 1}
        onClick={() => onMove(1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="remove"
        aria-label={`Remove ${label}`}
        disabled={count === 1}
        onClick={onRemove}
      >
        ✕
      </button>
    </div>
  )
}

function RecipeForm({ variant = 'admin', recipe, submitLabel, onSubmit }) {
  const isFriend = variant === 'friend'
  const [values, setValues] = useState(() => toFormValues(recipe))
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState(null)
  const errorRef = useRef(null)

  const categories = useApi(getCategories, [])
  const tags = useApi(getTags, [])

  const fieldErrors = error?.errors ?? {}
  let sectionNumber = 0
  const nextSection = () => ++sectionNumber

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function updateItem(listName, index, changes) {
    setValues((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, i) => (i === index ? { ...item, ...changes } : item)),
    }))
  }

  function addItem(listName, factory) {
    setValues((prev) => ({ ...prev, [listName]: [...prev[listName], factory()] }))
  }

  function removeItem(listName, index) {
    setValues((prev) => ({ ...prev, [listName]: prev[listName].filter((_, i) => i !== index) }))
  }

  function moveItem(listName, index, offset) {
    setValues((prev) => ({ ...prev, [listName]: move(prev[listName], index, offset) }))
  }

  function toggleTag(tagId) {
    setValues((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(toPayload(values, isFriend))
    } catch (err) {
      setError(err)
      setSubmitting(false)
      requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      return
    }
    setSubmitting(false)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {isFriend && (
        <FormSection number={nextSection()} title="About you" subtitle="So everyone knows who to thank.">
          <div className="field">
            <label htmlFor="authorName">Your name *</label>
            <input
              id="authorName"
              type="text"
              required
              maxLength={50}
              placeholder="e.g. Giulia"
              value={values.authorName}
              onChange={(e) => setField('authorName', e.target.value)}
            />
            <FieldError message={fieldErrors.authorName} />
          </div>

          {/* Honeypot: hidden from humans, bots fill it in */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => setField('website', e.target.value)}
            />
          </div>
        </FormSection>
      )}

      <FormSection number={nextSection()} title="The basics" subtitle="What are we cooking?">
        <div className="field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Pasta e ceci"
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
          />
          <FieldError message={fieldErrors.title} />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            maxLength={2000}
            placeholder="A few words about this recipe…"
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
          />
          <FieldError message={fieldErrors.description} />
        </div>

        <div className="field">
          <label htmlFor="categoryId">Category *</label>
          <select
            id="categoryId"
            required
            value={values.categoryId}
            onChange={(e) => setField('categoryId', e.target.value)}
          >
            <option value="">Choose a category…</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.categoryId} />
        </div>

        {tags.data?.length > 0 && (
          <fieldset className="field">
            <legend>Tags</legend>
            <div className="tag-picker">
              {tags.data.map((tag) => (
                <label
                  key={tag.id}
                  className={`tag-option${values.tagIds.includes(tag.id) ? ' selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={values.tagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
            <FieldError message={fieldErrors.tagIds} />
          </fieldset>
        )}

        {!isFriend && (
          <div className="field">
            <label htmlFor="adaptedFrom">Adapted from</label>
            <input
              id="adaptedFrom"
              type="text"
              maxLength={255}
              placeholder="e.g. Adapted from Giulia's recipe"
              value={values.adaptedFrom}
              onChange={(e) => setField('adaptedFrom', e.target.value)}
            />
            <FieldError message={fieldErrors.adaptedFrom} />
          </div>
        )}
      </FormSection>

      <FormSection number={nextSection()} title="Servings & time">
        <div className="field-row">
          <div className="field stat-field">
            <label htmlFor="servings">Servings *</label>
            <input
              id="servings"
              type="number"
              required
              min={1}
              max={100}
              value={values.servings}
              onChange={(e) => setField('servings', e.target.value)}
            />
            <FieldError message={fieldErrors.servings} />
          </div>
          <div className="field stat-field">
            <label htmlFor="prepTimeMinutes">Prep (minutes)</label>
            <input
              id="prepTimeMinutes"
              type="number"
              min={0}
              placeholder="—"
              value={values.prepTimeMinutes}
              onChange={(e) => setField('prepTimeMinutes', e.target.value)}
            />
            <FieldError message={fieldErrors.prepTimeMinutes} />
          </div>
          <div className="field stat-field">
            <label htmlFor="cookTimeMinutes">Cook (minutes)</label>
            <input
              id="cookTimeMinutes"
              type="number"
              min={0}
              placeholder="—"
              value={values.cookTimeMinutes}
              onChange={(e) => setField('cookTimeMinutes', e.target.value)}
            />
            <FieldError message={fieldErrors.cookTimeMinutes} />
          </div>
        </div>
      </FormSection>

      <FormSection number={nextSection()} title="Photo" subtitle="Optional, but it makes the recipe shine.">
        <PhotoPicker
          value={values.imageUrl}
          onChange={(url) => setField('imageUrl', url)}
          onUploadingChange={setUploadingPhoto}
        />
        <FieldError message={fieldErrors.imageUrl} />
      </FormSection>

      <FormSection
        number={nextSection()}
        title="Ingredients"
        subtitle="Start typing to pick an ingredient that already exists."
      >
        <FieldError message={fieldErrors.ingredients} />
        <div className="ingredient-header" aria-hidden="true">
          <span>Ingredient</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Note</span>
        </div>
        <div className="ingredient-rows">
          {values.ingredients.map((ingredient, index) => (
            <div key={ingredient.key} className="ingredient-row">
              <div className="ingredient-inputs">
                <IngredientNameInput
                  className="ingredient-name"
                  placeholder="e.g. chickpeas"
                  aria-label={`Ingredient ${index + 1} name`}
                  required
                  maxLength={100}
                  value={ingredient.name}
                  onChange={(name) => updateItem('ingredients', index, { name })}
                />
                <input
                  className="ingredient-quantity"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Qty"
                  aria-label={`Ingredient ${index + 1} quantity`}
                  value={ingredient.quantity}
                  onChange={(e) => updateItem('ingredients', index, { quantity: e.target.value })}
                />
                <select
                  className="ingredient-unit"
                  aria-label={`Ingredient ${index + 1} unit`}
                  value={ingredient.unit}
                  onChange={(e) => updateItem('ingredients', index, { unit: e.target.value })}
                >
                  {UNIT_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.units.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <input
                  className="ingredient-note"
                  type="text"
                  placeholder="Note (optional)"
                  aria-label={`Ingredient ${index + 1} note`}
                  maxLength={255}
                  value={ingredient.note}
                  onChange={(e) => updateItem('ingredients', index, { note: e.target.value })}
                />
              </div>
              <RowActions
                index={index}
                count={values.ingredients.length}
                label="ingredient"
                onMove={(offset) => moveItem('ingredients', index, offset)}
                onRemove={() => removeItem('ingredients', index)}
              />
              <FieldError message={fieldErrors[`ingredients[${index}].name`]} />
              <FieldError message={fieldErrors[`ingredients[${index}].quantity`]} />
              <FieldError message={fieldErrors[`ingredients[${index}].unit`]} />
              <FieldError message={fieldErrors[`ingredients[${index}].note`]} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-row"
          disabled={values.ingredients.length >= MAX_ITEMS}
          onClick={() => addItem('ingredients', emptyIngredient)}
        >
          + Add ingredient
        </button>
      </FormSection>

      <FormSection number={nextSection()} title="Method" subtitle="One step at a time.">
        <FieldError message={fieldErrors.steps} />
        <ol className="step-rows">
          {values.steps.map((step, index) => (
            <li key={step.key} className="step-row">
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <div className="step-content">
                <div className="step-input">
                  <textarea
                    rows={2}
                    required
                    maxLength={2000}
                    aria-label={`Step ${index + 1}`}
                    placeholder={index === 0 ? 'e.g. Warm the chickpeas in a pan…' : 'Then…'}
                    value={step.description}
                    onChange={(e) => updateItem('steps', index, { description: e.target.value })}
                  />
                  <RowActions
                    index={index}
                    count={values.steps.length}
                    label="step"
                    onMove={(offset) => moveItem('steps', index, offset)}
                    onRemove={() => removeItem('steps', index)}
                  />
                </div>
                <FieldError message={fieldErrors[`steps[${index}].description`]} />
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="add-row"
          disabled={values.steps.length >= MAX_ITEMS}
          onClick={() => addItem('steps', emptyStep)}
        >
          + Add step
        </button>
      </FormSection>

      <div ref={errorRef}>
        <ErrorMessage
          error={error?.status === 400 && error.errors ? 'Please fix the highlighted fields.' : error}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-large" disabled={submitting || uploadingPhoto}>
          {submitting ? 'Saving…' : uploadingPhoto ? 'Uploading photo…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default RecipeForm

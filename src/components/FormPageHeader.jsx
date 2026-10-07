import { RecipeNotebook } from './Doodles'

function FormPageHeader({ kicker, title, children }) {
  return (
    <header className="form-page-header">
      <RecipeNotebook className="form-page-doodle" />
      <div>
        {kicker && <p className="script-kicker">{kicker}</p>}
        <h1>{title}</h1>
        {children && <p className="muted">{children}</p>}
      </div>
    </header>
  )
}

export default FormPageHeader

import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './auth/RequireAuth'
import Layout from './components/Layout'
import RecipeListPage from './pages/RecipeListPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import SubmitRecipePage from './pages/SubmitRecipePage'
import LoginPage from './pages/LoginPage'
import NewRecipePage from './pages/NewRecipePage'
import EditRecipePage from './pages/EditRecipePage'
import CatalogPage from './pages/CatalogPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<RecipeListPage key="OWN" section="OWN" />} />
          <Route path="friends" element={<RecipeListPage key="FRIENDS" section="FRIENDS" />} />
          <Route path="recipes/:slug" element={<RecipeDetailPage />} />
          <Route path="submit" element={<SubmitRecipePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<RequireAuth />}>
            <Route path="recipes/new" element={<NewRecipePage />} />
            <Route path="recipes/:slug/edit" element={<EditRecipePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="password" element={<ChangePasswordPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

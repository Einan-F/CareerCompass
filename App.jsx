import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { useAuth } from './lib/context/AuthContext'

// Import pages
import Dashboard from './Pages/Dashboard'
import Applications from './Pages/Applications'
import CVLibrary from './Pages/CVLibrary'
import Offers from './Pages/Offers'
import Analytics from './Pages/Analytics'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="cv-library" element={<CVLibrary />} />
        <Route path="offers" element={<Offers />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  )
}

// Login component
function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = e.target.elements
    
    try {
      const { error } = await signIn({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
          <div className="text-sm text-center mt-4">
            <p>Don't have an account?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

// SignUp component
function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = e.target.elements
    
    try {
      const { error } = await signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App

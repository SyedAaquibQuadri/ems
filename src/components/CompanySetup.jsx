import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../context/AuthProvider'

const CompanySetup = () => {
  const { setCurrentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

 // Only ask for org name — slug is auto-generated on the backend
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  try {
    const { data } = await api.post('/org/setup', { orgName: name })
    setCurrentUser(prev => ({
      ...prev,
      organizationId: data.organizationId,
      orgName: data.orgName,
      orgSlug: data.orgSlug,
    }))
    navigate('/dashboard')
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>
        <h1 className='text-white text-2xl font-medium mb-1'>Set up your organization</h1>
        <p className='text-gray-500 text-sm mb-6'>This is the last step before your dashboard</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
                <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Organization name</label>
                <input
                type='text' required value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Acme Corp'
                className='w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-emerald-600 placeholder:text-gray-700'
                />
                <p className='text-gray-600 text-xs mt-1.5'>
                Slug will be auto-generated from your org name
                </p>
            </div>

            {error && (
                <div className='text-sm text-center px-4 py-2.5 rounded-xl border bg-red-950 border-red-700 text-red-300'>
                {error}
                </div>
            )}

            <button type='submit' disabled={loading}
                className='bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 rounded-xl transition-all disabled:opacity-60'>
                {loading ? 'Creating...' : 'Create organization'}
            </button>
        </form>
      </div>
    </div>
  )
}

export default CompanySetup
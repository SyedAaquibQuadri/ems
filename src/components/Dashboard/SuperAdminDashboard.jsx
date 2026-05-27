import React, { useEffect, useState, useContext } from 'react'
import api from '../../utils/api'
import { AuthContext } from '../../context/AuthProvider'

const SuperAdminDashboard = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [orgs, setOrgs] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [members, setMembers] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statsRes, orgsRes] = await Promise.all([
        api.get('/super/stats'),
        api.get('/super/orgs'),
      ])
      setStats(statsRes.data)
      setOrgs(orgsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const toggleExpand = async (orgId) => {
    if (expanded === orgId) {
      setExpanded(null)
      return
    }
    setExpanded(orgId)
    if (!members[orgId]) {
      try {
        const { data } = await api.get(`/super/orgs/${orgId}/members`)
        setMembers(prev => ({ ...prev, [orgId]: data }))
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleDeleteOrg = async (orgId, orgName) => {
    if (!window.confirm(`Delete "${orgName}" and all its data? This cannot be undone.`)) return
    try {
      await api.delete(`/super/orgs/${orgId}`)
      setOrgs(prev => prev.filter(o => o._id !== orgId))
    } catch (err) {
      alert('Failed to delete organization')
    }
  }

  if (loading) return (
    <div className='flex h-screen items-center justify-center bg-[#0a0a0a]'>
      <p className='text-gray-500 text-sm'>Loading...</p>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#0a0a0a] p-4 md:p-8'>

      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-yellow-950 border border-yellow-800 flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className='text-white font-semibold text-lg'>Super Admin</h1>
            <p className='text-gray-500 text-xs'>{currentUser?.name} · {currentUser?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className='flex items-center gap-2 px-4 py-2 rounded-lg border border-red-800 text-red-500 text-sm hover:bg-red-950 transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Log out
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className='grid grid-cols-3 gap-4 mb-8'>
          {[
            { label: 'Organizations', value: stats.totalOrgs, color: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-800' },
            { label: 'Total Users', value: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-950', border: 'border-blue-800' },
            { label: 'Total Tasks', value: stats.totalTasks, color: 'text-amber-400', bg: 'bg-amber-950', border: 'border-amber-800' },
          ].map((s, i) => (
            <div key={i} className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5'>
              <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
              <p className='text-gray-500 text-sm'>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Organizations */}
      <div>
        <p className='text-xs font-medium tracking-widest text-gray-500 uppercase mb-3'>
          All Organizations ({orgs.length})
        </p>
        <div className='space-y-3'>
          {orgs.map(org => (
            <div key={org._id} className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl overflow-hidden'>

              {/* Org header */}
              <div className='flex items-center justify-between px-5 py-4'>
                <div className='flex items-center gap-4 flex-1 min-w-0'>
                  <div className='w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0'>
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h3 className='text-white font-medium'>{org.name}</h3>
                      <code className='text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800'>
                        {org.slug}
                      </code>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        org.isActive
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-red-950 text-red-400 border-red-900'
                      }`}>
                        {org.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      Owner: {org.owner?.name || 'Unknown'} · {org.owner?.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4 ml-4 flex-shrink-0'>
                  <div className='hidden sm:flex items-center gap-4 text-sm'>
                    <div className='text-center'>
                      <p className='text-white font-medium'>{org.memberCount}</p>
                      <p className='text-xs text-gray-600'>Members</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-white font-medium'>{org.taskCount}</p>
                      <p className='text-xs text-gray-600'>Tasks</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-white font-medium text-xs'>
                        {new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className='text-xs text-gray-600'>Created</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button onClick={() => toggleExpand(org._id)}
                      className='text-xs px-3 py-1.5 rounded-lg bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white transition-colors flex items-center gap-1'>
                      Members
                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${expanded === org._id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteOrg(org._id, org.name)}
                      className='text-xs px-3 py-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-900 transition-colors'>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded members */}
              {expanded === org._id && (
                <div className='border-t border-[#2a2a2a] bg-[#161616] px-5 py-4'>
                  <p className='text-xs text-gray-500 uppercase tracking-widest mb-3'>Members</p>
                  {members[org._id] ? (
                    <div className='space-y-2'>
                      {members[org._id].map(member => (
                        <div key={member._id} className='flex items-center justify-between bg-[#1c1c1c] rounded-lg px-4 py-2.5 border border-[#2a2a2a]'>
                          <div className='flex items-center gap-3'>
                            <div className='w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs text-gray-400 font-medium'>
                              {member.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className='text-sm text-white'>{member.name}</p>
                              <p className='text-xs text-gray-600'>{member.email}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            member.role === 'org_admin' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            member.role === 'pending' ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
                            'bg-blue-950 text-blue-300 border-blue-800'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-gray-600 text-sm'>Loading members...</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
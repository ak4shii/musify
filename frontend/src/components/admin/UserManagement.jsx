import React, { useState } from 'react'
import AdminTable from './AdminTable'
import apiClient from '../../helpers/apiClient'
import toast from '../../helpers/singleToast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [userSearch, setUserSearch] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await apiClient.get('/admins/users', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      const list = Array.isArray(response.data) ? response.data : []
      list.sort((a, b) => (a?.userId ?? 0) - (b?.userId ?? 0))
      setUsers(list)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleEnabled = async (user) => {
    try {
      const token = localStorage.getItem('token')
      await apiClient.put(
        `/admins/users/${user.userId}/enable`,
        { enabled: !user.enabled },
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      )
      toast.success(`User ${user.enabled ? 'disabled' : 'enabled'} successfully`)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase()
    if (!q) return true
    return String(u?.email ?? '').toLowerCase().includes(q)
  })

  const columns = [
    {
      header: 'ID',
      accessor: 'userId'
    },
    {
      header: 'Username',
      accessor: 'userName'
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => (
        <span className={`px-2 py-1 rounded text-xs ${
          user.role === 'ROLE_ADMIN' 
            ? 'bg-purple-600/20 text-purple-400' 
            : 'bg-blue-600/20 text-blue-400'
        }`}>
          {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'enabled',
      render: (user) => (
        <span className={`px-2 py-1 rounded text-xs ${
          user.enabled 
            ? 'bg-green-600/20 text-green-400' 
            : 'bg-red-600/20 text-red-400'
        }`}>
          {user.enabled ? 'Enabled' : 'Disabled'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (user) => (
        <button
          onClick={() => handleToggleEnabled(user)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            user.enabled
              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
              : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
          }`}
        >
          {user.enabled ? 'Disable' : 'Enable'}
        </button>
      )
    }
  ]

  if (loading) {
    return (
      <div className='text-center py-12 text-gray-400'>
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='w-full sm:w-80'>
          <input
            type='text'
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder='Search by email...'
            className='w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40'
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filteredUsers}
        emptyMessage='No users found'
        getRowKey={(user) => user.userId}
      />
    </div>
  )
}

export default UserManagement


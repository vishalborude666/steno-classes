import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Filter, UserCheck, UserX, Trash2, Shield } from 'lucide-react'
import { fetchUsers, updateUserRole, toggleUserActive, deleteUser } from '../../features/user/userSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { formatDate, capitalize } from '../../utils/formatters'
import { useDebounce } from '../../hooks/useDebounce'

const roleBadge = {
  student: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  teacher: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const UserManagementPage = () => {
  const dispatch = useDispatch()
  const { users, loading, pagination } = useSelector((state) => state.user)
  const { user: currentUser } = useSelector((state) => state.auth)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    dispatch(fetchUsers({ search: debouncedSearch, role, page, limit: 20 }))
  }, [debouncedSearch, role, page, dispatch])

  const handleRoleChange = (id, newRole) => {
    if (window.confirm(`Change role to "${newRole}"?`)) dispatch(updateUserRole({ id, role: newRole }))
  }

  const handleToggle = (id) => dispatch(toggleUserActive(id))

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this user?')) dispatch(deleteUser(id))
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>

        {/* Filters */}
        <div className="card mb-5 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search name or email..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field w-36">
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>
                          {capitalize(u.role)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-semibold ${u.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {/* Change role */}
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={u._id === currentUser?._id}
                            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                          {/* Toggle */}
                          <button onClick={() => handleToggle(u._id)} disabled={u._id === currentUser?._id}
                            className={`p-1.5 rounded-lg transition-colors ${u.isActive
                              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            } disabled:opacity-30`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                            {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                          {/* Delete */}
                          <button onClick={() => handleDelete(u._id)} disabled={u._id === currentUser?._id}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-30"
                            title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-gray-400 py-10">No users found</p>}
            </div>
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                  p === page ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 hover:bg-primary-50'
                }`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default UserManagementPage

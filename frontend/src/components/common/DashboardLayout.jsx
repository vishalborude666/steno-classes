import { useDispatch } from 'react-redux'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { toggleSidebar } from '../../features/ui/uiSlice'

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar onClose={() => dispatch(toggleSidebar())} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar showSidebarToggle={true} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

import { useSelector, useDispatch } from 'react-redux'
import { toggleDarkMode } from '../features/ui/uiSlice'

export const useDarkMode = () => {
  const dispatch = useDispatch()
  const darkMode = useSelector((state) => state.ui.darkMode)

  const toggle = () => dispatch(toggleDarkMode())

  return { darkMode, toggle }
}

const Loader = ({ fullPage = false, size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }

  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-primary-600 font-semibold text-lg animate-pulse-slow">Lucent Shorthand Classes</p>
        </div>
      </div>
    )
  }

  return spinner
}

export default Loader

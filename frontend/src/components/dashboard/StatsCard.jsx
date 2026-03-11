const StatsCard = ({ icon: Icon, label, value, subValue, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
    green: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="card flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none mt-0.5">{value}</p>
        {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
      </div>
    </div>
  )
}

export default StatsCard

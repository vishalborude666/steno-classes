import { diffTexts } from '../../utils/wpmCalculator'

const DiffHighlighter = ({ original, typed, language }) => {
  if (!original) return null
  const { result: diff } = diffTexts(original, typed || '')
  const fontClass = language === 'marathi' ? 'font-surekh text-base' : 'font-mono text-sm'

  return (
    <div className={`${fontClass} leading-relaxed p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-pre-wrap break-words`}>
      {diff.map((item, i) => (
        <span
          key={i}
          className={
            item.type === 'correct'
              ? 'text-emerald-600 dark:text-emerald-400'
              : item.type === 'wrong'
              ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded'
              : 'text-gray-300 dark:text-gray-600'
          }
        >
          {item.char}
        </span>
      ))}
    </div>
  )
}

export default DiffHighlighter

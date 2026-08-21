const COUNT_OPTIONS = Array.from({ length: 21 }, (_, i) => i) // 0..20

function CountSelect({ value, onChange, className = '', countOptions = COUNT_OPTIONS, hideZero = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`px-2 py-1 rounded bg-slate-600 text-right outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
       style={{ minWidth: '50px' }}
    >
      {countOptions.map((n) => (
        <option key={n} value={n}>
          {hideZero && n === 0 ? '' : n}
        </option>
      ))}
    </select>
  )
}

export default CountSelect

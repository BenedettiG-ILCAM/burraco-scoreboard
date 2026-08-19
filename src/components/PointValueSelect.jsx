const POINT_VALUE_OPTIONS = [5, 10, 15, 20, 25, 30, 50, 100, 150, 200, 250, 300, 400, 500]

function PointValueSelect({ value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`px-2 py-1 rounded bg-slate-600 text-right outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
    >
      {POINT_VALUE_OPTIONS.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  )
}

export default PointValueSelect

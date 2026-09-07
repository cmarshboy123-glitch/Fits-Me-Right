// Joins whichever selection fields are actually set with a middle dot,
// so a skipped step (e.g. via "Skip and see results") doesn't leave a
// dangling "Women ·  · Casual" gap in the summary line.
export function summarizeSelections(selections, fields) {
  return fields.map((field) => (typeof field === 'function' ? field(selections) : selections[field])).filter(Boolean).join(' · ')
}

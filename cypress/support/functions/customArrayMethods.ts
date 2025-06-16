export function splitIntoParts<T>(arr: T[], parts: number): T[][] {
  const result: T[][] = []

  for (let i = 0; i < parts; i++) {
    const chunkSize = Math.ceil(arr.length / parts)
    const start = i * chunkSize
    const end = start + chunkSize
    result.push(arr.slice(start, end))
  }

  return result
}

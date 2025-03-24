import { isRef } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import useAsync from 'src/utils/use-async'

describe('# Create async process', () => {
  let someProcess = (): Promise<null> => Promise.resolve(null)

  it('should expect active as Vue Ref type', () => {
    let { active } = useAsync(someProcess)

    expect(isRef(active)).toBe(true)
  })

  it('should correctly test active functionality', async () => {
    let { active, run } = useAsync(someProcess)

    expect(active.value).toBe(false)

    let promise = run()

    expect(active.value).toBe(true)

    await promise

    expect(active.value).toBe(false)
  })

  it('should expect run as a function', () => {
    let { run } = useAsync(someProcess)

    expect(run).toBeInstanceOf(Function)
  })

  it('should expect original function called with correct params and return correct data', async () => {
    let someProcess = vi.fn().mockResolvedValue({ a: 1, b: null })
    let { run } = useAsync(someProcess)

    let result = await run(null)
    expect(result).toEqual({ a: 1, b: null })
    expect(someProcess).toBeCalledWith(null)
  })
})

const { palindrome } = require('../utils/for_testing')

test('palindrome of juan', () => {
  const result = palindrome('juan')

  expect(result).toBe('nauj')
})

test('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('palindrome of empty undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})

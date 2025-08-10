export const formatDate = (date: string | Date) => {
  try {
    return new Date(date).toISOString().split('T')[0]
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

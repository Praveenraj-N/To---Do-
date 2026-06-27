export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export const PRIORITIES = ['low', 'medium', 'high']

export const CATEGORIES = ['general', 'work', 'personal', 'shopping', 'health', 'other']

export const FILTERS = ['all', 'active', 'completed']

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest first' },
  { value: 'createdAt_asc', label: 'Oldest first' },
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
  { value: 'priority_desc', label: 'Priority (high to low)' },
]

export const PAGE_SIZE = 5

export const ROUTES = {
  HOME: '/',
  DETAILS: '/details',
}

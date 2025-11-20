'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface BlogFiltersProps {
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Platform Updates', label: 'Platform Updates' },
  { value: 'Getting Started', label: 'Getting Started' },
  { value: 'Compliance Tips', label: 'Compliance Tips' },
  { value: 'Case Studies', label: 'Case Studies' },
  { value: 'How-To', label: 'How-To' },
  { value: 'Industry News', label: 'Industry News' },
]

export default function BlogFilters({ onSearchChange, onCategoryChange, selectedCategory }: BlogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-600 focus:border-accent-600 outline-none transition-colors"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Category Filter */}
      <select
        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-600 focus:border-accent-600 outline-none transition-colors bg-white"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  )
}

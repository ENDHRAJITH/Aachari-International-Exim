'use client'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFilterProps {
  categories: Category[]
  activeCategory: string
  onFilter: (slug: string) => void
  totalCount: number
}

export default function ProductFilter({
  categories,
  activeCategory,
  onFilter,
  totalCount
}: ProductFilterProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '28px'
    }}>
      {/* All button */}
      <button
        onClick={() => onFilter('all')}
        style={{
          padding: '8px 18px',
          borderRadius: '20px',
          border: '1.5px solid',
          borderColor: activeCategory === 'all' ? '#C1622A' : '#E8E0D8',
          backgroundColor: activeCategory === 'all' ? '#C1622A' : '#ffffff',
          color: activeCategory === 'all' ? '#ffffff' : '#1A1A1A',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s'
        }}
      >
        All ({totalCount})
      </button>

      {/* Category buttons */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilter(cat.slug)}
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            border: '1.5px solid',
            borderColor: activeCategory === cat.slug ? '#C1622A' : '#E8E0D8',
            backgroundColor: activeCategory === cat.slug ? '#C1622A' : '#ffffff',
            color: activeCategory === cat.slug ? '#ffffff' : '#1A1A1A',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
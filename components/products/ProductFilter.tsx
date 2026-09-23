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
  loading?: boolean
}

export default function ProductFilter({
  categories,
  activeCategory,
  onFilter,
  totalCount,
  loading = false
}: ProductFilterProps) {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '28px'
      }}>
        {[84, 120, 110, 95, 130].map((width, i) => (
          <div
            key={i}
            style={{
              width: `${width}px`,
              height: '35px',
              borderRadius: '20px',
              backgroundColor: '#F0EBE3',
              animation: 'pulse 1.5s infinite'
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    )
  }

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
        {totalCount > 0 ? `All (${totalCount})` : 'All'}
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
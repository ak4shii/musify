import React from 'react'

const AdminTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  emptyMessage = 'No items found',
  getRowKey = (item, index) => item.id || item.artistId || item.albumId || item.trackId || item.userId || index
}) => {
  if (!data || data.length === 0) {
    return (
      <div className='text-center py-12 text-gray-400'>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-white/10'>
            {columns.map((col, idx) => (
              <th key={idx} className='text-left py-3 px-4 text-sm font-semibold text-gray-400'>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className='text-right py-3 px-4 text-sm font-semibold text-gray-400'>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={getRowKey(item, rowIdx)} className='border-b border-white/5 hover:bg-white/5 transition-colors'>
              {columns.map((col, colIdx) => (
                <td key={colIdx} className='py-3 px-4 text-sm'>
                  {col.render ? col.render(item) : item[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className='py-3 px-4 text-right'>
                  <div className='flex gap-2 justify-end'>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className='px-3 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors text-sm'
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className='px-3 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-sm'
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable




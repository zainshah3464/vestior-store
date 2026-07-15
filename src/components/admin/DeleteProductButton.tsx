'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [confirming, setConfirming] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      toast.error('Delete failed')
    } else {
      toast.success('Product deleted')
      router.refresh()
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-red-400 hover:text-red-300 text-sm ml-2"
      >
        Delete
      </button>
    )
  }

  return (
    <span className="ml-2">
      <button onClick={handleDelete} className="text-red-500 font-bold text-sm">Confirm</button>
      <button onClick={() => setConfirming(false)} className="text-gray-500 text-sm ml-2">Cancel</button>
    </span>
  )
}
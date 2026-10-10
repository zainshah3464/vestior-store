import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getWishlistProducts } from '@/lib/wishlist/queries'
import WishlistGrid from './WishlistGrid'

export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const products = await getWishlistProducts()

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Your Wishlist
          </h1>
          <p className="text-gray-400 mt-1">
            {products.length} item{products.length === 1 ? '' : 's'} saved
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">
              Your wishlist is empty.
            </p>
            <Link
              href="/products"
              className="inline-block text-indigo-400 hover:underline"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <WishlistGrid products={products} />
        )}
      </div>
    </div>
  )
}
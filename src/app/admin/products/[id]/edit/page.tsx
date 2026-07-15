'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseProductImages } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Upload, X, ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

/* ---------- Continuous Animated Background Shapes ---------- */
function BackgroundShapes() {
  const [shapes, setShapes] = useState<{ x: number; y: number; size: number; duration: number; delay: number }[]>([])
  useEffect(() => {
    setShapes(
      Array.from({ length: 6 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 50,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl border border-white/5"
          style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: shape.size, height: shape.size }}
          animate={{ x: [0, 20, -15, 0], y: [0, -30, 15, 0], scale: [1, 1.08, 0.95, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: shape.duration, delay: shape.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    category: '',
    category_main: '',
    stock: '0',
    is_active: true,
    is_new_arrival: false,
    is_featured: false,
  })
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !product) {
        toast.error('Product not found')
        router.push('/admin/products')
        return
      }

      const images = parseProductImages(product.images)
      setExistingImages(images)
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        compare_at_price: product.compare_at_price?.toString() || '',
        category: product.category || '',
        category_main: product.category_main || '',
        stock: product.stock.toString(),
        is_active: product.is_active,
        is_new_arrival: product.is_new_arrival,
        is_featured: product.is_featured,
      })
      setFetching(false)
    }
    fetchProduct()
  }, [id, supabase, router])

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewImageFiles(prev => [...prev, ...files])
      const previews = files.map(file => URL.createObjectURL(file))
      setNewPreviews(prev => [...prev, ...previews])
    }
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newImageUrls: string[] = []
    for (const file of newImageFiles) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
      if (error) {
        toast.error('Image upload failed: ' + error.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      newImageUrls.push(urlData.publicUrl)
    }

    const allImageUrls = [...existingImages, ...newImageUrls]

    const { error } = await supabase
      .from('products')
      .update({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        category: form.category,
        category_main: form.category_main,
        stock: parseInt(form.stock),
        is_active: form.is_active,
        is_new_arrival: form.is_new_arrival,
        is_featured: form.is_featured,
        images: JSON.stringify(allImageUrls),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      toast.error('Update failed: ' + error.message)
    } else {
      toast.success('Product updated successfully!')
      router.push('/admin/products')
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto relative">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-white/10 rounded" />
          <div className="h-96 bg-white/5 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto relative"
    >
      <BackgroundShapes />

      <div className="relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white mb-8 flex items-center gap-2"
        >
          Edit Product
          <Sparkles className="w-6 h-6 text-amber-400" />
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Product Name*</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Price (₹)*</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Compare at Price</label>
                <input
                  type="number"
                  value={form.compare_at_price}
                  onChange={e => setForm({...form, compare_at_price: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Stock*</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => setForm({...form, stock: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category (sub)*</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="e.g. Classic Fit"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Main Category*</label>
                <select
                  value={form.category_main}
                  onChange={e => setForm({...form, category_main: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Pants">Pants</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Coats">Coats</option>
                  <option value="Waistcoats">Waistcoats</option>
                  <option value="Suits">Suits</option>
                  <option value="Gurkha">Gurkha</option>
                  <option value="2 Piece">2 Piece</option>
                  <option value="3 Piece">3 Piece</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all h-32 resize-none"
              />
            </div>
          </motion.div>

          {/* Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full" />
              Visibility & Flags
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Active', key: 'is_active', desc: 'Visible on store' },
                { label: 'New Arrival', key: 'is_new_arrival', desc: 'Show badge' },
                { label: 'Featured', key: 'is_featured', desc: 'Highlight on homepage' },
              ].map(toggle => (
                <label
                  key={toggle.key}
                  className="flex items-center justify-between bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/5 cursor-pointer hover:border-white/10 transition group"
                >
                  <div>
                    <span className="text-sm text-white">{toggle.label}</span>
                    <p className="text-xs text-gray-500">{toggle.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form[toggle.key as keyof typeof form] as boolean}
                    onChange={e =>
                      setForm({ ...form, [toggle.key]: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-600 rounded-full peer-checked:bg-indigo-600 relative transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-500 rounded-full" />
              Product Images
            </h2>

            {existingImages.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Current Images</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {existingImages.map((img, idx) => (
                    <motion.div
                      key={`existing-${idx}`}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {newPreviews.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">New Images</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {newPreviews.map((preview, idx) => (
                    <motion.div
                      key={`new-${idx}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30"
                    >
                      <img src={preview} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-10 cursor-pointer hover:border-indigo-500/50 transition group bg-black/20 backdrop-blur-sm">
              <Upload className="w-8 h-8 text-gray-500 group-hover:text-indigo-400 transition mb-2" />
              <span className="text-sm text-gray-400 group-hover:text-gray-300">Click or drag to add more images</span>
              <span className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP (max 5MB each)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
                className="absolute inset-0 opacity-0"
              />
            </label>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-4"
          >
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
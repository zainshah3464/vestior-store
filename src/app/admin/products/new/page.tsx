'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  ArrowLeft,
  Save,
  Loader2,
  Package,
  ImagePlus,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────
// Form field helper
// ─────────────────────────────────────────────
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <label className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-gray-600 truncate">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}

const MAIN_CATEGORIES = [
  'Pants',
  'Shirts',
  'Coats',
  'Waistcoats',
  'Suits',
  'Gurkha',
  '2 Piece',
  '3 Piece',
]

const TOGGLES = [
  { key: 'is_active' as const, label: 'Active', desc: 'Visible on store' },
  {
    key: 'is_new_arrival' as const,
    label: 'New Arrival',
    desc: 'Show NEW badge',
  },
  {
    key: 'is_featured' as const,
    label: 'Featured',
    desc: 'Highlight on homepage',
  },
]

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
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
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImageFiles(files)
      setPreviews(files.map((file) => URL.createObjectURL(file)))
    }
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const imageUrls: string[] = []
    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage
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
      imageUrls.push(urlData.publicUrl)
    }

    const { error } = await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price
        ? parseFloat(form.compare_at_price)
        : null,
      category: form.category,
      category_main: form.category_main,
      stock: parseInt(form.stock),
      is_active: form.is_active,
      is_new_arrival: form.is_new_arrival,
      is_featured: form.is_featured,
      images: JSON.stringify(imageUrls),
    })

    if (error) {
      toast.error('Error creating product: ' + error.message)
    } else {
      toast.success('Product created successfully!')
      router.push('/admin/products')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to Products
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2 backdrop-blur-sm">
          <Package
            size={10}
            className="text-indigo-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            New Product
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
          Create Product
        </h1>
        <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
          Fill in the details below. Upload images to bring it to life.
        </p>
      </motion.header>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* ─────────────────────────────────────────────
            Basic Info
           ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.05,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-4 sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.05] blur-[100px]"
          />

          <div className="relative flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
              <Package
                size={13}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Basic Information
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Core product details
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Charcoal Overcoat"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                required
              />
            </Field>

            <Field label="Price (₹)" required>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="18999"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                required
              />
            </Field>

            <Field label="Compare at Price" hint="Optional">
              <input
                type="number"
                value={form.compare_at_price}
                onChange={(e) =>
                  setForm({ ...form, compare_at_price: e.target.value })
                }
                placeholder="23999"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
              />
            </Field>

            <Field label="Stock" required>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                required
              />
            </Field>

            <Field label="Sub-Category" required hint="e.g. Classic Fit">
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="e.g. Classic Fit"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                required
              />
            </Field>

            <Field label="Main Category" required>
              <select
                value={form.category_main}
                onChange={(e) =>
                  setForm({ ...form, category_main: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] [&>option]:bg-[#1a1a1a] [&>option]:text-white cursor-pointer transition-all duration-200"
                required
              >
                <option value="">Select…</option>
                {MAIN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="relative mt-4">
            <Field label="Description" hint="Optional">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                placeholder="Craft a compelling description that sells the piece…"
                className="w-full px-3.5 py-3 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200 resize-none leading-relaxed"
              />
            </Field>
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────
            Visibility & Flags
           ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-4 sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-violet-500/[0.05] blur-[100px]"
          />

          <div className="relative flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/[0.1] border border-violet-500/25 flex items-center justify-center">
              <Sliders
                size={13}
                className="text-violet-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Visibility & Flags
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Control how this product appears
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TOGGLES.map((toggle) => (
              <label
                key={toggle.key}
                className="group flex items-center justify-between gap-3 p-3.5 rounded-xl bg-black/30 border border-white/[0.06] hover:bg-black/50 hover:border-white/[0.12] cursor-pointer transition-colors duration-200"
              >
                <div className="min-w-0">
                  <p className="text-[12px] text-white font-medium leading-tight">
                    {toggle.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {toggle.desc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form[toggle.key] as boolean}
                  onChange={(e) =>
                    setForm({ ...form, [toggle.key]: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="relative w-10 h-6 bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors duration-200 flex-shrink-0">
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform duration-200" />
                </div>
              </label>
            ))}
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────
            Image Upload
           ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-4 sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-fuchsia-500/[0.05] blur-[100px]"
          />

          <div className="relative flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-500/[0.1] border border-fuchsia-500/25 flex items-center justify-center">
              <ImagePlus
                size={13}
                className="text-fuchsia-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Product Images
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                PNG, JPG, or WEBP · max 5MB each
              </p>
            </div>
          </div>

          <AnimatePresence>
            {previews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative mb-4"
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {previews.map((preview, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-white/[0.08] bg-black/30"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all duration-200"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        <X size={12} aria-hidden="true" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] rounded-2xl p-8 sm:p-10 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:bg-indigo-500/[0.1] group-hover:border-indigo-500/30 transition-all duration-300">
              <Upload
                size={18}
                className="text-gray-500 group-hover:text-indigo-400 transition-colors duration-300"
                aria-hidden="true"
              />
            </div>
            <span className="text-[12px] font-medium text-gray-300 group-hover:text-white transition-colors">
              Click to upload or drag images here
            </span>
            <span className="text-[10px] text-gray-600 mt-1">
              Multiple files supported
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </motion.section>

        {/* ─────────────────────────────────────────────
            Actions
           ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2"
        >
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-[12px] font-medium text-gray-400 hover:text-white bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-40 transition-all duration-200"
          >
            Cancel
          </button>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={loading ? {} : { scale: 0.98 }}
            className="group/btn relative w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[12px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {!loading && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {loading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Check size={14} aria-hidden="true" />
              )}
              {loading ? 'Creating…' : 'Create Product'}
            </span>
          </motion.button>
        </motion.div>
      </form>
    </div>
  )
}
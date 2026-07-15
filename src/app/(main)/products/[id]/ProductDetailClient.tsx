'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Copy, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  stock: number;
  is_new_arrival: boolean;
  category_main: string;
}

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom'];

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const router = useRouter();

  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id && item.size === selectedSize);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        compare_at_price: product.compare_at_price,
        images: product.images,
        stock: product.stock,
        quantity,
        size: selectedSize,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!', { icon: '🛒' });
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(product.id)) {
      const newWishlist = wishlist.filter((id: string) => id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      toast.success('Removed from wishlist');
    } else {
      wishlist.push(product.id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      toast.success('Added to wishlist');
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/products/${product.id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const shareWhatsApp = () => {
    const text = `Check out ${product.name} - ₹${product.price}`;
    const url = `${window.location.origin}/products/${product.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#111] rounded-xl overflow-hidden group">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={product.images[selectedImage] || 'https://placehold.co/800x800/1a1a1a/3B82F6?text=No+Image'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="text-white" size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100">
                    <ChevronRight className="text-white" size={20} />
                  </button>
                </>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {discount}% OFF
                </div>
              )}
              {product.is_new_arrival && (
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  NEW
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === idx ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-sm text-blue-400">{product.category_main}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString()}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-gray-500 line-through">₹{product.compare_at_price.toLocaleString()}</span>
              )}
            </div>

            {availableSizes && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm transition ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#111] border border-white/10 rounded-lg">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-400 hover:text-white">-</button>
                  <span className="px-4 text-white">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-gray-400 hover:text-white">+</button>
                </div>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-400">{product.stock} in stock</span>
                ) : (
                  <span className="text-sm text-red-400">Out of stock</span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <div className="flex gap-4 mb-8">
              <button onClick={toggleWishlist} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition">
                <Heart size={18} />
                <span className="text-sm">Wishlist</span>
              </button>
              <button onClick={copyLink} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition">
                <Copy size={18} />
                <span className="text-sm">Copy Link</span>
              </button>
              <button onClick={shareWhatsApp} className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition">
                <MessageCircle size={18} />
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>

            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Truck size={20} className="text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
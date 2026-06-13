"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProduct, type ProductActionState } from "@/app/actions/products";
import { createClient } from "@/lib/supabase/client";

export interface ProductFormProduct {
  id: string;
  slug: string;
  name: string;
  variant_label: string;
  tagline: string;
  description: string | null;
  category_id: string | null;
  batch_no: string;
  pressed_at: string;
  origin: string;
  starting_from_inr: number | string;
  rating: number | string | null;
  brand?: string | null;
  benefits: string[] | null;
  hue_a: string;
  hue_b: string;
  is_active: boolean;
  position: number;
  hero_image?: string | null;
}

interface ProductFormProps {
  product?: ProductFormProduct | null;
  categories: { id: string; name: string }[];
}

const INITIAL: ProductActionState = {};

const labelCls =
  "font-body text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2";
const inputCls =
  "w-full bg-white border border-gray-200 focus:border-leaf focus:ring-1 focus:ring-leaf focus:outline-none transition-all duration-200 px-4 py-2.5 text-base md:text-sm text-gray-900 font-body rounded-xl shadow-xs placeholder-gray-400/60";

export function ProductForm({ product, categories }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    saveProduct,
    INITIAL,
  );

  const [hueA, setHueA] = useState(product?.hue_a || "#D4A24C");
  const [hueB, setHueB] = useState(product?.hue_b || "#A8762A");
  const [heroImageUrl, setHeroImageUrl] = useState(product?.hero_image || "");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("Processing...");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setHeroImageUrl(publicUrl);
      setUploadStatus("Successfully uploaded to Supabase Storage!");
    } catch (err: any) {
      console.warn("Supabase storage upload failed, falling back to base64:", err);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setHeroImageUrl(base64);
        setUploadStatus("Saved locally (Base64 fallback due to offline storage).");
      };
      reader.onerror = () => {
        setUploadStatus("Error reading file.");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="hero_image" value={heroImageUrl} />

      {/* CARD 1: Basic Information */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Basic Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input
              name="name"
              required
              defaultValue={product?.name ?? ""}
              placeholder="Chekku Coconut Oil"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slug (URL ID) *</label>
            <input
              name="slug"
              required
              defaultValue={product?.slug ?? ""}
              placeholder="chekku-coconut-oil"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Variant Label *</label>
            <input
              name="variant_label"
              required
              defaultValue={product?.variant_label ?? ""}
              placeholder="Wood-pressed"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className={inputCls}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CARD 2: Product Image & Assets */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Product Image & Assets
        </h3>
        
        <div className="grid gap-6 items-center md:grid-cols-[200px_1fr]">
          {/* Image Preview */}
          <div className="aspect-[4/3] w-full max-w-[200px] mx-auto md:mx-0 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 relative flex items-center justify-center overflow-hidden group hover:border-leaf/50 transition-colors">
            {heroImageUrl ? (
              <>
                <img
                  src={heroImageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold font-body">Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mt-2">
                  No Image Selected
                </span>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="space-y-4">
            <div>
              <span className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Upload New Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-xs text-gray-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-full file:border file:border-leaf
                  file:text-xs file:font-bold file:font-body
                  file:bg-transparent file:text-leaf
                  hover:file:bg-leaf hover:file:text-white
                  file:transition-all file:cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 font-mono text-[10px] text-gray-400 uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div>
              <span className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Custom Image URL
              </span>
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => {
                  setHeroImageUrl(e.target.value);
                  setUploadStatus(null);
                }}
                placeholder="https://example.com/image.jpg"
                className={inputCls}
              />
            </div>

            {uploadStatus && (
              <p className={`font-mono text-[10px] uppercase tracking-wider ${uploadStatus.includes("Error") ? "text-red-500" : "text-leaf"}`}>
                {uploadStatus}
              </p>
            )}

            {heroImageUrl && (
              <button
                type="button"
                onClick={() => {
                  setHeroImageUrl("");
                  setUploadStatus(null);
                }}
                className="font-body text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider underline block transition-colors"
              >
                Remove image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3: Description & Key Benefits */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Description & Marketing Content
        </h3>
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Tagline (shown on catalog card) *</label>
            <textarea
              name="tagline"
              required
              rows={2}
              defaultValue={product?.tagline ?? ""}
              placeholder="Slow-turned in a traditional wooden press…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Description (shown in product details popup)</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              placeholder="Full description of the product and extraction method..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Key Benefits (one per line)</label>
            <textarea
              name="benefits"
              rows={4}
              defaultValue={(product?.benefits ?? []).join("\n")}
              placeholder={"100% Raw & Unrefined\nTraditional Wood Press\nZero Added Preservatives"}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* CARD 4: Pricing, Branding & Sorting */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Pricing, Branding & Sorting
        </h3>
        {/* Responsive pricing grid: stacks into 2 columns (grid-cols-2) on mobile, 4 columns (sm:grid-cols-4) on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div>
            <label className={labelCls}>Starting Price (₹) *</label>
            <input
              name="starting_from_inr"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={product?.starting_from_inr ?? ""}
              placeholder="320"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Rating (0–5, optional)</label>
            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              defaultValue={product?.rating ?? ""}
              placeholder="4.9"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Brand</label>
            <input
              name="brand"
              defaultValue={product?.brand ?? "Thennaiyan"}
              placeholder="Thennaiyan"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Sort Position</label>
            <input
              name="position"
              type="number"
              step="1"
              defaultValue={product?.position ?? 0}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* CARD 5: Production Details & Hues */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Manufacturing Details & Visual Hues
        </h3>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>Batch Number *</label>
            <input
              name="batch_no"
              required
              defaultValue={product?.batch_no ?? ""}
              placeholder="042"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pressed Date *</label>
            <input
              name="pressed_at"
              type="date"
              required
              defaultValue={product?.pressed_at ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Origin</label>
            <input
              name="origin"
              defaultValue={product?.origin ?? "Madurai"}
              placeholder="Madurai"
              className={inputCls}
            />
          </div>
        </div>

        {/* Colour / bottle hue picker */}
        <div className="pt-4 border-t border-gray-100">
          <label className={labelCls}>Gradient Palette (Used for Fallbacks & Dashboard Visuals)</label>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="hue_a"
                value={hueA}
                onChange={(e) => setHueA(e.target.value)}
                className="h-10 w-14 border border-gray-200 rounded-lg cursor-pointer bg-transparent"
              />
              <span className="font-mono text-xs text-gray-500 font-bold">{hueA}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="hue_b"
                value={hueB}
                onChange={(e) => setHueB(e.target.value)}
                className="h-10 w-14 border border-gray-200 rounded-lg cursor-pointer bg-transparent"
              />
              <span className="font-mono text-xs text-gray-500 font-bold">{hueB}</span>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <span className="text-xs text-gray-400 font-bold font-body">Preview:</span>
              <div
                className="h-10 w-24 border border-gray-100 rounded-xl shadow-xs"
                style={{
                  background: `linear-gradient(160deg, ${hueA} 0%, ${hueB} 100%)`,
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Checkbox Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-sm font-bold text-gray-800">
            Publish Status
          </h4>
          <p className="text-xs text-gray-400 font-semibold font-body mt-0.5">
            Decide if this product should be visible on the public storefront.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product ? product.is_active : true}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-leaf"></div>
        </label>
      </div>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">
          {state.error}
        </p>
      )}

      {/* Form Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 rounded-full bg-leaf hover:bg-leaf-deep text-white font-body text-sm font-bold transition-all duration-200 shadow-md select-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : product?.id ? "Save Changes" : "Create Product"}
        </button>
        <Link 
          href="/admin/products" 
          className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 font-body text-sm font-bold transition-all duration-200 select-none"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

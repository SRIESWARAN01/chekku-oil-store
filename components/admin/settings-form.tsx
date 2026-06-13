"use client";

import { useActionState, useState } from "react";
import { saveSettings, type SettingsActionState } from "@/app/actions/settings";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface SettingsValues {
  business_name: string;
  brand_short: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  business_hours: string;
  legal_owner: string;
  gst_number: string;
  business_type: string;
  registration_type: string;
  gst_reg_date: string;
  gst_valid_from: string;
  gst_valid_to: string;
  jurisdiction: string;
  proprietor_designation: string;
  proprietor_state: string;
  gst_approving_officer: string;
  gst_certificate_issue_date: string;
  additional_branches: string;
  address: string;
  hero_banner_image?: string;
  hero_title?: string;
  hero_subtitle?: string;
}

const INITIAL: SettingsActionState = {};

const labelCls =
  "font-body text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2";
const inputCls =
  "w-full bg-white border border-gray-200 focus:border-leaf focus:ring-1 focus:ring-leaf focus:outline-none transition-all duration-200 px-4 py-2.5 text-base md:text-sm text-gray-900 font-body rounded-xl shadow-xs placeholder-gray-400/60";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && (
        <p className="mt-1.5 font-body text-[11px] text-gray-400 font-medium leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SettingsValues }) {
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(
    saveSettings,
    INITIAL,
  );

  const [heroBannerImage, setHeroBannerImage] = useState(settings.hero_banner_image || "");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("Uploading banner...");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `banners/hero-banner-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setHeroBannerImage(publicUrl);
      setUploadStatus("Banner successfully uploaded!");
    } catch (err: any) {
      console.warn("Storage upload failed, falling back to base64:", err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setHeroBannerImage(event.target?.result as string);
        setUploadStatus("Saved locally (Base64 fallback).");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      <input type="hidden" name="hero_banner_image" value={heroBannerImage} />

      {/* CARD 1: Brand & Contact Info */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Brand & Contact Configuration
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Business name"
            name="business_name"
            defaultValue={settings.business_name}
          />
          <Field
            label="Short brand name"
            name="brand_short"
            defaultValue={settings.brand_short}
            hint="Used in the WhatsApp order messages and invoices."
          />
          <Field
            label="WhatsApp number *"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number}
            placeholder="918124165047"
            hint="Digits only, with country code (no + or spaces)."
          />
          <Field
            label="Display phone"
            name="contact_phone"
            defaultValue={settings.contact_phone}
            placeholder="+91 81241 65047"
          />
          <Field
            label="Support email"
            name="contact_email"
            type="email"
            defaultValue={settings.contact_email}
          />
          <Field
            label="Business hours"
            name="business_hours"
            defaultValue={settings.business_hours}
          />
        </div>
      </div>

      {/* CARD 2: Homepage Banner Settings */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Homepage Hero Banner Settings
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Custom Banner Title (Optional)"
            name="hero_title"
            defaultValue={settings.hero_title || ""}
            placeholder="Enter custom title..."
            hint="Overrides the default business name title."
          />
          <Field
            label="Custom Banner Subtitle (Optional)"
            name="hero_subtitle"
            defaultValue={settings.hero_subtitle || ""}
            placeholder="Enter custom subtitle..."
            hint="Overrides the default tagline subtitle."
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <span className={labelCls}>Banner Background Image</span>
          
          <div className="grid gap-6 items-center md:grid-cols-[240px_1fr] mt-3">
            {/* Banner Preview */}
            <div className="aspect-[16/9] w-full max-w-[240px] mx-auto md:mx-0 border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden relative flex items-center justify-center group shadow-xs">
              {heroBannerImage ? (
                <>
                  <img
                    src={heroBannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold font-body">Change Graphic</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-3">
                  <svg className="mx-auto h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mt-2">
                    Default Solid Color
                  </span>
                </div>
              )}
            </div>

            {/* Banner Controls */}
            <div className="space-y-4">
              <div>
                <span className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Upload Background Graphic
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploading}
                  className="block w-full text-xs text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border file:border-leaf
                    file:text-xs file:font-bold file:font-body
                    file:bg-transparent file:text-leaf
                    hover:file:bg-leaf hover:file:text-white
                    file:transition-all file:cursor-pointer disabled:opacity-50"
                />
              </div>

              {uploadStatus && (
                <p className={`font-mono text-[10px] uppercase tracking-wider ${uploadStatus.includes("Error") ? "text-red-500" : "text-leaf"}`}>
                  {uploadStatus}
                </p>
              )}

              {heroBannerImage && (
                <button
                  type="button"
                  onClick={() => {
                    setHeroBannerImage("");
                    setUploadStatus(null);
                  }}
                  className="font-body text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider underline block transition-colors"
                >
                  Delete banner image (reset to solid)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Registration & Story */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Registration & Story Setup
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Legal owner"
            name="legal_owner"
            defaultValue={settings.legal_owner}
          />
          <Field
            label="GST number"
            name="gst_number"
            defaultValue={settings.gst_number}
          />
          <Field
            label="Business type"
            name="business_type"
            defaultValue={settings.business_type}
          />
          <Field
            label="Registration type"
            name="registration_type"
            defaultValue={settings.registration_type}
          />
          <Field
            label="GST registration date"
            name="gst_reg_date"
            defaultValue={settings.gst_reg_date}
          />
          <Field
            label="GST valid from"
            name="gst_valid_from"
            defaultValue={settings.gst_valid_from}
          />
          <Field
            label="GST valid to"
            name="gst_valid_to"
            defaultValue={settings.gst_valid_to}
          />
          <Field
            label="GST jurisdiction"
            name="jurisdiction"
            defaultValue={settings.jurisdiction}
          />
          <Field
            label="Proprietor designation"
            name="proprietor_designation"
            defaultValue={settings.proprietor_designation}
          />
          <Field
            label="Proprietor state"
            name="proprietor_state"
            defaultValue={settings.proprietor_state}
          />
          <Field
            label="Approving officer"
            name="gst_approving_officer"
            defaultValue={settings.gst_approving_officer}
          />
          <Field
            label="Certificate issue date"
            name="gst_certificate_issue_date"
            defaultValue={settings.gst_certificate_issue_date}
          />
          <Field
            label="Additional branches"
            name="additional_branches"
            defaultValue={settings.additional_branches}
          />
        </div>
        <div>
          <label className={labelCls}>Registered address</label>
          <textarea
            name="address"
            rows={3}
            defaultValue={settings.address}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="font-body text-sm text-leaf-deep bg-leaf-mist border border-leaf/20 px-4 py-3 rounded-2xl">
          Store settings successfully updated.
        </p>
      )}

      {/* Form Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 rounded-full bg-leaf hover:bg-leaf-deep text-white font-body text-sm font-bold transition-all duration-200 shadow-md select-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CategoryActionState = { error?: string };

function parseCategory(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

function revalidateCategories() {
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function saveCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const v = parseCategory(formData);

  if (!v.name || !v.slug) {
    throw new Error("Please fill all required fields: name and slug.");
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("categories")
      .update(v)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("categories").insert(v);
    if (error) throw new Error(error.message);
  }

  revalidateCategories();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidateCategories();
  redirect("/admin/categories");
}

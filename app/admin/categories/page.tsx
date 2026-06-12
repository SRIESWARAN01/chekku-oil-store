import Link from "next/link";
import { Plus, Pencil, ArrowLeft, Folder } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { deleteCategory, saveCategory } from "@/app/actions/categories";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = {
  title: "Categories - Admin",
};

interface PageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { edit } = await searchParams;
  const categories = await getCategories();

  // Find category to edit if edit id is provided
  const categoryToEdit = edit ? categories.find((c) => c.id === edit) : null;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow font-mono">Catalog</span>
          <h1
            className="mt-2 font-display text-display-md text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
          >
            Categories
          </h1>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Categories List */}
        <div className="space-y-4">
          <h2 className="font-body text-base font-extrabold text-ink">
            Existing Categories
          </h2>

          {categories.length === 0 ? (
            <p className="font-body text-sm text-shell bg-kernel border hairline p-8 text-center">
              No categories found. Create your first category on the right.
            </p>
          ) : (
            <div className="bg-white border hairline overflow-hidden shadow-xs rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b hairline bg-gray-50 text-left font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                    <th className="px-4 py-3 font-semibold">Position</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b hairline last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Folder size={14} className="text-leaf shrink-0" />
                          <div>
                            <div className="font-body font-bold text-ink">{cat.name}</div>
                            {cat.description && (
                              <div className="font-body text-xs text-shell line-clamp-1">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-shell">
                        {cat.slug}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-shell">
                        {cat.position}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/categories?edit=${cat.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 border border-leaf text-leaf hover:bg-leaf hover:text-white transition-colors rounded-sm text-xs font-semibold"
                          >
                            <Pencil size={11} /> Edit
                          </Link>
                          <form action={deleteCategory} className="inline">
                            <input type="hidden" name="id" value={cat.id} />
                            <ConfirmSubmit
                              message={`Delete category "${cat.name}"? Products attached to it will have their category cleared.`}
                              className="px-2 py-1 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-sm text-xs font-semibold"
                            >
                              Delete
                            </ConfirmSubmit>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Category Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-base font-extrabold text-ink">
              {categoryToEdit ? "Edit Category" : "Add New Category"}
            </h2>
            {categoryToEdit && (
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-leaf transition-colors font-semibold"
              >
                <ArrowLeft size={12} /> Cancel edit
              </Link>
            )}
          </div>

          <form action={saveCategory} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm space-y-4">
            {categoryToEdit && (
              <input type="hidden" name="id" value={categoryToEdit.id} />
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={categoryToEdit?.name ?? ""}
                placeholder="e.g. Cold-pressed Oils"
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf transition-all"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                defaultValue={categoryToEdit?.slug ?? ""}
                placeholder="e.g. cold-pressed-oils"
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm font-mono text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf transition-all"
              />
              <p className="mt-1 text-[10px] text-gray-400 font-semibold leading-relaxed">
                Unique identifier used in URLs (e.g. /shop?category=slug). Use lowercase letters, numbers, and dashes.
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={categoryToEdit?.description ?? ""}
                placeholder="Write a brief summary of what this category contains..."
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf transition-all"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Sort Position
              </label>
              <input
                id="position"
                name="position"
                type="number"
                defaultValue={categoryToEdit?.position ?? 0}
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm font-mono text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf transition-all"
              />
              <p className="mt-1 text-[10px] text-gray-400 font-semibold">
                Categories are sorted by this number ascending (lower number first).
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-primary !py-2.5 rounded-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              {categoryToEdit ? "Save Category Changes" : "Create Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

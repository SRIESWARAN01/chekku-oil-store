import { getSettings } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";
import { CartView } from "@/components/cart-view";

export const metadata = {
  title: "Cart - Thennaiyan Coconut Company",
};

export default async function CartPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8 pb-24">
        <CartView settings={settings} />
      </main>
    </div>
  );
}

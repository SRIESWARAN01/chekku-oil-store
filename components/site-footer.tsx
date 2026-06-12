import { getSettings } from "@/lib/queries";

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <img
                src="/logo.png"
                alt={settings.brand_short}
                className="h-8 w-8 border border-leaf/20 object-contain"
              />
              <span>{settings.brand_short}</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed">
              Registered proprietorship business engaged in coconut-related
              trading and business activities from Peraiyur, Madurai District.
            </p>
            <div className="mt-4 flex gap-4">
              <a 
                href="https://www.instagram.com/sri_thennaiyancoconut"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-leaf">
              Contact
            </div>
            <p className="text-sm leading-relaxed">
              {settings.business_name}
              <br />
              {settings.address}
              <br />
              <a 
                href="https://maps.app.goo.gl/ErtZbKciBULoFxQ6A"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-leaf hover:underline font-bold"
              >
                📍 View on Google Maps
              </a>
              <span className="mt-2 block font-semibold text-white">
                Phone: {settings.contact_phone}
              </span>
              <span className="block text-xs font-semibold">Email: {settings.contact_email}</span>
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-leaf">
              Company
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["Products", "/#products"],
                ["Story", "/story"],
                ["Journal", "/journal"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy"],
                ["Terms & Conditions", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-900 pt-6 text-xs text-gray-600">
          <p>
            &copy; 2026 {settings.business_name.toUpperCase()} &middot; ALL
            RIGHTS RESERVED
          </p>
          <p>Built with care by PixlNova</p>
        </div>
      </div>
    </footer>
  );
}

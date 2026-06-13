import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BatchStamp } from "@/components/batch-stamp";
import { User, MapPin, FileText, Calendar, Building, Landmark } from "lucide-react";
import { getSettings } from "@/lib/queries";
import { FaqAccordion } from "@/components/faq-accordion";

export const metadata = {
  title: "Our Story - Thennaiyan Coconut Company",
};

export default async function StoryPage() {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen">
        <section className="container pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-3xl">
            <span className="eyebrow">Company Profile</span>
            <h1
              className="mt-6 font-display text-display-lg lg:text-display-xl text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
            >
              {settings.business_name}
            </h1>
            <p className="mt-8 font-body text-lg lg:text-xl text-shell leading-relaxed">
              {settings.business_name} is a Tamil Nadu-based proprietorship
              business owned and operated by Mr. {settings.legal_owner}. The
              company is registered under GST with GSTIN {settings.gst_number}
              and operates from Peraiyur, Madurai District, Tamil Nadu.
            </p>
            <p className="mt-6 font-body text-base text-shell-husk leading-relaxed">
              The business functions as a registered proprietorship enterprise
              engaged in coconut-related trading and business activities, with
              its principal place of business at Veppampatti Vilakku,
              Pappinaickanpatti, Peraiyur.
            </p>

            <div className="mt-10">
              <BatchStamp batch="GST" pressed="22 JAN 2026" />
            </div>
          </div>
        </section>

        <section className="border-t border-b hairline bg-kernel-deeper/30 py-20 lg:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
              <div>
                <span className="eyebrow">Official Registration</span>
                <h2
                  className="mt-3 font-display text-display-md text-leaf-deep"
                  style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
                >
                  GST Certificate Details
                </h2>
                <p className="mt-6 font-body text-sm text-shell leading-relaxed">
                  The company maintains its principal place of business in
                  Madurai District and is registered under the GST Department,
                  Thirumangalam jurisdiction, as a regular GST registration.
                </p>
              </div>

              <div className="bg-kernel p-5 sm:p-8 lg:p-10 border hairline shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-shell/15 pb-6">
                  <div>
                    <span className="font-mono text-eyebrow text-oil uppercase">
                      Registration Profile
                    </span>
                    <h3
                      className="mt-1 font-display text-2xl text-ink"
                      style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}
                    >
                      {settings.business_name}
                    </h3>
                  </div>
                  <Landmark className="text-oil" size={28} strokeWidth={1.5} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 font-body text-sm text-shell">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <Building size={14} className="text-leaf" /> Company Name
                    </span>
                    <p className="font-semibold text-ink">{settings.business_name}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <User size={14} className="text-leaf" /> Legal Owner
                    </span>
                    <p className="font-semibold text-ink">{settings.legal_owner}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <FileText size={14} className="text-leaf" /> GST Number (GSTIN)
                    </span>
                    <p className="font-mono font-semibold text-ink break-all">
                      {settings.gst_number}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <Building size={14} className="text-leaf" /> Business Type
                    </span>
                    <p className="font-semibold text-ink">{settings.business_type}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Registration Type
                    </span>
                    <p className="font-semibold text-ink">
                      {settings.registration_type}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <Calendar size={14} className="text-leaf" /> GST Registration Date
                    </span>
                    <p className="font-semibold text-ink">{settings.gst_reg_date}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Valid From
                    </span>
                    <p className="font-semibold text-ink">{settings.gst_valid_from}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Valid To
                    </span>
                    <p className="font-semibold text-ink">{settings.gst_valid_to}</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <MapPin size={14} className="text-leaf" /> Registered Address
                    </span>
                    <p className="font-semibold text-ink leading-relaxed">
                      {settings.business_name}
                      <br />
                      {settings.address}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Proprietor Designation
                    </span>
                    <p className="font-semibold text-ink">
                      {settings.proprietor_designation}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Proprietor State
                    </span>
                    <p className="font-semibold text-ink">
                      {settings.proprietor_state}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      GST Jurisdiction Office
                    </span>
                    <p className="font-semibold text-ink">{settings.jurisdiction}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Approving Officer
                    </span>
                    <p className="font-semibold text-ink">
                      {settings.gst_approving_officer}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Certificate Issue Date
                    </span>
                    <p className="font-semibold text-ink">
                      {settings.gst_certificate_issue_date}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">
                      Additional Branches
                    </span>
                    <p className="font-semibold text-ink">
                      {settings.additional_branches}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-24 bg-kernel border-b hairline">
          <div className="container max-w-4xl space-y-16">
            
            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="eyebrow text-oil">Our Purpose</span>
                <h3 className="font-display text-2xl text-leaf-deep font-bold" style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}>Our Mission</h3>
                <p className="font-body text-sm lg:text-base text-shell leading-relaxed">
                  To revive and preserve the age-old tradition of wood-pressed (Chekku) oil extraction, ensuring households across India have access to 100% pure, unrefined, and chemical-free coconut oils that promote healthy living and culinary authenticity.
                </p>
              </div>
              <div className="space-y-4">
                <span className="eyebrow text-oil">Our Horizon</span>
                <h3 className="font-display text-2xl text-leaf-deep font-bold" style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}>Our Vision</h3>
                <p className="font-body text-sm lg:text-base text-shell leading-relaxed">
                  To become the nation's most trusted brand for natural coconut products, empowering local farming communities in Madurai and establishing traditional cold-press techniques as the gold standard for pure cooking oils globally.
                </p>
              </div>
            </div>

            {/* Sustainability Statement */}
            <div className="pt-12 border-t border-shell/10 space-y-4">
              <span className="eyebrow text-leaf">Coconet Solutions</span>
              <h3 className="font-display text-3xl text-[#1f6b3b] font-extrabold" style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}>
                Empowering a Sustainable Future
              </h3>
              <p className="font-body text-sm lg:text-base text-shell leading-relaxed">
                At Coconet, we're revolutionizing how natural resources can power innovation. Our eco-friendly coconut-based products are crafted to deliver exceptional performance while protecting the planet. Whether it's for agriculture, construction, erosion control, or lifestyle needs, our solutions blend nature’s power with cutting-edge sustainability. Join us in building a cleaner, greener world—one coconut at a time.
              </p>
            </div>

            {/* Work Process */}
            <div className="pt-12 border-t border-shell/10 space-y-4">
              <span className="eyebrow text-oil">About Our Work Process</span>
              <h3 className="font-display text-3xl text-leaf-deep font-extrabold" style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}>
                How We Operate
              </h3>
              <p className="font-body text-sm lg:text-base text-shell leading-relaxed">
                At Thennaiyan Company, we specialize in delivering premium-quality coconuts and coconut-based products to global markets. With years of experience in the coconut industry, we are committed to providing fresh, organic, and carefully selected coconuts that meet international export standards.
              </p>
              <p className="font-body text-sm lg:text-base text-shell leading-relaxed">
                Our products are sourced directly from trusted farms, ensuring natural taste, rich nutrients, and eco-friendly processing. We export a wide variety of coconut products, including fresh coconuts, tender coconuts, desiccated coconut, coconut oil, and coir products to countries worldwide.
              </p>
              <p className="font-body text-sm lg:text-base text-shell leading-relaxed">
                With a focus on quality, timely delivery, and customer satisfaction, Thennaiyan Company has earned a reputation as a reliable coconut exporter, building strong and long-lasting relationships with clients across the globe.
              </p>
            </div>

            {/* Leadership Profile */}
            <div className="pt-12 border-t border-shell/10 space-y-4">
              <span className="eyebrow text-leaf">Leadership</span>
              <h3 className="font-display text-3xl text-leaf-deep font-extrabold" style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}>
                Managing Director's Profile
              </h3>
              <div className="bg-gray-50 border border-gray-100 p-4 sm:p-6 rounded-2xl space-y-2">
                <p className="font-display text-xl font-bold text-ink">Mr. Tamil Arashan</p>
                <p className="font-mono text-xs text-leaf font-bold uppercase tracking-wider">Managing Director</p>
                <p className="font-body text-sm text-shell leading-relaxed mt-2">
                  Completing his BBA in May 2025, Mr. Tamil Arashan established his own export venture, <strong>Thennaiyan Export</strong>, in July 2025. Guided by his leadership, the company integrates traditional values with modern export standards to offer outstanding sustainable solutions to worldwide clients.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-24 bg-kernel">
          <div className="container max-w-4xl">
            <span className="eyebrow text-oil">Common Enquiries</span>
            <h2 className="mt-3 font-display text-display-md text-leaf-deep" style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}>
              Frequently Asked Questions
            </h2>
            <p className="mt-4 font-body text-sm md:text-base text-shell max-w-2xl leading-relaxed">
              Find quick answers to queries regarding our wooden chekku press methods, product packaging, and WhatsApp order delivery process.
            </p>
            <FaqAccordion />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

import { ContactForm } from "@/components/pages/contact/ContactForm";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactInformation } from "@/components/pages/contact/ContactInformation";
import { ContactSupportCards } from "@/components/pages/contact/ContactSupportCards";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GearNest for equipment rental, listing and platform support.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section aria-label="Contact inquiry form and information" className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <ContactInformation />
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <ContactSupportCards />
    </>
  );
}

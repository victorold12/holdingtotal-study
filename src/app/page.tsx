import { Hero } from "@/generated/Hero";
import { Comparison } from "@/generated/Comparison";
import { AlertBanner } from "@/generated/AlertBanner";
import { Testimonials } from "@/generated/Testimonials";
import { Audience } from "@/generated/Audience";
import { Offer } from "@/generated/Offer";
import { Guarantee } from "@/generated/Guarantee";
import { Mentor } from "@/generated/Mentor";
import { Faq } from "@/generated/Faq";
import { FinalParallax } from "@/generated/FinalParallax";
import { Footer } from "@/generated/Footer";
import { ScrollReveals } from "@/components/ScrollReveals";

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <Comparison />
        <AlertBanner />
        <Testimonials />
        <Audience />
        <Offer />
        <Guarantee />
        <Mentor />
        <Faq />
        <FinalParallax />
      </main>
      <Footer />
      <ScrollReveals />
    </>
  );
}

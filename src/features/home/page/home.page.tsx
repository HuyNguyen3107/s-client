import Hero from "../components/hero.component";
import PromotionSection from "../components/promotion-section.component";
import FeaturedProducts from "../components/featured-products.component";
import OrderProcess from "../components/order-process.component";
import CtaSection from "../components/cta-section.component";
import TestimonialSection from "../components/testimonial-section.component";
import ImprintGiftSection from "../components/imprint-gift-section.component";
import ConsultFormSection from "../components/consult-form-section.component";
import ScrollReveal from "../components/scroll-reveal.component";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

type Props = {};

function HomePage({}: Props) {
  // Set page metadata
  usePageMetadata();

  return (
    <>
      <Hero />
      {/* promotion section below hero */}
      <ScrollReveal animation="fade-in-up">
        <PromotionSection />
      </ScrollReveal>
      {/* featured products */}
      <ScrollReveal animation="fade-in-up" delay={100}>
        <FeaturedProducts />
      </ScrollReveal>
      {/* order process section */}
      <ScrollReveal animation="fade-in-up">
        <OrderProcess />
      </ScrollReveal>
      {/* call to action section */}
      <ScrollReveal animation="scale-in">
        <CtaSection />
      </ScrollReveal>
      {/* testimonial section */}
      <ScrollReveal animation="fade-in-up">
        <TestimonialSection />
      </ScrollReveal>
      {/* imprint gift section */}
      <ScrollReveal animation="fade-in-left">
        <ImprintGiftSection />
      </ScrollReveal>
      {/* consult form section */}
      <ScrollReveal animation="fade-in-up">
        <ConsultFormSection />
      </ScrollReveal>
    </>
  );
}

export default HomePage;

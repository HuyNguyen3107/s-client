import ContactHero from "../components/contact-hero.component";
import ContactInfo from "../components/contact-info.component";
import ScrollReveal from "../../home/components/scroll-reveal.component";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

const ContactPage = () => {
  // Set page metadata
  usePageMetadata();

  return (
    <div>
      <ContactHero />
      <ScrollReveal animation="fade-in-up">
        <ContactInfo />
      </ScrollReveal>
    </div>
  );
};

export default ContactPage;

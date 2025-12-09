import AboutHeroSection from "../components/about-hero-section.component";
import AboutMeaningSection from "../components/about-meaning-section.component";
import StoryIntroSection from "../components/story-intro-section.component";
import AboutStoryCardsSection from "../components/about-story-cards-section.component";
import FeaturedProductsSection from "../components/about-featured-products-section.component";
import ScrollReveal from "../../home/components/scroll-reveal.component";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

type Props = {};

function AboutPage({}: Props) {
  // Set page metadata
  usePageMetadata();

  return (
    <div>
      <AboutHeroSection />
      <ScrollReveal animation="fade-in-up">
        <AboutMeaningSection />
      </ScrollReveal>
      <ScrollReveal animation="fade-in-up">
        <StoryIntroSection />
      </ScrollReveal>
      <ScrollReveal animation="fade-in-left">
        <AboutStoryCardsSection />
      </ScrollReveal>
      <ScrollReveal animation="scale-in">
        <FeaturedProductsSection />
      </ScrollReveal>
    </div>
  );
}

export default AboutPage;

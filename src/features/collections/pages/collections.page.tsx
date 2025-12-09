import CollectionsHero from "../components/collections-hero.component";
import CollectionsFeaturedProducts from "../components/collections-featured-products.component";
import CollectionsProductsList from "../components/collections-products-list.component";
import ScrollReveal from "../../home/components/scroll-reveal.component";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

const CollectionsPage: React.FC = () => {
  // Set page metadata
  usePageMetadata();

  return (
    <div>
      <CollectionsHero />
      <ScrollReveal animation="fade-in-up">
        <CollectionsFeaturedProducts />
      </ScrollReveal>
      <ScrollReveal animation="fade-in-up" delay={100}>
        <CollectionsProductsList />
      </ScrollReveal>
    </div>
  );
};

export default CollectionsPage;

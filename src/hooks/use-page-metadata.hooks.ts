import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_METADATA } from "../constants/page-metadata.constants";

interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  useRouteMetadata?: boolean;
}

const usePageMetadata = (metadata: PageMetadata = {}) => {
  const location = useLocation();

  useEffect(() => {
    let finalTitle = metadata.title;
    let finalDescription = metadata.description;
    let finalKeywords = metadata.keywords;

    // Auto-detect metadata based on route if enabled or no explicit metadata provided
    if (
      metadata.useRouteMetadata ||
      (!metadata.title && !metadata.description)
    ) {
      const pathname = location.pathname;

      // Map routes to metadata
      if (pathname === "/" || pathname === "/home") {
        const routeMetadata = PAGE_METADATA.HOME;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname === "/about") {
        const routeMetadata = PAGE_METADATA.ABOUT;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname === "/collections") {
        const routeMetadata = PAGE_METADATA.COLLECTIONS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname === "/contact") {
        const routeMetadata = PAGE_METADATA.CONTACT;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname === "/policy") {
        const routeMetadata = PAGE_METADATA.POLICY;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname === "/login") {
        const routeMetadata = PAGE_METADATA.LOGIN;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname === "/dashboard") {
        const routeMetadata = PAGE_METADATA.DASHBOARD;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/users")) {
        const routeMetadata = PAGE_METADATA.USERS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (
        pathname.startsWith("/dashboard/products") &&
        !pathname.includes("categories") &&
        !pathname.includes("variants") &&
        !pathname.includes("customs")
      ) {
        const routeMetadata = PAGE_METADATA.PRODUCTS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/product-categories")) {
        const routeMetadata = PAGE_METADATA.PRODUCT_CATEGORIES;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/product-variants")) {
        const routeMetadata = PAGE_METADATA.PRODUCT_VARIANTS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/product-customs")) {
        const routeMetadata = PAGE_METADATA.PRODUCT_CUSTOMS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/collections")) {
        const routeMetadata = PAGE_METADATA.COLLECTIONS_MANAGE;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/promotions")) {
        const routeMetadata = PAGE_METADATA.PROMOTIONS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/feedbacks")) {
        const routeMetadata = PAGE_METADATA.FEEDBACKS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/inventory")) {
        const routeMetadata = PAGE_METADATA.INVENTORY;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/shipping-fees")) {
        const routeMetadata = PAGE_METADATA.SHIPPING_FEES;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/roles")) {
        const routeMetadata = PAGE_METADATA.ROLES;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else if (pathname.startsWith("/dashboard/backgrounds")) {
        const routeMetadata = PAGE_METADATA.BACKGROUNDS;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      } else {
        // Use default metadata for unknown routes
        const routeMetadata = PAGE_METADATA.DEFAULT;
        finalTitle = finalTitle || routeMetadata.title;
        finalDescription = finalDescription || routeMetadata.description;
        finalKeywords = finalKeywords || routeMetadata.keywords;
      }
    }

    // Update document title
    const fullTitle = finalTitle ? `${finalTitle} | Soligant` : "Soligant";
    document.title = fullTitle;

    // Update meta description
    if (finalDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", finalDescription);
    }

    // Update meta keywords
    if (finalKeywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", finalKeywords);
    }

    // Cleanup function to reset to default title when component unmounts
    return () => {
      document.title = "Soligant";
    };
  }, [
    metadata.title,
    metadata.description,
    metadata.keywords,
    metadata.useRouteMetadata,
    location.pathname,
  ]);

  // Return function to update metadata dynamically
  const updateMetadata = (newMetadata: Partial<PageMetadata>) => {
    if (newMetadata.title) {
      document.title = `${newMetadata.title} | Soligant`;
    }
    if (newMetadata.description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", newMetadata.description);
      }
    }
    if (newMetadata.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", newMetadata.keywords);
      }
    }
  };

  return { updateMetadata };
};

export default usePageMetadata;

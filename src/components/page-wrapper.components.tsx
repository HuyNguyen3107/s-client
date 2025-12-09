import type { ReactNode } from "react";
import usePageMetadata from "../hooks/use-page-metadata.hooks";

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  useRouteMetadata?: boolean;
}

const PageWrapper = ({
  children,
  title,
  description,
  keywords,
  useRouteMetadata = true,
}: PageWrapperProps) => {
  // Automatically set metadata based on props or route
  usePageMetadata({ title, description, keywords, useRouteMetadata });

  return <>{children}</>;
};

export default PageWrapper;

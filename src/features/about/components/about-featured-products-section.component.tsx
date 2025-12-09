import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./about-featured-products-section.module.scss";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { useProducts } from "../../products/queries";
import type { ProductWithRelations } from "../../products/types";
import { CircularProgress, Box, Skeleton } from "@mui/material";

function pickImage(product: ProductWithRelations) {
  // Prefer product background image, then collection image, then undefined
  const bg = product.backgrounds?.[0];
  if (bg?.imageUrl) return bg.imageUrl;
  if (product.collection?.imageUrl) return product.collection.imageUrl;
  return undefined;
}

const FeaturedProductsSection: React.FC = () => {
  const { data, isLoading, error } = useProducts({ page: 1, limit: 3 });
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  const products = data?.data || [];

  return (
    <section className={styles.featureSection}>
      <div className={styles.inner}>
        <h3 className={styles.quote}>
          <span className={styles.quoteText}>
            "Bạn chỉ cần nghĩ đến khoảnh khắc tặng quà"
          </span>
          <span className={styles.highlight}> Còn lại - để Soligant lo!</span>
        </h3>

        <div className={styles.tagsRow}>
          <button className={styles.tag}>#Tinhte</button>
          <button className={styles.tagOutline}>#Chanthanh</button>
          <button className={styles.tag}>#Chatluong</button>
        </div>

        {isLoading ? (
          <div className={styles.grid} aria-busy>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardImage}>
                  <Skeleton variant="rectangular" height={220} />
                </div>
                <div className={styles.cardContent}>
                  <Skeleton variant="text" height={28} width="70%" />
                </div>
                <div className={styles.cardAction}>
                  <Skeleton variant="rectangular" height={40} width={140} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Box
            sx={{
              textAlign: "center",
              color: "#7a2323",
              padding: "40px 20px",
            }}
          >
            <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          </Box>
        ) : (
          <div className={styles.grid}>
            {products.map((product: ProductWithRelations) => {
              const imageUrl = pickImage(product);
              const hasImageError = imageErrors[product.id];
              const displayImage =
                hasImageError || !imageUrl
                  ? "https://via.placeholder.com/400x280/7a2323/ffffff?text=Soligant+Product"
                  : imageUrl;

              return (
                <div key={product.id} className={styles.card}>
                  <div className={styles.cardImage}>
                    <img
                      src={displayImage}
                      alt={product.name}
                      onError={() => {
                        if (!hasImageError) {
                          setImageErrors((prev) => ({
                            ...prev,
                            [product.id]: true,
                          }));
                        }
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.productName}>
                      {product.collection?.name
                        ? `${product.collection.name} | ${product.name}`
                        : product.name}
                    </h4>
                  </div>
                  <div className={styles.cardAction}>
                    <Link
                      to={ROUTE_PATH.PRODUCT_ORDER.replace(":id", product.id)}
                      className={styles.cta}
                      aria-label={`Xem chi tiết sản phẩm ${product.name}`}
                    >
                      Xem ngay
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

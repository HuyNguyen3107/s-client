import styles from "./featured-products.module.scss";
import type { ProductWithRelations } from "../../products/types";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { Skeleton } from "@mui/material";
import { useHotCollections } from "../../collections/queries/collection.queries";
import { useQueries } from "@tanstack/react-query";
import { getProductsByCollection } from "../../products/services";
import { PRODUCT_QUERY_KEYS } from "../../products/queries/product.queries";

function pickImage(product: ProductWithRelations) {
  // Prefer product background image, then collection image, then undefined
  const bg = product.backgrounds?.[0];
  if (bg?.imageUrl) return bg.imageUrl;
  if (product.collection?.imageUrl) return product.collection.imageUrl;
  return undefined;
}

export default function FeaturedProducts() {
  const { data: hotCollections, isLoading: loadingHot, error: errorHot } =
    useHotCollections();
  const queries = useQueries({
    queries: (hotCollections || []).map((c) => ({
      queryKey: PRODUCT_QUERY_KEYS.BY_COLLECTION(c.id),
      queryFn: () => getProductsByCollection(c.id),
      enabled: !!c.id,
      staleTime: 5 * 60 * 1000,
    })),
  });
  const isLoading = loadingHot || queries.some((q) => q.isLoading);
  const error = errorHot || queries.find((q) => q.error)?.error;
  const merged = Array.from(
    new Map(
      queries
        .flatMap((q) => q.data || [])
        .map((p) => [p.id, p as ProductWithRelations])
    ).values()
  );
  const products = merged
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 3);

  return (
    <section
      className={styles["featured-root"]}
      aria-labelledby="featured-title"
    >
      <div className="site-inner">
        <h2
          id="featured-title"
          className={`${styles["featured-title"]} animate-fade-in-up`}
        >
          SẢN PHẨM NỔI BẬT
        </h2>

        <div className={styles["grid"]}>
          {isLoading && (
            <>
              {[0, 1, 2].map((i) => (
                <article key={i} className={styles["card"]}>
                  <div className={styles["card-media"]}>
                    <Skeleton variant="rectangular" height={220} />
                  </div>
                  <Skeleton variant="text" height={28} width="60%" />
                  <Skeleton variant="rectangular" height={40} width={140} />
                </article>
              ))}
            </>
          )}

          {error && (
            <p role="alert" aria-live="assertive">
              Không thể tải sản phẩm. Vui lòng thử lại sau.
            </p>
          )}

          {!isLoading && !error && products.length === 0 && (
            <p>Chưa có sản phẩm nổi bật</p>
          )}

          {products.map((p, index) => (
            <article
              key={p.id}
              className={`${styles["card"]} animate-fade-in-up delay-${
                (index + 1) * 100
              }`}
              style={{ opacity: 0 }}
            >
              <div className={styles["card-media"]}>
                {pickImage(p) ? (
                  <img
                    src={pickImage(p)}
                    alt={`${p.name} - Sản phẩm quà tặng cao cấp`}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="240"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label="Hình ảnh sản phẩm chưa có sẵn"
                    style={{
                      width: "100%",
                      height: 220,
                      background: "#f4f4f4",
                      borderRadius: 10,
                    }}
                  />
                )}
              </div>

              <h3 className={styles["card-title"]}>
                {p.collection?.name
                  ? `${p.collection.name} | ${p.name}`
                  : p.name}
              </h3>
              <Link
                className={styles["card-btn"]}
                to={ROUTE_PATH.PRODUCT_ORDER.replace(":id", p.id)}
                aria-label={`Xem chi tiết sản phẩm ${p.name}`}
              >
                XEM NGAY
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

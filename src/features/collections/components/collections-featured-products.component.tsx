import styles from "./collections-featured-products.module.scss";
import { useQueries } from "@tanstack/react-query";
import { useHotCollections } from "../../collections/queries/collection.queries";
import { getProductsByCollection } from "../../products/services";
import { PRODUCT_QUERY_KEYS } from "../../products/queries/product.queries";
import type { ProductWithRelations } from "../../products/types";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { useMemo } from "react";
import { Skeleton } from "@mui/material";

function pickImage(product: ProductWithRelations) {
  const bg = product.backgrounds?.[0];
  if (bg?.imageUrl) return bg.imageUrl;
  if (product.collection?.imageUrl) return product.collection.imageUrl;
  return undefined;
}

export default function CollectionsFeaturedProducts() {
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
  const products: ProductWithRelations[] = useMemo(() => {
    const merged = Array.from(
      new Map(
        queries
          .flatMap((q) => q.data || [])
          .map((p) => [p.id, p as ProductWithRelations])
      ).values()
    );
    return merged.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }, [queries]);

  return (
    <section className={styles["featured-root"]}>
      <div className="site-inner">
        <h2 className={styles["featured-title"]}>SẢN PHẨM TỪ BỘ SƯU TẬP HOT</h2>

        <div className={styles["grid"]}>
          {isLoading && (
            <>
              {[0, 1, 2].map((i) => (
                <article key={i} className={styles["card"]}>
                  <div className={styles["card-media"]}>
                    <Skeleton variant="rectangular" height={220} />
                  </div>
                  <Skeleton variant="text" height={28} width="60%" />
                  <Skeleton variant="rectangular" height={40} width={120} />
                </article>
              ))}
            </>
          )}
          {error && <p>Không thể tải sản phẩm.</p>}

          {!isLoading &&
            !error &&
            products.map((p) => (
              <article key={p.id} className={styles["card"]}>
                <div className={styles["card-media"]}>
                  {pickImage(p) ? (
                    <img
                      src={pickImage(p)}
                      alt={`${p.collection?.name ? p.collection.name + " | " : ""}${p.name}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles["placeholder"]} />
                  )}
                  {p.collection?.name && (
                    <span className={styles["badge"]}>{p.collection.name}</span>
                  )}
                </div>
                <div className={styles["card-content"]}>
                  <h3 className={styles["card-title"]}>
                    {p.collection?.name ? `${p.collection.name} | ${p.name}` : p.name}
                  </h3>
                  <p className={styles["card-sub"]}>{p.collection?.name || ""}</p>
                  <Link
                    className={styles["card-btn"]}
                    to={ROUTE_PATH.PRODUCT_ORDER.replace(":id", p.id)}
                    aria-label={`Xem sản phẩm ${p.name}`}
                  >
                    XEM NGAY
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

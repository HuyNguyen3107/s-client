import styles from "./collections-products-list.module.scss";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { useInfiniteProducts } from "../../products/queries/product.queries";
import { useEffect, useRef } from "react";
import type { ProductWithRelations } from "../../products/types";
import { Skeleton } from "@mui/material";

function pickImage(product: ProductWithRelations) {
  const bg = product.backgrounds?.[0];
  if (bg?.imageUrl) return bg.imageUrl;
  if (product.collection?.imageUrl) return product.collection.imageUrl;
  return undefined;
}

export default function CollectionsProductsList() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({ limit: 12, sortBy: "createdAt", sortOrder: "desc" });
  const items = (data?.pages || []).flatMap((p) => p.data || []);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className={styles["products-list-root"]} id="collections-list">
      <div className="site-inner">
        <h2 className={styles.heading}>QUÀ TẶNG CHO MỌI DỊP</h2>
        <p className={styles.lead}>
          Món quà này được tạo ra chỉ dành riêng cho bạn - không ai khác trên
          thế giới có món giống vậy. <br />
          Cá nhân hóa bằng yêu thương, để chứa đựng câu chuyện của chính bạn.
        </p>
        

        <div className={styles.grid}>
          {isLoading && (
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <article key={i} className={styles.card}>
                  <div className={styles["card-media"]}>
                    <Skeleton variant="rectangular" height={260} />
                  </div>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={22} width="40%" />
                  <Skeleton variant="rectangular" height={40} width={140} />
                </article>
              ))}
            </>
          )}
          {error && <p>Không thể tải sản phẩm.</p>}

          {!isLoading &&
            !error &&
            items.map((it) => (
              <article key={it.id} className={styles.card}>
                <div className={styles["card-media"]}>
                  {pickImage(it) ? (
                    <img src={pickImage(it)} alt={it.name} loading="lazy" decoding="async" />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 180,
                        background: "#f4f4f4",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </div>
                <h3 className={styles.title}>
                  {it.collection?.name
                    ? `${it.collection.name} | ${it.name}`
                    : it.name}
                </h3>
                <p className={styles.sub}>{it.collection?.name || ""}</p>
                <Link
                  to={ROUTE_PATH.PRODUCT_ORDER.replace(":id", it.id)}
                  className={styles.buy}
                >
                  MUA NGAY
                </Link>
              </article>
            ))}
        </div>
        <div ref={loadMoreRef} aria-hidden="true" style={{ height: 1 }} />
        {isFetchingNextPage && (
          <div className={styles.grid}>
            {[0, 1, 2].map((i) => (
              <article key={`loading-${i}`} className={styles.card}>
                <div className={styles["card-media"]}>
                  <Skeleton variant="rectangular" height={260} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

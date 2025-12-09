import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../queries/product-order.queries";
import type { ProductVariant } from "../../products/types";
import styles from "./product-order.module.scss";

function pickImage(product: any) {
  // Prefer product background image, then collection image, then undefined
  const bg = product.backgrounds?.[0];
  if (bg?.imageUrl) return bg.imageUrl;
  if (product.collection?.imageUrl) return product.collection.imageUrl;
  return undefined;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function ProductOrderPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = (params as { id?: string }).id || "";
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const { data: product, isLoading, error } = useProduct(id, Boolean(id));

  // Auto-select first variant when product loads
  if (product && product.productVariants?.length > 0 && !selectedVariant) {
    setSelectedVariant(product.productVariants[0]);
  }

  if (!id) {
    return (
      <div className={styles.errorState}>
        <div className="site-inner">
          <p>Không có sản phẩm được chọn.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className="site-inner">
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className="site-inner">
          <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorState}>
        <div className="site-inner">
          <p>Không tìm thấy sản phẩm.</p>
        </div>
      </div>
    );
  }

  const handleSelectVariant = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn phiên bản sản phẩm.");
      return;
    }
    // Navigate to product customize page with selected variant
    navigate(
      `/product-customize?productId=${id}&variantId=${selectedVariant.id}`
    );
  };

  return (
    <div className={styles.productOrderPage}>
      <div className="site-inner">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span>Trang chủ</span>
          <span className={styles.separator}>›</span>
          <span>{product.collection?.name}</span>
          <span className={styles.separator}>›</span>
          <span className={styles.current}>{product.name}</span>
        </div>

        <div className={styles.productContent}>
          {/* Product Image */}
          <div className={styles.productImage}>
            {pickImage(product) ? (
              <img
                src={pickImage(product)}
                alt={product.name}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.placeholderImage}>
                <span>Chưa có hình ảnh</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <div className={styles.collectionBadge}>
                {product.collection?.name}
              </div>
            </div>

            {/* Price Display */}
            {selectedVariant && (
              <div className={styles.priceSection}>
                <div className={styles.currentPrice}>
                  {formatPrice(selectedVariant.price)}
                </div>
              </div>
            )}

            {/* Product Description */}
            {selectedVariant?.description && (
              <div className={styles.description}>
                <h3>Mô tả sản phẩm</h3>
                <p>{selectedVariant.description}</p>
              </div>
            )}

            {/* Variant Selection */}
            {product.productVariants && product.productVariants.length > 0 && (
              <div className={styles.variantSection}>
                <h3>Chọn phiên bản</h3>
                <div className={styles.variantGrid}>
                  {product.productVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`${styles.variantCard} ${
                        selectedVariant?.id === variant.id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className={styles.variantName}>{variant.name}</div>
                      <div className={styles.variantPrice}>
                        {formatPrice(variant.price)}
                      </div>
                      {variant.description && (
                        <div className={styles.variantDescription}>
                          {variant.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Select Variant Button */}
            <div className={styles.actionSection}>
              <button
                className={styles.addToCartBtn}
                onClick={handleSelectVariant}
                disabled={!selectedVariant}
              >
                {selectedVariant
                  ? `Tùy chỉnh ngay - ${formatPrice(selectedVariant.price)}`
                  : "Chọn phiên bản để tiếp tục"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

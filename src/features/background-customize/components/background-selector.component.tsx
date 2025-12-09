import { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import type { Background } from "../types/background.types";
import styles from "./background-selector.module.scss";

interface BackgroundSelectorProps {
  backgrounds: Background[];
  selectedBackgroundIds: string[];
  onBackgroundSelect: (backgroundId: string) => void;
  onBackgroundDeselect: (backgroundId: string) => void;
  loading?: boolean;
  maxSelections?: number;
}

export default function BackgroundSelector({
  backgrounds,
  selectedBackgroundIds,
  onBackgroundSelect,
  onBackgroundDeselect,
  loading = false,
  maxSelections = 1,
}: BackgroundSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Get unique categories from backgrounds (use product collection name as category)
  const categories = Array.from(
    new Set(
      backgrounds
        .map((bg) => bg.product?.collection?.name || bg.category)
        .filter(Boolean)
    )
  );

  // Filter backgrounds based on search and category
  const filteredBackgrounds = backgrounds.filter((background) => {
    const matchesSearch = searchTerm
      ? background.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        background.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const backgroundCategory =
      background.product?.collection?.name || background.category;
    const matchesCategory = selectedCategory
      ? backgroundCategory === selectedCategory
      : true;

    // Only filter by status if it exists, otherwise assume active
    const isActive = background.status ? background.status === "active" : true;

    return matchesSearch && matchesCategory && isActive;
  });

  const handleBackgroundClick = (backgroundId: string) => {
    if (selectedBackgroundIds.includes(backgroundId)) {
      onBackgroundDeselect(backgroundId);
    } else if (maxSelections === 1) {
      // For single selection, deselect previous and select new
      if (selectedBackgroundIds.length > 0) {
        onBackgroundDeselect(selectedBackgroundIds[0]);
      }
      onBackgroundSelect(backgroundId);
    } else if (selectedBackgroundIds.length < maxSelections) {
      onBackgroundSelect(backgroundId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải background...</p>
      </div>
    );
  }

  return (
    <div className={styles.backgroundSelector}>
      {/* Search and Filter */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm background..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className={styles.clearBtn}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className={styles.categoryFilter}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selection Info */}
      {maxSelections > 1 && (
        <div className={styles.selectionInfo}>
          Đã chọn {selectedBackgroundIds.length}/{maxSelections} background
        </div>
      )}

      {/* Background Grid */}
      <div className={styles.backgroundGrid}>
        {filteredBackgrounds.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Không tìm thấy background phù hợp</p>
          </div>
        ) : (
          filteredBackgrounds.map((background) => {
            const isSelected = selectedBackgroundIds.includes(background.id);
            const isDisabled =
              !isSelected && selectedBackgroundIds.length >= maxSelections;

            return (
              <div
                key={background.id}
                className={`${styles.backgroundCard} ${
                  isSelected ? styles.selected : ""
                } ${isDisabled ? styles.disabled : ""}`}
                onClick={() =>
                  !isDisabled && handleBackgroundClick(background.id)
                }
              >
                <div className={styles.backgroundImage}>
                  <img
                    src={background.thumbnailUrl || background.imageUrl}
                    alt={background.name}
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className={styles.selectedOverlay}>
                      <div className={styles.selectedIcon}>✓</div>
                    </div>
                  )}
                </div>

                <div className={styles.backgroundInfo}>
                  <h4 className={styles.backgroundName}>{background.name}</h4>
                  {background.price && background.price > 0 ? (
                    <p className={styles.backgroundPrice}>
                      {formatPrice(background.price)}
                    </p>
                  ) : (
                    <p className={styles.freePrice}>Miễn phí</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

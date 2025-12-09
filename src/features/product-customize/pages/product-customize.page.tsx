import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaGift,
  FaPlus,
  FaMinus,
  FaCheck,
  FaTimes,
  FaShoppingCart,
  FaPalette,
  FaClock,
  FaEye,
} from "react-icons/fa";
import { useProduct } from "../queries/product-customize.queries";
import {
  productCustomsService,
  checkProductHasBackground,
} from "../../product-variants/services/product-customs.service";
import type { ProductCustom } from "../../product-variants/services/product-customs.service";
import styles from "./product-customize.module.scss";

// Interface for product category

// Types for config data
interface ConfigItem {
  id: string;
  name: string;
  isActive: boolean;
  priority: number;
  isRequired: boolean;
  priceRules: Array<{
    id: string;
    condition: string;
    description: string;
    minQuantity: number;
    pricePerUnit: number;
  }>;
  baseQuantity: number;
  categoryRules: any[];
}

interface VariantCategoryRule {
  id: string;
  categoryId: string;
  isRequired: boolean;
  categoryName: string;
  maxSelections: number;
}

interface ConfigData {
  items: ConfigItem[];
  maxCustomQuantity: number;
  minCustomQuantity: number;
  allowCustomQuantity: boolean;
  globalCategoryRules: any[];
  variantCategoryRules: VariantCategoryRule[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Helper function to check product availability
function getProductAvailability(product: ProductCustom) {
  if (!product.inventories || product.inventories.length === 0) {
    return {
      available: false,
      stock: 0,
      message: "Sản phẩm hiện không có thông tin tồn kho",
    };
  }

  // Sum up available stock from all inventory records
  const totalStock = product.inventories.reduce((total, inventory) => {
    const currentStock = inventory.currentStock || 0;
    const reservedStock = inventory.reservedStock || 0;
    const availableStock = currentStock - reservedStock;
    return total + Math.max(0, availableStock);
  }, 0);

  return {
    available: totalStock > 0,
    stock: totalStock,
    message:
      totalStock > 0
        ? `Còn ${totalStock} sản phẩm trong kho`
        : "Sản phẩm tạm hết hàng",
  };
}

// Helper function to check if product can be selected with given quantity
function canSelectProduct(
  product: ProductCustom,
  requestedQuantity: number = 1
) {
  const availability = getProductAvailability(product);
  return {
    ...availability,
    canSelect:
      availability.available && availability.stock >= requestedQuantity,
    message: availability.available
      ? availability.stock >= requestedQuantity
        ? availability.message
        : `Chỉ còn ${availability.stock} sản phẩm, không đủ cho số lượng yêu cầu (${requestedQuantity})`
      : availability.message,
  };
}

// Component to check and display endow products availability
function EndowAvailabilityChecker({ endowData }: { endowData: any }) {
  const [unavailableProducts, setUnavailableProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEndowProductsAvailability = async () => {
      if (!endowData.customProducts || endowData.customProducts.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const unavailableList: string[] = [];

        for (const cp of endowData.customProducts) {
          const product = await productCustomsService.getProductCustomById(
            cp.productCustomId
          );
          const availability = canSelectProduct(product, cp.quantity);

          if (!availability.canSelect) {
            unavailableList.push(`${product.name} (${availability.message})`);
          }
        }

        setUnavailableProducts(unavailableList);
      } catch (error) {
        console.error("Failed to check endow products availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEndowProductsAvailability();
  }, [endowData.customProducts]);

  if (isLoading) {
    return null;
  }

  if (unavailableProducts.length === 0) {
    return null;
  }

  return (
    <div className={styles.endowAvailabilityWarning}>
      <div className={styles.warningHeader}>
        <FaTimes className={styles.warningIcon} />
        <span>Một số sản phẩm ưu đãi hiện không có sẵn:</span>
      </div>
      <ul className={styles.unavailableList}>
        {unavailableProducts.map((productInfo, index) => (
          <li key={index}>{productInfo}</li>
        ))}
      </ul>
    </div>
  );
}

// Component to display custom product info
function CustomProductItem({ productCustomId }: { productCustomId: string }) {
  const [productCustom, setProductCustom] = useState<ProductCustom | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductCustom = async () => {
      try {
        const data = await productCustomsService.getProductCustomById(
          productCustomId
        );
        setProductCustom(data);
      } catch (error) {
        console.error(
          `Failed to fetch product custom ${productCustomId}:`,
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductCustom();
  }, [productCustomId]);

  if (isLoading) {
    return <span>Đang tải thông tin sản phẩm...</span>;
  }

  if (!productCustom) {
    return <span>Sản phẩm ID: {productCustomId}</span>;
  }

  const availability = getProductAvailability(productCustom);

  return (
    <div className={styles.customProductInfo}>
      {productCustom.imageUrl && (
        <img
          src={productCustom.imageUrl}
          alt={productCustom.name}
          className={styles.customProductImage}
        />
      )}
      <div className={styles.customProductDetails}>
        <span className={styles.customProductName}>{productCustom.name}</span>
        {productCustom.price && (
          <span className={styles.customProductPrice}>
            ({formatPrice(parseInt(productCustom.price) || 0)})
          </span>
        )}
        {/* Show inventory warning for endow products */}
        {!availability.available && (
          <span className={styles.endowOutOfStock}>
            ⚠️ Sản phẩm tạm hết hàng
          </span>
        )}
      </div>
    </div>
  );
}

// Helper function to parse and display endow items and custom products
function parseEndowData(endow: any): {
  items: string[];
  customProducts: Array<{ productCustomId: string; quantity: number }>;
} {
  if (!endow || typeof endow !== "object") {
    return { items: [], customProducts: [] };
  }

  const items: string[] = [];
  const customProducts: Array<{ productCustomId: string; quantity: number }> =
    [];

  // Handle items array - only show content
  if (endow.items && Array.isArray(endow.items)) {
    endow.items.forEach((item: any) => {
      if (item && typeof item === "object" && item.content) {
        items.push(item.content);
      }
    });
  }

  // Handle customProducts array - extract productCustomId
  if (endow.customProducts && Array.isArray(endow.customProducts)) {
    endow.customProducts.forEach((cp: any) => {
      if (cp && cp.productCustomId) {
        customProducts.push({
          productCustomId: cp.productCustomId,
          quantity: cp.quantity || 1,
        });
      }
    });
  }

  return { items, customProducts };
}

// Helper function to parse and display option data (add-on options)
function parseOptionData(option: any) {
  if (typeof option === "string") {
    return [{ name: "Tùy chọn", description: option, price: 0 }];
  }

  if (typeof option === "object" && option) {
    const results: Array<{ name: string; description: string; price: number }> =
      [];

    // Handle purchaseOptions structure
    if (option.purchaseOptions) {
      const purchaseOptions = option.purchaseOptions;

      // Handle array of purchase options
      if (Array.isArray(purchaseOptions)) {
        purchaseOptions.forEach((item: any, index: number) => {
          if (typeof item === "object") {
            results.push({
              name: item.name || item.title || `Tùy chọn ${index + 1}`,
              description: item.content || item.description || item.desc || "",
              price: item.price || item.additionalPrice || item.cost || 0,
            });
          } else {
            results.push({
              name: `Tùy chọn ${index + 1}`,
              description: String(item),
              price: 0,
            });
          }
        });
      } else if (typeof purchaseOptions === "object") {
        // Handle object with multiple options
        Object.entries(purchaseOptions).forEach(
          ([key, value]: [string, any]) => {
            if (typeof value === "object") {
              results.push({
                name: value.name || value.title || key,
                description:
                  value.content || value.description || value.desc || "",
                price: value.price || value.additionalPrice || value.cost || 0,
              });
            } else {
              results.push({
                name: key,
                description: String(value),
                price: 0,
              });
            }
          }
        );
      }
    }

    // Handle array of options (fallback)
    if (Array.isArray(option) && results.length === 0) {
      option.forEach((item, index) => {
        if (typeof item === "object") {
          results.push({
            name: item.name || `Tùy chọn ${index + 1}`,
            description: item.content || item.description || item.desc || "",
            price: item.price || item.additionalPrice || 0,
          });
        } else {
          results.push({
            name: `Tùy chọn ${index + 1}`,
            description: String(item),
            price: 0,
          });
        }
      });
    } else if (results.length === 0) {
      // Handle single option object (fallback)
      if (option.options && Array.isArray(option.options)) {
        option.options.forEach((item: any, index: number) => {
          results.push({
            name: item.name || `Tùy chọn ${index + 1}`,
            description: item.content || item.description || item.desc || "",
            price: item.price || item.additionalPrice || 0,
          });
        });
      } else {
        // Handle direct object properties (fallback)
        Object.entries(option).forEach(([key, value]: [string, any]) => {
          if (typeof value === "object" && value.name) {
            results.push({
              name: value.name || key,
              description:
                value.content || value.description || value.desc || "",
              price: value.price || value.additionalPrice || 0,
            });
          } else {
            results.push({
              name: key,
              description: String(value),
              price: 0,
            });
          }
        });
      }
    }

    return results;
  }

  return [];
}

// Helper function to calculate price based on quantity and price rules
function calculateItemPrice(
  quantity: number,
  priceRules: ConfigItem["priceRules"]
): number {
  if (!priceRules || priceRules.length === 0) return 0;

  // Find applicable price rule based on quantity
  const applicableRule = priceRules
    .filter((rule) => {
      if (rule.condition === "greater_than") {
        return quantity > rule.minQuantity;
      } else if (rule.condition === "greater_than_or_equal") {
        return quantity >= rule.minQuantity;
      }
      return false;
    })
    .sort((a, b) => b.minQuantity - a.minQuantity)[0]; // Get the highest applicable rule

  return applicableRule ? applicableRule.pricePerUnit * quantity : 0;
}

// Component for quantity selector
function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 100,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className={styles.quantitySelector}>
      <label className={styles.quantityLabel}>{label}</label>
      <div className={styles.quantityControls}>
        <button
          type="button"
          className={styles.quantityBtn}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <FaMinus />
        </button>
        <span className={styles.quantityValue}>{value}</span>
        <button
          type="button"
          className={styles.quantityBtn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

// Multi-Item Selector Component - for products with multiple items (e.g., multiple LEGO figures)
function MultiItemSelector({
  numberOfItems,
  selectedItem,
  onItemSelect,
  variantName,
}: {
  numberOfItems: number;
  selectedItem: number;
  onItemSelect: (itemIndex: number) => void;
  variantName: string;
}) {
  if (numberOfItems <= 1) return null;

  return (
    <div className={styles.multiItemSelector}>
      <h3 className={styles.multiItemTitle}>Chọn {variantName} để tùy chỉnh</h3>
      <p className={styles.multiItemDescription}>
        Bạn có {numberOfItems} {variantName.toLowerCase()}. Vui lòng chọn từng
        cái để tùy chỉnh riêng.
      </p>
      <div className={styles.itemTabs}>
        {Array.from({ length: numberOfItems }, (_, index) => {
          const itemIndex = index + 1;
          return (
            <button
              key={itemIndex}
              className={`${styles.itemTab} ${
                selectedItem === itemIndex ? styles.active : ""
              }`}
              onClick={() => onItemSelect(itemIndex)}
            >
              <div className={styles.itemTabContent}>
                <span className={styles.itemNumber}>{itemIndex}</span>
                <span className={styles.itemLabel}>
                  {variantName} {itemIndex}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Tabs-based Category Selector Component - uses real server data with search and pagination
function TabsCategoriesSelector({
  variantCategoryRules = [],
  selectedCategoryProducts,
  onProductChange,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  itemsPerPage,
  currentItemIndex = 1,
  isMultiItem = false,
}: {
  variantCategoryRules: VariantCategoryRule[];
  selectedCategoryProducts: Record<
    string,
    Array<{ productCustomId: string; quantity: number }>
  >;
  onProductChange: (
    categoryId: string,
    productCustomId: string,
    selected: boolean
  ) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: Record<string, number>;
  onPageChange: (categoryId: string, page: number) => void;
  itemsPerPage: number;
  currentItemIndex?: number;
  isMultiItem?: boolean;
}) {
  const [categories, setCategories] = useState<Record<string, ProductCustom[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const fetchRealCategories = async () => {
      try {
        // Fetch all products from server
        const response = await productCustomsService.getProductCustoms({
          status: "active",
          limit: 100, // Get more products to have enough data
        });

        const products = response.data || [];

        // Group products by their actual category from server
        const groupedCategories: Record<string, ProductCustom[]> = {};
        const names: Record<string, string> = {};

        products.forEach((product) => {
          if (product.productCategory) {
            const categoryId = product.productCategory.id;
            const categoryName = product.productCategory.name;

            if (!groupedCategories[categoryId]) {
              groupedCategories[categoryId] = [];
            }

            groupedCategories[categoryId].push(product);
            names[categoryId] = categoryName;
          }
        });

        setCategories(groupedCategories);
        setCategoryNames(names);

        // Set first category as active tab
        const firstCategoryId = Object.keys(groupedCategories)[0];
        if (firstCategoryId) {
          setActiveTab(firstCategoryId);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.categoriesLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải danh sách sản phẩm tùy chỉnh...</p>
      </div>
    );
  }

  const categoryIds = Object.keys(categories);

  if (categoryIds.length === 0) {
    return (
      <div className={styles.noCategories}>
        <FaGift className={styles.noCategoriesIcon} />
        <p>Chưa có sản phẩm tùy chỉnh nào được phân loại.</p>
      </div>
    );
  }

  // Check if there are any out of stock products
  const outOfStockCount = Object.values(categories)
    .flat()
    .filter((product) => {
      const availability = getProductAvailability(product);
      return !availability.available;
    }).length;

  return (
    <div className={styles.modernCustomizationContainer}>
      {isMultiItem && (
        <div className={styles.multiItemIndicator}>
          <span className={styles.currentItemBadge}>
            Đang tùy chỉnh: Item {currentItemIndex}
          </span>
        </div>
      )}

      <div className={styles.customizationHeader}>
        <h3 className={styles.sectionTitle}>
          {isMultiItem
            ? `Tùy chỉnh cho Item ${currentItemIndex}`
            : "Chọn Sản Phẩm Tùy Chỉnh"}
        </h3>
        <p className={styles.sectionDescription}>
          Chọn từ các danh mục sản phẩm tùy chỉnh có sẵn. Những mục có dấu * là
          bắt buộc phải chọn.
        </p>
      </div>

      {/* Out of stock warning */}
      {outOfStockCount > 0 && (
        <div className={styles.stockWarning}>
          <FaTimes className={styles.warningIcon} />
          <span>
            Có {outOfStockCount} sản phẩm tạm hết hàng. Những sản phẩm này sẽ
            được đánh dấu và không thể chọn.
          </span>
        </div>
      )}

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {categoryIds.map((categoryId) => {
          const categoryRule = variantCategoryRules.find(
            (rule) => rule.categoryId === categoryId
          );
          const isRequired = categoryRule?.isRequired || false;
          const selectedProducts = selectedCategoryProducts[categoryId] || [];
          const selectedCount = selectedProducts.length;
          const maxSelections = categoryRule?.maxSelections || 999;

          return (
            <button
              key={categoryId}
              className={`${styles.categoryTab} ${
                activeTab === categoryId ? styles.active : ""
              } ${isRequired ? styles.required : styles.optional}`}
              onClick={() => setActiveTab(categoryId)}
            >
              <div className={styles.tabContent}>
                <span className={styles.tabName}>
                  {categoryNames[categoryId]}
                  {isRequired && <FaCheck className={styles.requiredIcon} />}
                </span>
                <span className={styles.tabBadge}>
                  {selectedCount}/{maxSelections}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Content */}
      {activeTab && (
        <div className={styles.activeTabContent}>
          {(() => {
            const categoryRule = variantCategoryRules.find(
              (rule) => rule.categoryId === activeTab
            );
            const isRequired = categoryRule?.isRequired || false;
            const maxSelections = categoryRule?.maxSelections || 999;
            const selectedProducts = selectedCategoryProducts[activeTab] || [];
            const selectedCount = selectedProducts.length;

            // Filter products based on search term
            const allProducts = categories[activeTab] || [];
            const filteredProducts = allProducts.filter(
              (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description &&
                  product.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            );

            // Pagination
            const currentPageForCategory = currentPage[activeTab] || 1;
            const startIndex = (currentPageForCategory - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedProducts = filteredProducts.slice(
              startIndex,
              endIndex
            );
            const totalPages = Math.ceil(
              filteredProducts.length / itemsPerPage
            );

            return (
              <>
                {/* Category Info */}
                <div className={styles.categoryInfo}>
                  <h4 className={styles.categoryName}>
                    {categoryNames[activeTab]}
                    {isRequired && (
                      <span className={styles.requiredLabel}>(Bắt buộc)</span>
                    )}
                  </h4>
                  <p className={styles.categoryDescription}>
                    {isRequired
                      ? `Bạn cần chọn ít nhất 1 sản phẩm từ danh mục này (tối đa ${maxSelections} sản phẩm)`
                      : `Tùy chọn - có thể chọn tối đa ${maxSelections} sản phẩm từ danh mục này`}
                  </p>
                  {selectedCount > 0 && (
                    <div className={styles.selectionSummary}>
                      <FaCheck /> Đã chọn {selectedCount} sản phẩm:{" "}
                      {selectedProducts
                        .map((p) => {
                          const product = categories[activeTab]?.find(
                            (prod) => prod.id === p.productCustomId
                          );
                          return product?.name || "Sản phẩm";
                        })
                        .join(", ")}
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder={`Tìm kiếm trong ${categoryNames[activeTab]}...`}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                  />
                  <div className={styles.searchStats}>
                    Hiển thị {paginatedProducts.length} /{" "}
                    {filteredProducts.length} sản phẩm
                  </div>
                </div>

                {/* Products Grid */}
                <div className={styles.tabProductsGrid}>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => {
                      const isSelected = selectedProducts.some(
                        (p) => p.productCustomId === product.id
                      );
                      const canSelectByLimit =
                        !isSelected && selectedCount < maxSelections;
                      const availability = canSelectProduct(product, 1);
                      const canSelect =
                        canSelectByLimit && availability.canSelect;

                      return (
                        <div
                          key={product.id}
                          className={`${styles.tabProductCard} ${
                            isSelected ? styles.selected : ""
                          } ${
                            !canSelect && !isSelected ? styles.disabled : ""
                          }`}
                          onClick={() => {
                            if (isSelected || canSelect) {
                              onProductChange(
                                activeTab,
                                product.id,
                                !isSelected
                              );
                            }
                          }}
                          title={
                            !availability.canSelect ? availability.message : ""
                          }
                        >
                          <div className={styles.productImageContainer}>
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className={styles.productImage}
                              />
                            ) : (
                              <div className={styles.noImage}>
                                <FaGift />
                              </div>
                            )}

                            <div className={styles.productOverlay}>
                              <div
                                className={`${styles.selectionIndicator} ${
                                  isSelected ? styles.selected : ""
                                }`}
                              >
                                {isSelected ? <FaCheck /> : <FaPlus />}
                              </div>
                            </div>
                          </div>

                          <div className={styles.productDetails}>
                            <h5 className={styles.productName}>
                              {product.name}
                            </h5>
                            <p className={styles.productPrice}>
                              {formatPrice(parseInt(product.price) || 0)}
                            </p>

                            {/* Stock Status Display */}
                            <div className={styles.stockStatus}>
                              {availability.available ? (
                                <span
                                  className={`${styles.stockBadge} ${styles.inStock}`}
                                >
                                  ✓ Còn hàng ({availability.stock})
                                </span>
                              ) : (
                                <span
                                  className={`${styles.stockBadge} ${styles.outOfStock}`}
                                >
                                  ✗ Hết hàng
                                </span>
                              )}
                            </div>

                            {product.description && (
                              <p className={styles.productDescription}>
                                {product.description.length > 60
                                  ? product.description.substring(0, 60) + "..."
                                  : product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.noResults}>
                      <p>
                        Không tìm thấy sản phẩm phù hợp với từ khóa "
                        {searchTerm}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={`${styles.paginationBtn} ${
                        currentPageForCategory <= 1 ? styles.disabled : ""
                      }`}
                      onClick={() =>
                        onPageChange(activeTab, currentPageForCategory - 1)
                      }
                      disabled={currentPageForCategory <= 1}
                    >
                      ← Trước
                    </button>

                    <div className={styles.paginationInfo}>
                      <span>
                        Trang {currentPageForCategory} / {totalPages}
                      </span>
                    </div>

                    <button
                      className={`${styles.paginationBtn} ${
                        currentPageForCategory >= totalPages
                          ? styles.disabled
                          : ""
                      }`}
                      onClick={() =>
                        onPageChange(activeTab, currentPageForCategory + 1)
                      }
                      disabled={currentPageForCategory >= totalPages}
                    >
                      Tiếp →
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function ProductCustomizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("productId") || "";
  const variantId = searchParams.get("variantId") || "";

  const {
    data: product,
    isLoading,
    error,
  } = useProduct(productId, Boolean(productId));

  const selectedVariant = product?.productVariants?.find(
    (v) => v.id === variantId
  );

  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<
    Array<{ id: string; price: number }>
  >([]);

  // State for customization
  const [customQuantities, setCustomQuantities] = useState<
    Record<string, number>
  >({});
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<
    Record<string, Array<{ productCustomId: string; quantity: number }>>
  >({});
  // State for custom products prices and details
  const [customProductsPrices, setCustomProductsPrices] = useState<
    Record<string, number>
  >({});
  const [customProductsDetails, setCustomProductsDetails] = useState<
    Record<string, ProductCustom>
  >({});

  // State for validation and UI improvements
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [itemsPerPage] = useState(8);

  // State for multi-item customization (e.g., multiple LEGO figures)
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<number>(1);
  const [multiItemCustomizations, setMultiItemCustomizations] = useState<
    Record<
      number,
      Record<string, Array<{ productCustomId: string; quantity: number }>>
    >
  >({});

  // State for background capability detection
  const [hasBackground, setHasBackground] = useState<boolean>(false);
  const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);

  // Extract base quantity from config to determine number of items to customize
  const getNumberOfItems = () => {
    if (selectedVariant?.config && typeof selectedVariant.config === "object") {
      const config = selectedVariant.config as ConfigData;
      if (config.items && config.items.length > 0) {
        const mainItem = config.items.find((item) => item.isActive);
        if (mainItem) {
          const currentQuantity =
            customQuantities[mainItem.id] || mainItem.baseQuantity;
          return Math.max(1, currentQuantity);
        }
      }
    }
    return 1;
  };

  const numberOfItems = getNumberOfItems();

  // Function to calculate category products total price
  const calculateCategoryProductsPrice = () => {
    let total = 0;
    Object.values(selectedCategoryProducts)
      .flat()
      .forEach((selection) => {
        const productPrice =
          customProductsPrices[selection.productCustomId] || 0;
        total += productPrice * selection.quantity;
      });
    return total;
  };

  // Effect to fetch prices and details when selected products change
  useEffect(() => {
    const fetchCustomProductsData = async () => {
      const allSelectedProducts = Object.values(
        selectedCategoryProducts
      ).flat();
      const uniqueProductIds = [
        ...new Set(allSelectedProducts.map((p) => p.productCustomId)),
      ];

      // Only fetch data for products we don't have yet
      const missingDataIds = uniqueProductIds.filter(
        (id) => !(id in customProductsPrices)
      );

      if (missingDataIds.length > 0) {
        const dataPromises = missingDataIds.map(async (productId) => {
          try {
            const product = await productCustomsService.getProductCustomById(
              productId
            );
            return {
              id: productId,
              price: parseInt(product.price) || 0,
              product: product,
            };
          } catch (error) {
            console.error(
              `Failed to fetch data for product ${productId}:`,
              error
            );
            return {
              id: productId,
              price: 0,
              product: null,
            };
          }
        });

        const results = await Promise.all(dataPromises);

        // Update both prices and details
        const pricesMap = results.reduce((acc, { id, price }) => {
          acc[id] = price;
          return acc;
        }, {} as Record<string, number>);

        const detailsMap = results.reduce((acc, { id, product }) => {
          if (product) {
            acc[id] = product;
          }
          return acc;
        }, {} as Record<string, ProductCustom>);

        setCustomProductsPrices((prev) => ({ ...prev, ...pricesMap }));
        setCustomProductsDetails((prev) => ({ ...prev, ...detailsMap }));
      }
    };

    fetchCustomProductsData();
  }, [selectedCategoryProducts, customProductsPrices]);

  // Effect to check background capability when product changes
  useEffect(() => {
    const checkBackgroundCapability = async () => {
      if (product?.id) {
        setBackgroundLoading(true);
        try {
          const backgroundCapability = await checkProductHasBackground(
            product.id
          );
          setHasBackground(backgroundCapability);
        } catch (error) {
          console.error("Failed to check background capability:", error);
          setHasBackground(false);
        } finally {
          setBackgroundLoading(false);
        }
      }
    };

    checkBackgroundCapability();
  }, [product?.id]);

  // Calculate customization price based on config
  const customizationPrice =
    selectedVariant?.config && typeof selectedVariant.config === "object"
      ? (() => {
          const config = selectedVariant.config as ConfigData;
          let total = 0;

          // Calculate price for custom items based on quantities and price rules
          config.items?.forEach((item) => {
            const quantity = customQuantities[item.id] || item.baseQuantity;
            const itemPrice = calculateItemPrice(quantity, item.priceRules);
            total += itemPrice;
          });

          // Add price for selected category products
          total += calculateCategoryProductsPrice();

          return total;
        })()
      : 0;

  // Validation function for required categories
  const validateRequiredSelections = (): string[] => {
    const errors: string[] = [];

    if (selectedVariant?.config && typeof selectedVariant.config === "object") {
      const config = selectedVariant.config as ConfigData;

      // Check required categories
      config.variantCategoryRules?.forEach((rule) => {
        if (rule.isRequired) {
          const selectedProducts =
            selectedCategoryProducts[rule.categoryId] || [];
          if (selectedProducts.length === 0) {
            errors.push(
              `Bạn cần chọn ít nhất 1 sản phẩm từ danh mục "${rule.categoryName}"`
            );
          }
        }
      });
    }

    return errors;
  };

  // Calculate total price including base price, options, and customization
  const totalPrice = selectedVariant
    ? Number(selectedVariant.price) +
      selectedOptions.reduce((sum, option) => sum + option.price, 0) +
      customizationPrice
    : 0;

  // Get background customization status from API-based detection
  const hasBackgroundCustomization = () => {
    return hasBackground && !backgroundLoading;
  };

  // Handle continue to background customization
  const handleContinueToBackground = () => {
    const errors = validateRequiredSelections();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    // Prepare customization data to pass to background customize page
    const customizationData = {
      productId,
      variantId,
      selectedOptions,
      customQuantities,
      ...(numberOfItems > 1
        ? { multiItemCustomizations }
        : { selectedCategoryProducts }),
      totalPrice,
    };

    // Navigate to background customization page with data
    const encodedData = encodeURIComponent(JSON.stringify(customizationData));
    navigate(`/background-customize?data=${encodedData}`);
  };

  // Handle add to cart with validation
  const handleAddToCart = () => {
    const errors = validateRequiredSelections();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    // TODO: Implement actual add to cart logic
    // Adding to cart

    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  if (!productId || !variantId) {
    return (
      <div className={styles.errorState}>
        <div className="site-inner">
          <p>Thiếu thông tin sản phẩm hoặc biến thể.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className="site-inner">
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải thông tin tùy chỉnh...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorState}>
        <div className="site-inner">
          <p>Không thể tải thông tin sản phẩm.</p>
        </div>
      </div>
    );
  }

  if (!selectedVariant) {
    return (
      <div className={styles.errorState}>
        <div className="site-inner">
          <p>Không tìm thấy biến thể đã chọn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.customizePage}>
      <div className="site-inner">
        {/* Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Tùy Chỉnh Sản Phẩm</h1>
          <div className={styles.breadcrumb}>
            <span>Trang chủ</span>
            <span className={styles.separator}>›</span>
            <span>{product.collection?.name}</span>
            <span className={styles.separator}>›</span>
            <span>{product.name}</span>
            <span className={styles.separator}>›</span>
            <span className={styles.current}>Tùy chỉnh</span>
          </div>
        </div>

        <div className={styles.customizeContent}>
          {/* Product Summary */}
          <div className={styles.productSummary}>
            <h2>Thông Tin Sản Phẩm</h2>
            <div className={styles.summaryCard}>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.collection}>{product.collection?.name}</p>
              </div>
            </div>

            {/* Variant Details */}
            <div className={styles.variantDetails}>
              <h3>Thông Tin Chi Tiết</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tên sản phẩm:</span>
                  <span className={styles.detailValue}>
                    {selectedVariant.name}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Giá:</span>
                  <span className={styles.detailValue}>
                    {formatPrice(Number(selectedVariant.price))}
                  </span>
                </div>

                {selectedVariant.description && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Mô tả:</span>
                    <div className={styles.detailValue}>
                      {selectedVariant.description
                        .split("\n")
                        .map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                    </div>
                  </div>
                )}

                {selectedVariant.endow &&
                  (() => {
                    const endowData = parseEndowData(selectedVariant.endow);
                    const hasEndowItems =
                      endowData.items.length > 0 ||
                      endowData.customProducts.length > 0;

                    return hasEndowItems ? (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Ưu đãi đặc biệt:
                        </span>
                        <div className={styles.detailValue}>
                          {/* Check endow products availability */}
                          <EndowAvailabilityChecker endowData={endowData} />

                          <div className={styles.endowList}>
                            {/* Display text items */}
                            {endowData.items.map((content, index) => (
                              <div
                                key={`item-${index}`}
                                className={styles.endowItem}
                              >
                                <FaGift className={styles.icon} />
                                <span>{content}</span>
                              </div>
                            ))}

                            {/* Display custom products */}
                            {endowData.customProducts.map((cp, index) => (
                              <div
                                key={`custom-${index}`}
                                className={styles.endowItem}
                              >
                                <span className={styles.icon}>�</span>
                                <span>
                                  <CustomProductItem
                                    productCustomId={cp.productCustomId}
                                  />
                                  {cp.quantity > 1 && (
                                    <span> x{cp.quantity}</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                {selectedVariant.option && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      Options mua thêm:
                    </span>
                    <div className={styles.detailValue}>
                      <div className={styles.optionsList}>
                        {parseOptionData(selectedVariant.option).map(
                          (option, index) => {
                            const optionId = `option-${index}`;
                            const isSelected = selectedOptions.some(
                              (opt) => opt.id === optionId
                            );

                            return (
                              <div
                                key={index}
                                className={`${styles.optionItem} ${
                                  isSelected ? styles.selected : ""
                                }`}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedOptions((prev) =>
                                      prev.filter((opt) => opt.id !== optionId)
                                    );
                                  } else {
                                    setSelectedOptions((prev) => [
                                      ...prev,
                                      { id: optionId, price: option.price },
                                    ]);
                                  }
                                }}
                              >
                                <div className={styles.optionCheckbox}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}} // Handled by parent onClick
                                  />
                                </div>
                                <div className={styles.optionContent}>
                                  <div className={styles.optionHeader}>
                                    <span className={styles.optionName}>
                                      {option.name}
                                    </span>
                                    {option.price > 0 && (
                                      <span className={styles.optionPrice}>
                                        +{formatPrice(option.price)}
                                      </span>
                                    )}
                                  </div>
                                  {option.description && (
                                    <div className={styles.optionDescription}>
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Customization Based on Config */}
          {selectedVariant?.config &&
            typeof selectedVariant.config === "object" &&
            (() => {
              const config = selectedVariant.config as ConfigData;

              return (
                <div className={styles.customizeSection}>
                  <h2>Tùy Chỉnh Sản Phẩm</h2>

                  {/* Custom Items - Quantity Selection */}
                  {config.items && config.items.length > 0 && (
                    <div className={styles.customItemsSection}>
                      <h3>Số Lượng Sản Phẩm</h3>
                      {config.items.map((item) => {
                        const currentQuantity =
                          customQuantities[item.id] || item.baseQuantity;
                        const itemPrice = calculateItemPrice(
                          currentQuantity,
                          item.priceRules
                        );

                        return (
                          <div key={item.id} className={styles.itemConfig}>
                            <div className={styles.itemHeader}>
                              <h4>{item.name}</h4>
                              {itemPrice > 0 && (
                                <span className={styles.itemPrice}>
                                  {formatPrice(itemPrice)}
                                </span>
                              )}
                            </div>

                            {config.allowCustomQuantity ? (
                              <QuantitySelector
                                value={currentQuantity}
                                onChange={(value) =>
                                  setCustomQuantities((prev) => ({
                                    ...prev,
                                    [item.id]: value,
                                  }))
                                }
                                min={config.minCustomQuantity}
                                max={config.maxCustomQuantity}
                                label={`Số lượng ${item.name.toLowerCase()}`}
                              />
                            ) : (
                              <div className={styles.fixedQuantity}>
                                <span>
                                  Số lượng cố định: {item.baseQuantity}
                                </span>
                              </div>
                            )}

                            {/* Show price rules */}
                            {item.priceRules && item.priceRules.length > 0 && (
                              <div className={styles.priceRules}>
                                <p className={styles.priceRulesTitle}>
                                  Bảng giá:
                                </p>
                                {item.priceRules.map((rule) => (
                                  <p key={rule.id} className={styles.priceRule}>
                                    {rule.description}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* All Categories Product Selection - Always Show */}
                  <div className={styles.categoryRulesSection}>
                    <TabsCategoriesSelector
                      variantCategoryRules={config.variantCategoryRules || []}
                      selectedCategoryProducts={selectedCategoryProducts}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      currentPage={currentPage}
                      onPageChange={(categoryId: string, page: number) => {
                        setCurrentPage((prev) => ({
                          ...prev,
                          [categoryId]: page,
                        }));
                      }}
                      itemsPerPage={itemsPerPage}
                      onProductChange={(
                        categoryId: string,
                        productCustomId: string,
                        selected: boolean
                      ) => {
                        setSelectedCategoryProducts((prev) => {
                          const current = prev[categoryId] || [];
                          if (selected) {
                            return {
                              ...prev,
                              [categoryId]: [
                                ...current,
                                { productCustomId, quantity: 1 },
                              ],
                            };
                          } else {
                            return {
                              ...prev,
                              [categoryId]: current.filter(
                                (p) => p.productCustomId !== productCustomId
                              ),
                            };
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })()}

          {/* Price Summary */}
          <div className={styles.priceSummary}>
            <div className={styles.priceRow}>
              <span>Giá sản phẩm gốc:</span>
              <span>{formatPrice(Number(selectedVariant.price))}</span>
            </div>

            {/* Show selected options pricing */}
            {selectedOptions.length > 0 &&
              selectedOptions.map((selectedOption) => {
                const optionIndex = parseInt(selectedOption.id.split("-")[1]);
                const optionData = parseOptionData(selectedVariant.option)[
                  optionIndex
                ];
                return (
                  <div key={selectedOption.id} className={styles.priceRow}>
                    <span>+ {optionData?.name || "Option"}:</span>
                    <span>{formatPrice(selectedOption.price)}</span>
                  </div>
                );
              })}

            {/* Show customization pricing if any */}
            {customizationPrice > 0 && (
              <div className={styles.priceRow}>
                <span>+ Tùy chỉnh sản phẩm:</span>
                <span>{formatPrice(customizationPrice)}</span>
              </div>
            )}

            {/* Show custom products pricing details */}
            {Object.values(selectedCategoryProducts).flat().length > 0 && (
              <div className={styles.customProductsBreakdown}>
                {Object.entries(selectedCategoryProducts).map(
                  ([categoryId, products]) => {
                    if (products.length === 0) return null;
                    return products.map((selection) => {
                      const productPrice =
                        customProductsPrices[selection.productCustomId] || 0;
                      const productDetails =
                        customProductsDetails[selection.productCustomId];
                      const totalProductPrice =
                        productPrice * selection.quantity;

                      const productName =
                        productDetails?.name ||
                        `Sản phẩm ID: ${selection.productCustomId}`;

                      return (
                        <div
                          key={`${categoryId}-${selection.productCustomId}`}
                          className={styles.priceRow}
                        >
                          <span>
                            + {productName} (x{selection.quantity}):
                          </span>
                          <span>{formatPrice(totalProductPrice)}</span>
                        </div>
                      );
                    });
                  }
                )}
              </div>
            )}

            {/* Total price */}
            <div className={styles.priceTotal}>
              <span>Tổng cộng:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionSection}>
            <button className={styles.previewBtn}>
              <FaEye className={styles.btnIcon} />
              Xem Trước
            </button>

            {backgroundLoading ? (
              <button className={styles.loadingBtn} disabled>
                <FaClock className={styles.btnIcon} />
                Đang kiểm tra...
              </button>
            ) : hasBackgroundCustomization() ? (
              <button
                className={styles.continueBackgroundBtn}
                onClick={handleContinueToBackground}
              >
                <FaPalette className={styles.btnIcon} />
                Tiếp tục tùy chỉnh Background
              </button>
            ) : (
              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <FaShoppingCart className={styles.btnIcon} />
                Thêm Vào Giỏ Hàng - {formatPrice(totalPrice)}
              </button>
            )}
          </div>

          {/* Validation Modal */}
          {showValidationModal && (
            <div className={styles.validationModal}>
              <div
                className={styles.modalOverlay}
                onClick={() => setShowValidationModal(false)}
              />
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>Vui lòng hoàn thiện thông tin</h3>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setShowValidationModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.errorList}>
                    {validationErrors.map((error, index) => (
                      <div key={index} className={styles.errorItem}>
                        <FaTimes className={styles.errorIcon} />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={styles.modalBtn}
                    onClick={() => setShowValidationModal(false)}
                  >
                    Đã hiểu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

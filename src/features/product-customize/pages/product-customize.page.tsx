import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  FaGift,
  FaPlus,
  FaMinus,
  FaCheck,
  FaTimes,
  FaShoppingCart,
  FaPalette,
  FaArrowLeft,
  FaInfoCircle,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useProduct } from "../queries/product-customize.queries";
import {
  productCustomsService,
  checkProductHasBackground,
} from "../../product-variants/services/product-customs.service";
import type { ProductCustom } from "../../product-variants/services/product-customs.service";
import styles from "./product-customize.module.scss";

// Types
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
  variantCategoryRules: VariantCategoryRule[];
}

// Utilities
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getProductAvailability = (product: ProductCustom) => {
  if (!product.inventories || product.inventories.length === 0) {
    return { available: false, stock: 0 };
  }
  const totalStock = product.inventories.reduce((total, inventory) => {
    const available = (inventory.currentStock || 0) - (inventory.reservedStock || 0);
    return total + Math.max(0, available);
  }, 0);
  return { available: totalStock > 0, stock: totalStock };
};

const calculateItemPrice = (quantity: number, priceRules: ConfigItem["priceRules"]): number => {
  if (!priceRules || priceRules.length === 0) return 0;
  const rule = priceRules
    .filter((r) => (r.condition === "greater_than" ? quantity > r.minQuantity : quantity >= r.minQuantity))
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
  return rule ? rule.pricePerUnit * quantity : 0;
};

// Parse endow data
const parseEndowData = (endow: any) => {
  if (!endow || typeof endow !== "object") return { items: [], customProducts: [] };
  const items: string[] = [];
  const customProducts: Array<{ productCustomId: string; quantity: number }> = [];
  
  if (endow.items && Array.isArray(endow.items)) {
    endow.items.forEach((item: any) => {
      if (item?.content) items.push(item.content);
    });
  }
  if (endow.customProducts && Array.isArray(endow.customProducts)) {
    endow.customProducts.forEach((cp: any) => {
      if (cp?.productCustomId) {
        customProducts.push({ productCustomId: cp.productCustomId, quantity: cp.quantity || 1 });
      }
    });
  }
  return { items, customProducts };
};

// Parse option data
const parseOptionData = (option: any) => {
  if (!option) return [];
  const results: Array<{ name: string; description: string; price: number }> = [];
  
  if (option.purchaseOptions) {
    const opts = Array.isArray(option.purchaseOptions) ? option.purchaseOptions : [option.purchaseOptions];
    opts.forEach((item: any, i: number) => {
      if (typeof item === "object") {
        results.push({
          name: item.name || item.title || `Tùy chọn ${i + 1}`,
          description: item.content || item.description || "",
          price: item.price || item.additionalPrice || 0,
        });
      }
    });
  }
  return results;
};

// Components
const QuantityControl = ({ value, onChange, min = 1, max = 99 }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) => (
  <div className={styles.quantityControl}>
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className={styles.qtyBtn}
    >
      <FaMinus />
    </button>
    <span className={styles.qtyValue}>{value}</span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className={styles.qtyBtn}
    >
      <FaPlus />
    </button>
  </div>
);

const ProductCard = ({ product, isSelected, onSelect, disabled }: {
  product: ProductCustom;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) => {
  const availability = getProductAvailability(product);
  const isOutOfStock = !availability.available;
  
  return (
    <div
      className={`${styles.productCard} ${isSelected ? styles.selected : ""} ${(disabled || isOutOfStock) ? styles.disabled : ""}`}
      onClick={() => !disabled && !isOutOfStock && onSelect()}
    >
      <div className={styles.cardImage}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className={styles.noImage}><FaGift /></div>
        )}
        {isSelected && (
          <div className={styles.selectedBadge}>
            <FaCheck />
          </div>
        )}
        {isOutOfStock && <div className={styles.outOfStockOverlay}>Hết hàng</div>}
      </div>
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{product.name}</h4>
        <p className={styles.cardPrice}>{formatPrice(parseInt(product.price) || 0)}</p>
        {!isOutOfStock && (
          <span className={styles.stockInfo}>Còn {availability.stock}</span>
        )}
      </div>
    </div>
  );
};

// Main Component
export default function ProductCustomizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("productId") || "";
  const variantId = searchParams.get("variantId") || "";

  const { data: product, isLoading, error } = useProduct(productId, Boolean(productId));
  const selectedVariant = product?.productVariants?.find((v) => v.id === variantId);

  // States
  const [selectedOptions, setSelectedOptions] = useState<Array<{ id: string; price: number }>>([]);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [selectedProducts, setSelectedProducts] = useState<Record<string, Array<{ productCustomId: string; quantity: number }>>>({});
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  const [productDetails, setProductDetails] = useState<Record<string, ProductCustom>>({});
  const [hasBackground, setHasBackground] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryProducts, setCategoryProducts] = useState<Record<string, ProductCustom[]>>({});
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load category products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productCustomsService.getProductCustoms({ status: "active", limit: 100 });
        const products = response.data || [];
        const grouped: Record<string, ProductCustom[]> = {};
        const names: Record<string, string> = {};

        products.forEach((p) => {
          if (p.productCategory) {
            const catId = p.productCategory.id;
            if (!grouped[catId]) grouped[catId] = [];
            grouped[catId].push(p);
            names[catId] = p.productCategory.name;
          }
        });

        setCategoryProducts(grouped);
        setCategoryNames(names);
        if (Object.keys(grouped).length > 0) {
          setActiveCategory(Object.keys(grouped)[0]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Check background capability
  useEffect(() => {
    if (product?.id) {
      setBackgroundLoading(true);
      checkProductHasBackground(product.id)
        .then(setHasBackground)
        .catch(() => setHasBackground(false))
        .finally(() => setBackgroundLoading(false));
    }
  }, [product?.id]);

  // Fetch prices for selected products
  useEffect(() => {
    const fetchPrices = async () => {
      const allSelected = Object.values(selectedProducts).flat();
      const missing = allSelected.filter((p) => !(p.productCustomId in productPrices));
      
      if (missing.length > 0) {
        const results = await Promise.all(
          missing.map(async (p) => {
            try {
              const prod = await productCustomsService.getProductCustomById(p.productCustomId);
              return { id: p.productCustomId, price: parseInt(prod.price) || 0, product: prod };
            } catch {
              return { id: p.productCustomId, price: 0, product: null };
            }
          })
        );
        
        const prices: Record<string, number> = {};
        const details: Record<string, ProductCustom> = {};
        results.forEach(({ id, price, product }) => {
          prices[id] = price;
          if (product) details[id] = product;
        });
        
        setProductPrices((prev) => ({ ...prev, ...prices }));
        setProductDetails((prev) => ({ ...prev, ...details }));
      }
    };
    fetchPrices();
  }, [selectedProducts, productPrices]);

  // Config data
  const config = useMemo(() => {
    if (selectedVariant?.config && typeof selectedVariant.config === "object") {
      return selectedVariant.config as ConfigData;
    }
    return null;
  }, [selectedVariant?.config]);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    const products = categoryProducts[activeCategory] || [];
    if (!searchTerm) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoryProducts, activeCategory, searchTerm]);

  // Calculate prices
  const customizationPrice = useMemo(() => {
    let total = 0;
    config?.items?.forEach((item) => {
      const qty = customQuantities[item.id] || item.baseQuantity;
      total += calculateItemPrice(qty, item.priceRules);
    });
    Object.values(selectedProducts).flat().forEach((sel) => {
      total += (productPrices[sel.productCustomId] || 0) * sel.quantity;
    });
    return total;
  }, [config, customQuantities, selectedProducts, productPrices]);

  const optionsPrice = useMemo(() => 
    selectedOptions.reduce((sum, opt) => sum + opt.price, 0), 
    [selectedOptions]
  );

  const totalPrice = (Number(selectedVariant?.price) || 0) + optionsPrice + customizationPrice;

  // Handlers
  const handleProductSelect = (categoryId: string, productId: string) => {
    const rule = config?.variantCategoryRules?.find((r) => r.categoryId === categoryId);
    const maxSelections = rule?.maxSelections || 999;
    
    setSelectedProducts((prev) => {
      const current = prev[categoryId] || [];
      const exists = current.some((p) => p.productCustomId === productId);
      
      if (exists) {
        return { ...prev, [categoryId]: current.filter((p) => p.productCustomId !== productId) };
      } else if (current.length < maxSelections) {
        return { ...prev, [categoryId]: [...current, { productCustomId: productId, quantity: 1 }] };
      }
      return prev;
    });
  };

  const handleOptionToggle = (optionId: string, price: number) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.id === optionId);
      return exists ? prev.filter((o) => o.id !== optionId) : [...prev, { id: optionId, price }];
    });
  };

  const validateSelections = (): string[] => {
    const errors: string[] = [];
    config?.variantCategoryRules?.forEach((rule) => {
      if (rule.isRequired) {
        const selected = selectedProducts[rule.categoryId] || [];
        if (selected.length === 0) {
          errors.push(`Vui lòng chọn ít nhất 1 sản phẩm từ "${rule.categoryName}"`);
        }
      }
    });
    return errors;
  };

  const handleContinue = () => {
    const errors = validateSelections();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);
      return;
    }

    if (hasBackground) {
      const data = {
        productId,
        variantId,
        selectedOptions,
        customQuantities,
        selectedCategoryProducts: selectedProducts,
        totalPrice,
      };
      navigate(`/background-customize?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      // Add to cart logic
      alert("Đã thêm vào giỏ hàng!");
    }
  };

  // Render states
  if (!productId || !variantId) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorContent}>
          <FaInfoCircle className={styles.errorIcon} />
          <h2>Thiếu thông tin sản phẩm</h2>
          <p>Vui lòng chọn sản phẩm từ trang chủ</p>
          <Link to="/" className={styles.backBtn}><FaArrowLeft /> Về trang chủ</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loader}></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product || !selectedVariant) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorContent}>
          <FaTimes className={styles.errorIcon} />
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm không tồn tại hoặc đã bị xóa</p>
          <Link to="/" className={styles.backBtn}><FaArrowLeft /> Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const endowData = parseEndowData(selectedVariant.endow);
  const optionData = parseOptionData(selectedVariant.option);
  const categoryIds = Object.keys(categoryProducts);

  return (
    <div className={styles.customizePage}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <FaArrowLeft />
          </button>
          <div className={styles.headerTitle}>
            <h1>Tùy chỉnh sản phẩm</h1>
            <p>{product.name} - {selectedVariant.name}</p>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Left: Product Info & Options */}
        <section className={styles.leftSection}>
          {/* Product Summary Card */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <h2>{selectedVariant.name}</h2>
              <span className={styles.basePrice}>{formatPrice(Number(selectedVariant.price))}</span>
            </div>
            
            {selectedVariant.description && (
              <p className={styles.summaryDesc}>{selectedVariant.description}</p>
            )}

            {/* Endow Items */}
            {(endowData.items.length > 0 || endowData.customProducts.length > 0) && (
              <div className={styles.endowSection}>
                <h3><FaGift /> Quà tặng kèm</h3>
                <ul className={styles.endowList}>
                  {endowData.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Purchase Options */}
          {optionData.length > 0 && (
            <div className={styles.optionsCard}>
              <h3>Tùy chọn mua thêm</h3>
              <div className={styles.optionsList}>
                {optionData.map((opt, i) => {
                  const optId = `opt-${i}`;
                  const isSelected = selectedOptions.some((o) => o.id === optId);
                  return (
                    <label key={i} className={`${styles.optionItem} ${isSelected ? styles.selected : ""}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOptionToggle(optId, opt.price)}
                      />
                      <div className={styles.optionContent}>
                        <span className={styles.optionName}>{opt.name}</span>
                        {opt.description && <span className={styles.optionDesc}>{opt.description}</span>}
                      </div>
                      {opt.price > 0 && (
                        <span className={styles.optionPrice}>+{formatPrice(opt.price)}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Config */}
          {config?.items && config.items.length > 0 && (
            <div className={styles.quantityCard}>
              <h3>Số lượng</h3>
              {config.items.map((item) => {
                const qty = customQuantities[item.id] || item.baseQuantity;
                const price = calculateItemPrice(qty, item.priceRules);
                return (
                  <div key={item.id} className={styles.quantityRow}>
                    <div className={styles.qtyInfo}>
                      <span className={styles.qtyName}>{item.name}</span>
                      {price > 0 && <span className={styles.qtyPrice}>+{formatPrice(price)}</span>}
                    </div>
                    {config.allowCustomQuantity ? (
                      <QuantityControl
                        value={qty}
                        onChange={(v) => setCustomQuantities((prev) => ({ ...prev, [item.id]: v }))}
                        min={config.minCustomQuantity}
                        max={config.maxCustomQuantity}
                      />
                    ) : (
                      <span className={styles.fixedQty}>{item.baseQuantity}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right: Product Selection */}
        <section className={styles.rightSection}>
          <div className={styles.selectionCard}>
            <div className={styles.selectionHeader}>
              <h2>Chọn sản phẩm tùy chỉnh</h2>
              <p>Chọn các sản phẩm bạn muốn thêm vào đơn hàng</p>
            </div>

            {loadingProducts ? (
              <div className={styles.loadingProducts}>
                <div className={styles.loader}></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : categoryIds.length === 0 ? (
              <div className={styles.emptyProducts}>
                <FaGift />
                <p>Chưa có sản phẩm tùy chỉnh</p>
              </div>
            ) : (
              <>
                {/* Category Tabs */}
                <div className={styles.categoryTabs}>
                  {categoryIds.map((catId) => {
                    const rule = config?.variantCategoryRules?.find((r) => r.categoryId === catId);
                    const isRequired = rule?.isRequired || false;
                    
                    return (
                      <button
                        key={catId}
                        className={`${styles.categoryTab} ${activeCategory === catId ? styles.active : ""} ${isRequired ? styles.required : ""}`}
                        onClick={() => setActiveCategory(catId)}
                      >
                        <span className={styles.tabName}>
                          {categoryNames[catId]}
                          {isRequired && <span className={styles.requiredMark}>*</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className={styles.searchBox}>
                  <FaSearch />
                  <input
                    type="text"
                    placeholder={`Tìm trong ${categoryNames[activeCategory]}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Products Grid */}
                <div className={styles.productsGrid}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const rule = config?.variantCategoryRules?.find((r) => r.categoryId === activeCategory);
                      const maxSel = rule?.maxSelections || 999;
                      const currentSel = selectedProducts[activeCategory]?.length || 0;
                      const isSelected = selectedProducts[activeCategory]?.some((p) => p.productCustomId === product.id);
                      const disabled = !isSelected && currentSel >= maxSel;
                      
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isSelected={!!isSelected}
                          onSelect={() => handleProductSelect(activeCategory, product.id)}
                          disabled={disabled}
                        />
                      );
                    })
                  ) : (
                    <div className={styles.noResults}>
                      <p>Không tìm thấy sản phẩm "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Floating Price Bar */}
      <footer className={styles.priceBar}>
        <div className={styles.priceBarInner}>
          <div className={styles.priceBreakdown}>
            <div className={styles.priceItem}>
              <span>Giá gốc:</span>
              <span>{formatPrice(Number(selectedVariant.price))}</span>
            </div>
            {optionsPrice > 0 && (
              <div className={styles.priceItem}>
                <span>Tùy chọn:</span>
                <span>+{formatPrice(optionsPrice)}</span>
              </div>
            )}
            {customizationPrice > 0 && (
              <div className={styles.priceItem}>
                <span>Tùy chỉnh:</span>
                <span>+{formatPrice(customizationPrice)}</span>
              </div>
            )}
          </div>
          
          <div className={styles.totalSection}>
            <div className={styles.totalPrice}>
              <span>Tổng:</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
            
            <button
              className={styles.continueBtn}
              onClick={handleContinue}
              disabled={backgroundLoading}
            >
              {backgroundLoading ? (
                "Đang kiểm tra..."
              ) : hasBackground ? (
                <><FaPalette /> Tiếp tục chọn Background</>
              ) : (
                <><FaShoppingCart /> Thêm vào giỏ hàng</>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Validation Modal */}
      {showValidation && (
        <div className={styles.modal}>
          <div className={styles.modalOverlay} onClick={() => setShowValidation(false)} />
          <div className={styles.modalContent}>
            <h3>Vui lòng hoàn thành các lựa chọn</h3>
            <ul className={styles.errorList}>
              {validationErrors.map((err, i) => (
                <li key={i}><FaTimes /> {err}</li>
              ))}
            </ul>
            <button className={styles.modalBtn} onClick={() => setShowValidation(false)}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

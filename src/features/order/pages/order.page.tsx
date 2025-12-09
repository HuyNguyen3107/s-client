import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaTag, FaTruck } from "react-icons/fa";
import type { OrderData, OrderSubmissionData } from "../types/order.types";
import { createOrder } from "../services/order.service";
import { getProductById } from "../../products/services/product.services";
import { getBackgroundById } from "../../backgrounds/services/background.services";
import { getProductCustomById } from "../../product-customs/services/product-custom.service";
import { productCategoryService } from "../../product-categories/services/product-category.service";
import { getShippingFees } from "../../shipping-fees/services/shipping-fee.services";
import { getPromotionByCode } from "../../promotions/services/promotion.services";
import type { ProductWithRelations } from "../../products/types";
import type { Background } from "../../backgrounds/types/background.types";
import type { ProductCustomWithRelations } from "../../product-customs/types";
import type { ProductCategoryWithRelations } from "../../product-categories/types";
import type { ShippingFee } from "../../shipping-fees/types/shipping-fee.types";
import type { Promotion } from "../../promotions/types/promotion.types";
import type {
  BackgroundFieldConfig,
  FieldValue,
} from "../../backgrounds/types/background-config.types";
import Header from "../../../components/header.components";
import Footer from "../../../components/footer.components";
import { OrderSuccessModal } from "../components/order-success-modal";
import { useCartStore } from "../../../store/cart.store";
import { toast } from "react-toastify";
import styles from "./order.module.scss";

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get order data from URL params - use useMemo to prevent recreating object
  const orderDataString = searchParams.get("data");
  const parsedData = useMemo(() => {
    return orderDataString
      ? JSON.parse(decodeURIComponent(orderDataString))
      : null;
  }, [orderDataString]);

  // Check if it's multiple orders or single order
  const isMultipleOrders = parsedData?.multiple === true;
  const multipleOrdersData = isMultipleOrders ? parsedData : null;
  const orderData: OrderData | null = isMultipleOrders ? null : parsedData;

  // Product and background details
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [variant, setVariant] = useState<any>(null);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // For detailed product custom info
  const [productCustomDetails, setProductCustomDetails] = useState<
    Map<string, ProductCustomWithRelations>
  >(new Map());

  // For detailed category info
  const [categoryDetails, setCategoryDetails] = useState<
    Map<string, ProductCategoryWithRelations>
  >(new Map());

  // Shipping and promotion state
  const [availableShippingOptions, setAvailableShippingOptions] = useState<
    ShippingFee[]
  >([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingFee | null>(
    null
  );
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
    null
  );
  const [promoError, setPromoError] = useState<string>("");
  const [promoLoading, setPromoLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState<string>("");

  // Fetch product and background details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!orderData) {
        setLoadingDetails(false);
        return;
      }

      try {
        setLoadingDetails(true);

        let variantData: any = null;

        // Fetch product details
        if (orderData.productId) {
          const productData = await getProductById(orderData.productId);
          setProduct(productData);

          // Find variant
          variantData = productData.productVariants?.find(
            (v) => v.id === orderData.variantId
          );
          setVariant(variantData);
        }

        // Fetch background details
        if (
          orderData.selectedBackgroundIds &&
          orderData.selectedBackgroundIds.length > 0
        ) {
          const backgroundPromises = orderData.selectedBackgroundIds.map((id) =>
            getBackgroundById(id)
          );
          const backgroundData = await Promise.all(backgroundPromises);
          setBackgrounds(backgroundData);
        }

        // Fetch product custom details from selectedCategoryProducts
        const customDetailsMap = new Map<string, ProductCustomWithRelations>();

        if (orderData.selectedCategoryProducts) {
          for (const [, products] of Object.entries(
            orderData.selectedCategoryProducts
          )) {
            for (const { productCustomId } of products) {
              if (!customDetailsMap.has(productCustomId)) {
                try {
                  const customData = await getProductCustomById(
                    productCustomId
                  );
                  customDetailsMap.set(productCustomId, customData);
                } catch (error) {
                  // Silently skip if product custom not found
                  console.warn(
                    `Product custom ${productCustomId} not found, skipping...`
                  );
                }
              }
            }
          }
        }

        // Fetch product custom details from multiItemCustomizations
        if (orderData.multiItemCustomizations) {
          for (const itemCustoms of Object.values(
            orderData.multiItemCustomizations
          )) {
            for (const [, products] of Object.entries(itemCustoms)) {
              for (const { productCustomId } of products) {
                if (!customDetailsMap.has(productCustomId)) {
                  try {
                    const customData = await getProductCustomById(
                      productCustomId
                    );
                    customDetailsMap.set(productCustomId, customData);
                  } catch (error) {
                    // Silently skip if product custom not found
                    console.warn(
                      `Product custom ${productCustomId} not found, skipping...`
                    );
                  }
                }
              }
            }
          }
        }

        // Fetch product custom details from variant endow (promotions)
        if (variantData?.endow) {
          let endowData = variantData.endow;

          // Parse if endow is a JSON string
          if (typeof endowData === "string") {
            try {
              endowData = JSON.parse(endowData);
            } catch (e) {
              console.warn("Failed to parse endow data:", e);
            }
          }

          if (
            typeof endowData === "object" &&
            endowData.customProducts &&
            Array.isArray(endowData.customProducts)
          ) {
            for (const customProduct of endowData.customProducts) {
              if (
                customProduct.productCustomId &&
                !customDetailsMap.has(customProduct.productCustomId)
              ) {
                try {
                  const customData = await getProductCustomById(
                    customProduct.productCustomId
                  );
                  customDetailsMap.set(
                    customProduct.productCustomId,
                    customData
                  );
                } catch (error) {
                  console.warn(
                    `Product custom ${customProduct.productCustomId} from endow not found, skipping...`
                  );
                }
              }
            }
          }
        }

        setProductCustomDetails(customDetailsMap);

        // Fetch category details
        const categoryIds = new Set<string>();

        if (orderData.selectedCategoryProducts) {
          Object.keys(orderData.selectedCategoryProducts).forEach((catId) =>
            categoryIds.add(catId)
          );
        }

        if (orderData.multiItemCustomizations) {
          for (const itemCustoms of Object.values(
            orderData.multiItemCustomizations
          )) {
            Object.keys(itemCustoms).forEach((catId) => categoryIds.add(catId));
          }
        }

        const catDetailsMap = new Map<string, ProductCategoryWithRelations>();

        for (const categoryId of Array.from(categoryIds)) {
          try {
            const categoryData =
              await productCategoryService.getProductCategoryById(categoryId);
            catDetailsMap.set(categoryId, categoryData);
          } catch (error) {
            // Silently skip if category not found
            console.warn(`Category ${categoryId} not found, skipping...`);
          }
        }

        setCategoryDetails(catDetailsMap);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData?.productId, orderData?.variantId]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Fetch shipping options on mount (default area)
  useEffect(() => {
    const fetchShippingOptions = async () => {
      setLoadingShipping(true);
      try {
        // Default to "Hà Nội" - can be changed to user's preference
        const response = await getShippingFees({
          area: "Hà Nội",
          limit: 100,
        });

        if (response && response.data && response.data.length > 0) {
          setAvailableShippingOptions(response.data);
          // Auto-select first option
          setSelectedShipping(response.data[0]);
          setShippingFee(Number(response.data[0].shippingFee));
        } else {
          console.warn("No shipping options found");
          setAvailableShippingOptions([]);
          setSelectedShipping(null);
          setShippingFee(30000); // Default fallback
        }
      } catch (error) {
        console.error("Error fetching shipping options:", error);
        setAvailableShippingOptions([]);
        setSelectedShipping(null);
        setShippingFee(30000); // Default fallback
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingOptions();
  }, []); // Run once on mount

  // Handle shipping option change
  const handleShippingChange = (shippingId: string) => {
    const selected = availableShippingOptions.find((s) => s.id === shippingId);
    if (selected) {
      setSelectedShipping(selected);
      setShippingFee(Number(selected.shippingFee));
    }
  };
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Vui lòng nhập mã giảm giá");
      return;
    }

    setPromoLoading(true);
    setPromoError("");

    try {
      const promotion = await getPromotionByCode(promoCode.trim());

      // Validate promotion is active
      if (!promotion.isActive) {
        setPromoError("Mã giảm giá không còn hiệu lực");
        setAppliedPromotion(null);
        return;
      }

      // Validate date range
      const now = new Date();
      const startDate = new Date(promotion.startDate);
      const endDate = promotion.endDate ? new Date(promotion.endDate) : null;

      if (now < startDate) {
        setPromoError("Mã giảm giá chưa có hiệu lực");
        setAppliedPromotion(null);
        return;
      }

      if (endDate && now > endDate) {
        setPromoError("Mã giảm giá đã hết hạn");
        setAppliedPromotion(null);
        return;
      }

      // Check usage limit
      if (promotion.usageLimit && promotion.usageCount) {
        if (promotion.usageCount >= promotion.usageLimit) {
          setPromoError("Mã giảm giá đã hết lượt sử dụng");
          setAppliedPromotion(null);
          return;
        }
      }

      // Check min order value
      const subtotal = calculateSubtotal();
      if (subtotal < Number(promotion.minOrderValue)) {
        setPromoError(
          `Đơn hàng tối thiểu ${formatPrice(
            Number(promotion.minOrderValue)
          )} để áp dụng mã này`
        );
        setAppliedPromotion(null);
        return;
      }

      setAppliedPromotion(promotion);
      setPromoError("");
    } catch (error: any) {
      setPromoError(
        error.response?.data?.message || "Mã giảm giá không hợp lệ"
      );
      setAppliedPromotion(null);
    } finally {
      setPromoLoading(false);
    }
  };

  // Handle remove promo code
  const handleRemovePromo = () => {
    setAppliedPromotion(null);
    setPromoCode("");
    setPromoError("");
  };

  // Calculate subtotal
  const calculateSubtotal = (): number => {
    if (!orderData) return 0;

    let total = 0;

    // Product variant price
    if (variant) {
      total += Number(variant.price) || 0;
    }

    // Selected options
    if (orderData.selectedOptions) {
      orderData.selectedOptions.forEach((option) => {
        total += Number(option.price) || 0;
      });
    }

    // Selected category products
    if (orderData.selectedCategoryProducts) {
      Object.values(orderData.selectedCategoryProducts).forEach((products) => {
        products.forEach(({ productCustomId, quantity }) => {
          const customProduct = productCustomDetails.get(productCustomId);
          if (customProduct && customProduct.price) {
            total += Number(customProduct.price) * quantity;
          }
        });
      });
    }

    // Multi-item customizations
    if (orderData.multiItemCustomizations) {
      Object.values(orderData.multiItemCustomizations).forEach(
        (itemCustoms) => {
          Object.values(itemCustoms).forEach((products) => {
            products.forEach(({ productCustomId, quantity }) => {
              const customProduct = productCustomDetails.get(productCustomId);
              if (customProduct && customProduct.price) {
                total += Number(customProduct.price) * quantity;
              }
            });
          });
        }
      );
    }

    // Note: Backgrounds don't have price field
    // Background price is typically included in product price or handled separately

    return total;
  };

  // Calculate discount amount
  const calculateDiscount = (): number => {
    if (!appliedPromotion) return 0;

    const subtotal = calculateSubtotal();

    if (appliedPromotion.type === "PERCENTAGE") {
      const discount = (subtotal * appliedPromotion.value) / 100;
      if (appliedPromotion.maxDiscountAmount) {
        return Math.min(discount, appliedPromotion.maxDiscountAmount);
      }
      return discount;
    } else if (appliedPromotion.type === "FIXED_AMOUNT") {
      return Math.min(appliedPromotion.value, subtotal);
    }

    return 0;
  };

  // Calculate final total
  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return Math.max(0, subtotal + shippingFee - discount);
  };

  // Handle input change
  // Handle apply promo code
  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!orderData || !product || !variant || !selectedShipping) {
      setSubmitError("Thiếu thông tin đơn hàng. Vui lòng thử lại.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build complete order submission data
      const submissionData: OrderSubmissionData = {
        // Collection info
        collection: product.collection
          ? {
              id: product.collection.id,
              name: product.collection.name,
              imageUrl: product.collection.imageUrl,
              routeName: product.collection.routeName,
            }
          : undefined,

        // Product info
        product: {
          id: product.id,
          name: product.name,
          hasBg: product.hasBg,
        },

        // Variant info
        variant: {
          id: variant.id,
          name: variant.name,
          description: variant.description,
          price: Number(variant.price),
          endow: variant.endow,
          option: variant.option,
          config: variant.config,
        },

        // Selected options
        selectedOptions: orderData.selectedOptions?.map((opt) => {
          const optionDetails = getOptionDetails(opt.id);
          return {
            id: opt.id,
            name: optionDetails?.name || `Tùy chọn ${opt.id}`,
            description: optionDetails?.description,
            price: Number(opt.price),
          };
        }),

        // Custom quantities
        customQuantities: orderData.customQuantities,

        // Selected category products
        selectedCategoryProducts: orderData.selectedCategoryProducts
          ? Object.entries(orderData.selectedCategoryProducts).reduce(
              (acc, [categoryId, products]) => {
                const category = categoryDetails.get(categoryId);
                acc[categoryId] = {
                  categoryId,
                  categoryName: category?.name,
                  products: products.map(({ productCustomId, quantity }) => {
                    const customProduct =
                      productCustomDetails.get(productCustomId);
                    const price = Number(customProduct?.price || 0);
                    return {
                      productCustomId,
                      productCustomName: customProduct?.name,
                      productCustomImage: customProduct?.imageUrl,
                      productCustomDescription: customProduct?.description,
                      quantity,
                      price,
                      totalPrice: price * quantity,
                    };
                  }),
                };
                return acc;
              },
              {} as Record<string, any>
            )
          : undefined,

        // Multi-item customizations
        multiItemCustomizations: orderData.multiItemCustomizations
          ? Object.entries(orderData.multiItemCustomizations).reduce(
              (acc, [itemIndex, itemCustoms]) => {
                acc[Number(itemIndex)] = Object.entries(itemCustoms).reduce(
                  (catAcc, [categoryId, products]) => {
                    const category = categoryDetails.get(categoryId);
                    catAcc[categoryId] = {
                      categoryId,
                      categoryName: category?.name,
                      products: products.map(
                        ({ productCustomId, quantity }) => {
                          const customProduct =
                            productCustomDetails.get(productCustomId);
                          const price = Number(customProduct?.price || 0);
                          return {
                            productCustomId,
                            productCustomName: customProduct?.name,
                            productCustomImage: customProduct?.imageUrl,
                            productCustomDescription:
                              customProduct?.description,
                            quantity,
                            price,
                            totalPrice: price * quantity,
                          };
                        }
                      ),
                    };
                    return catAcc;
                  },
                  {} as Record<string, any>
                );
                return acc;
              },
              {} as Record<number, any>
            )
          : undefined,

        // ⭐ Background - single object with full formConfig and formData
        background:
          backgrounds.length > 0 && backgrounds[0]
            ? {
                backgroundId: backgrounds[0].id,
                backgroundName: backgrounds[0].name,
                backgroundDescription: backgrounds[0].description,
                backgroundImageUrl: backgrounds[0].imageUrl,
                backgroundPrice: 0, // Backgrounds don't have price field currently
                // ⭐ Include form config from background
                formConfig: backgrounds[0].config
                  ? {
                      fields: backgrounds[0].config.fields?.map(
                        (field: any) => ({
                          id: field.id,
                          type: field.type,
                          title: field.title,
                          placeholder: field.placeholder,
                          required: field.required,
                          validation: field.validation,
                          options: field.options,
                        })
                      ),
                    }
                  : undefined,
                // ⭐ Include form data with field type
                formData: orderData.backgroundFormData
                  ? {
                      values: orderData.backgroundFormData.values?.map(
                        (fv: FieldValue) => {
                          // Find field config to get type
                          const fieldConfig =
                            backgrounds[0].config?.fields?.find(
                              (f: any) => f.id === fv.fieldId
                            );
                          return {
                            fieldId: fv.fieldId,
                            fieldTitle:
                              fieldConfig?.title ||
                              getFieldTitle(backgrounds[0], fv.fieldId),
                            fieldType: fieldConfig?.type || "text",
                            value: fv.value,
                            otherValue: fv.otherValue,
                          };
                        }
                      ),
                    }
                  : { values: [] },
              }
            : undefined,

        // Shipping info
        shipping: selectedShipping
          ? {
              shippingId: selectedShipping.id,
              shippingType: selectedShipping.shippingType,
              area: selectedShipping.area,
              estimatedDeliveryTime: selectedShipping.estimatedDeliveryTime,
              shippingFee: Number(selectedShipping.shippingFee),
              notes: selectedShipping.notesOrRemarks,
            }
          : undefined,

        // Promotion info (if applied)
        promotion: appliedPromotion
          ? {
              promotionId: appliedPromotion.id,
              promoCode: appliedPromotion.promoCode,
              title: appliedPromotion.title,
              description: appliedPromotion.description,
              type: appliedPromotion.type,
              value: Number(appliedPromotion.value),
              discountAmount: calculateDiscount(),
            }
          : undefined,

        // Pricing breakdown
        pricing: {
          productPrice: Number(variant.price),
          optionsPrice: orderData.selectedOptions
            ? orderData.selectedOptions.reduce(
                (sum, opt) => sum + Number(opt.price),
                0
              )
            : 0,
          customProductsPrice: calculateCustomProductsPrice(),
          backgroundPrice: 0, // Backgrounds don't have price currently
          subtotal: calculateSubtotal(),
          shippingFee: Number(selectedShipping.shippingFee),
          discountAmount: calculateDiscount(),
          total: calculateTotal(),
        },

        // Metadata
        metadata: {
          orderSource: "web",
          userAgent: navigator.userAgent,
        },
      };

      // Submit order
      const response = await createOrder(submissionData);

      // Lưu mã đơn hàng từ response
      const receivedOrderCode =
        response.data?.orderCode || response.data?.information?.orderCode || "";

      setOrderCode(receivedOrderCode);
      setSubmitSuccess(true);

      // Không tự động redirect nữa, để user tự chọn
      // setTimeout(() => {
      //   navigate("/");
      // }, 2000);
    } catch (error: any) {
      setSubmitError(
        error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to calculate custom products total price
  const calculateCustomProductsPrice = (): number => {
    let total = 0;

    // From selectedCategoryProducts
    if (orderData?.selectedCategoryProducts) {
      Object.values(orderData.selectedCategoryProducts).forEach((products) => {
        products.forEach(({ productCustomId, quantity }) => {
          const customProduct = productCustomDetails.get(productCustomId);
          if (customProduct && customProduct.price) {
            total += Number(customProduct.price) * quantity;
          }
        });
      });
    }

    // From multiItemCustomizations
    if (orderData?.multiItemCustomizations) {
      Object.values(orderData.multiItemCustomizations).forEach(
        (itemCustoms) => {
          Object.values(itemCustoms).forEach((products) => {
            products.forEach(({ productCustomId, quantity }) => {
              const customProduct = productCustomDetails.get(productCustomId);
              if (customProduct && customProduct.price) {
                total += Number(customProduct.price) * quantity;
              }
            });
          });
        }
      );
    }

    return total;
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle add to cart
  const { addItem } = useCartStore();
  const handleAddToCart = () => {
    if (!orderData) {
      toast.error("Không tìm thấy thông tin đơn hàng!");
      return;
    }

    // Calculate totals
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    // Add to cart
    addItem({
      orderData,
      shippingFee,
      selectedShippingId: selectedShipping?.id,
      appliedPromotionCode: appliedPromotion?.promoCode,
      discount,
      subtotal,
      total,
    });

    toast.success("Đã thêm vào giỏ hàng!");

    // Navigate to collections page
    setTimeout(() => {
      navigate("/collections");
    }, 1000);
  };

  // Helper function to get field title from background config
  const getFieldTitle = (background: Background, fieldId: string): string => {
    if (!background.config || !background.config.fields) {
      return fieldId;
    }

    const field = background.config.fields.find(
      (f: BackgroundFieldConfig) => f.id === fieldId
    );
    return field?.title || fieldId;
  };

  // Helper function to format field value
  const formatFieldValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Helper function to parse option data from variant
  const parseOptionData = (option: any) => {
    if (!option) return [];

    const results: Array<{ name: string; description: string; price: number }> =
      [];

    // Handle purchaseOptions structure
    if (option.purchaseOptions && Array.isArray(option.purchaseOptions)) {
      option.purchaseOptions.forEach((item: any, index: number) => {
        if (typeof item === "object") {
          results.push({
            name:
              item.name ||
              item.title ||
              item.content ||
              `Tùy chọn ${index + 1}`,
            description: item.description || item.desc || "",
            price: Number(item.price || 0),
          });
        }
      });
    }

    return results;
  };

  // Helper function to get option details by ID
  const getOptionDetails = (optionId: string) => {
    if (!variant || !variant.option) return null;

    const options = parseOptionData(variant.option);
    const optionIndex = parseInt(optionId.split("-")[1]);

    if (
      isNaN(optionIndex) ||
      optionIndex < 0 ||
      optionIndex >= options.length
    ) {
      return null;
    }

    return options[optionIndex];
  };

  // Helper function to render endow (promotion) content
  const renderEndowContent = (endow: any) => {
    // Parse if endow is a JSON string
    let endowData = endow;
    if (typeof endow === "string") {
      try {
        endowData = JSON.parse(endow);
      } catch (e) {
        // If parse fails, show the string as is
        return <span className={styles.productValue}>{endow}</span>;
      }
    }

    if (!endowData || typeof endowData !== "object") {
      return <span className={styles.productValue}>{String(endowData)}</span>;
    }

    const items = endowData.items || [];
    const customProducts = endowData.customProducts || [];

    return (
      <div className={styles.endowContent}>
        {/* Text items */}
        {items.length > 0 && (
          <div className={styles.endowItems}>
            {items.map((item: any, index: number) => (
              <div key={item.id || index} className={styles.endowItem}>
                <span className={styles.endowItemContent}>
                  {item.content || item.name || "Ưu đãi"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Custom products */}
        {customProducts.length > 0 && (
          <div className={styles.endowProducts}>
            {customProducts.map((customProduct: any, index: number) => {
              const productDetail = productCustomDetails.get(
                customProduct.productCustomId
              );

              return (
                <div
                  key={customProduct.id || index}
                  className={styles.endowProductItem}
                >
                  {productDetail ? (
                    <>
                      {productDetail.imageUrl && (
                        <img
                          src={productDetail.imageUrl}
                          alt={productDetail.name}
                          className={styles.endowProductImage}
                        />
                      )}
                      <div className={styles.endowProductInfo}>
                        <div className={styles.endowProductName}>
                          {productDetail.name}
                        </div>
                        {productDetail.description && (
                          <div className={styles.endowProductDesc}>
                            {productDetail.description}
                          </div>
                        )}
                        <div className={styles.endowProductQty}>
                          Số lượng: {customProduct.quantity || 1}
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className={styles.endowProductNotFound}>
                      Sản phẩm ưu đãi (ID: {customProduct.productCustomId})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (!orderData && !isMultipleOrders) {
    return (
      <>
        <Header />
        <div className={styles.errorState}>
          <div className="site-inner">
            <h2>Không tìm thấy dữ liệu đơn hàng</h2>
            <p>Vui lòng quay lại trang tùy chỉnh background</p>
            <button onClick={handleGoBack} className={styles.backBtn}>
              <FaArrowLeft /> Quay lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (submitSuccess) {
    return <OrderSuccessModal orderCode={orderCode} />;
  }

  // Render multiple orders view
  if (isMultipleOrders && multipleOrdersData) {
    const { items, totalAmount } = multipleOrdersData;
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    const toggleExpand = (itemId: string) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      setExpandedItems(newExpanded);
    };

    return (
      <>
        <Header />
        <div className={styles.orderPage}>
          <div className="site-inner">
            <div className={styles.header}>
              <button onClick={handleGoBack} className={styles.backBtn}>
                <FaArrowLeft />
                Quay lại
              </button>
              <h1 className={styles.pageTitle}>
                <FaShoppingCart className={styles.icon} />
                Xác nhận đơn hàng
              </h1>
            </div>

            <div className={styles.orderContentFullWidth}>
              <div className={styles.summarySection}>
                <h2 className={styles.sectionTitle}>
                  Danh sách đơn hàng ({items.length})
                </h2>

                {items.map((item: any, index: number) => {
                  const orderData = item.orderData;
                  const isExpanded = expandedItems.has(item.id);

                  return (
                    <div key={item.id} className={styles.checkoutOrderItem}>
                      <div className={styles.orderHeader}>
                        <h3>Đơn hàng #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className={styles.toggleDetailBtn}
                        >
                          {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                        </button>
                      </div>

                      {/* Summary View - Always visible */}
                      <div className={styles.orderSummary}>
                        <div className={styles.summaryRow}>
                          <span>Giá sản phẩm:</span>
                          <span>
                            {formatPrice(orderData.productTotalPrice)}
                          </span>
                        </div>
                        {orderData.selectedBackgroundIds &&
                          orderData.selectedBackgroundIds.length > 0 && (
                            <div className={styles.summaryRow}>
                              <span>Background:</span>
                              <span>
                                {formatPrice(orderData.backgroundTotalPrice)}
                              </span>
                            </div>
                          )}
                        {orderData.selectedOptions &&
                          orderData.selectedOptions.length > 0 && (
                            <div className={styles.summaryRow}>
                              <span>
                                Tùy chọn ({orderData.selectedOptions.length}):
                              </span>
                              <span>
                                {formatPrice(
                                  orderData.selectedOptions.reduce(
                                    (sum: number, opt: any) => sum + opt.price,
                                    0
                                  )
                                )}
                              </span>
                            </div>
                          )}
                        <div className={styles.summaryTotal}>
                          <span>Tổng cộng:</span>
                          <span className={styles.totalAmount}>
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      </div>

                      {/* Detailed View - Expandable */}
                      {isExpanded && (
                        <div className={styles.orderItemDetails}>
                          {/* Product Info */}
                          <div className={styles.detailsCard}>
                            <h4 className={styles.detailsTitle}>
                              Thông tin sản phẩm
                            </h4>
                            <div className={styles.productInfo}>
                              <div className={styles.productRow}>
                                <span className={styles.productLabel}>
                                  Giá sản phẩm:
                                </span>
                                <span className={styles.productValue}>
                                  {formatPrice(orderData.productTotalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Selected Options */}
                          {orderData.selectedOptions &&
                            orderData.selectedOptions.length > 0 && (
                              <div className={styles.detailsCard}>
                                <h4 className={styles.detailsTitle}>
                                  Tùy chọn đã chọn (
                                  {orderData.selectedOptions.length})
                                </h4>
                                <ul className={styles.optionsList}>
                                  {orderData.selectedOptions.map(
                                    (option: any, idx: number) => (
                                      <li
                                        key={idx}
                                        className={styles.optionItem}
                                      >
                                        <span>Tùy chọn {idx + 1}</span>
                                        <span className={styles.optionPrice}>
                                          {formatPrice(option.price)}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          {/* Background Info */}
                          {orderData.selectedBackgroundIds &&
                            orderData.selectedBackgroundIds.length > 0 && (
                              <div className={styles.detailsCard}>
                                <h4 className={styles.detailsTitle}>
                                  Background tùy chỉnh
                                </h4>
                                <div className={styles.productInfo}>
                                  <div className={styles.productRow}>
                                    <span className={styles.productLabel}>
                                      Số lượng background:
                                    </span>
                                    <span className={styles.productValue}>
                                      {orderData.selectedBackgroundIds.length}
                                    </span>
                                  </div>
                                  <div className={styles.productRow}>
                                    <span className={styles.productLabel}>
                                      Tổng giá:
                                    </span>
                                    <span className={styles.productValue}>
                                      {formatPrice(
                                        orderData.backgroundTotalPrice
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Pricing Breakdown */}
                          <div className={styles.priceBreakdown}>
                            <div className={styles.priceRow}>
                              <span>Tạm tính:</span>
                              <span>{formatPrice(item.subtotal)}</span>
                            </div>

                            {item.discount > 0 && (
                              <div className={styles.priceRow}>
                                <span>Giảm giá:</span>
                                <span className={styles.discount}>
                                  -{formatPrice(item.discount)}
                                </span>
                              </div>
                            )}

                            <div className={styles.priceRow}>
                              <span>Phí ship:</span>
                              <span>{formatPrice(item.shippingFee)}</span>
                            </div>

                            <div className={styles.totalRow}>
                              <span>Tổng cộng:</span>
                              <span>{formatPrice(item.total)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Grand Total */}
                <div className={styles.grandTotal}>
                  <h3>Tổng cộng tất cả đơn hàng</h3>
                  <div className={styles.amount}>
                    {formatPrice(totalAmount)}
                  </div>
                </div>

                {/* Note */}
                <div className={styles.noteBox}>
                  <p className={styles.noteTitle}>Lưu ý:</p>
                  <ul className={styles.noteList}>
                    <li>Đơn hàng sẽ được xử lý trong vòng 24h</li>
                    <li>
                      Chúng tôi sẽ liên hệ qua email hoặc điện thoại để xác nhận
                    </li>
                    <li>
                      Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đơn hàng
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className={styles.addToCartBtn}
                    disabled={isSubmitting}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Navigate to first order for now
                      if (items.length > 0) {
                        const firstOrderData = encodeURIComponent(
                          JSON.stringify(items[0].orderData)
                        );
                        navigate(`/order?data=${firstOrderData}`);
                      }
                    }}
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    Xác nhận đặt hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Guard clause for TypeScript
  if (!orderData) {
    return null;
  }

  return (
    <>
      <Header />
      <div className={styles.orderPage}>
        <div className="site-inner">
          {/* Header */}
          <div className={styles.header}>
            <button onClick={handleGoBack} className={styles.backBtn}>
              <FaArrowLeft />
              Quay lại
            </button>
            <h1 className={styles.pageTitle}>
              <FaShoppingCart className={styles.icon} />
              Xác nhận đơn hàng
            </h1>
          </div>

          {/* Order Summary - Full Width */}
          <div className={styles.orderContentFullWidth}>
            <div className={styles.summarySection}>
              <h2 className={styles.sectionTitle}>Chi tiết đơn hàng</h2>

              {/* Product Details */}
              {loadingDetails ? (
                <div className={styles.loadingBox}>Đang tải thông tin...</div>
              ) : (
                <>
                  {/* Collection & Product */}
                  {product && (
                    <div className={styles.detailsCard}>
                      <h3 className={styles.detailsTitle}>
                        Bộ sưu tập & Sản phẩm
                      </h3>
                      <div className={styles.productInfo}>
                        {product.collection && (
                          <div className={styles.productRow}>
                            <span className={styles.productLabel}>
                              Bộ sưu tập:
                            </span>
                            <span className={styles.productValue}>
                              {product.collection.name}
                            </span>
                          </div>
                        )}
                        <div className={styles.productRow}>
                          <span className={styles.productLabel}>Sản phẩm:</span>
                          <span className={styles.productValue}>
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Variant */}
                  {variant && (
                    <div className={styles.detailsCard}>
                      <h3 className={styles.detailsTitle}>Biến thể sản phẩm</h3>
                      <div className={styles.productInfo}>
                        <div className={styles.productRow}>
                          <span className={styles.productLabel}>Tên:</span>
                          <span className={styles.productValue}>
                            {variant.name}
                          </span>
                        </div>
                        {variant.description && (
                          <div className={styles.productRow}>
                            <span className={styles.productLabel}>Mô tả:</span>
                            <span className={styles.productValue}>
                              {variant.description}
                            </span>
                          </div>
                        )}
                        <div className={styles.productRow}>
                          <span className={styles.productLabel}>Giá:</span>
                          <span className={styles.productValue}>
                            {formatPrice(variant.price)}
                          </span>
                        </div>
                        {variant.endow && (
                          <div className={styles.productRowVertical}>
                            <span className={styles.productLabel}>Ưu đãi:</span>
                            {renderEndowContent(variant.endow)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Options */}
                  {orderData.selectedOptions &&
                    orderData.selectedOptions.length > 0 && (
                      <div className={styles.detailsCard}>
                        <h3 className={styles.detailsTitle}>
                          Tùy chọn đã chọn
                        </h3>
                        <ul className={styles.optionsList}>
                          {orderData.selectedOptions.map((option, index) => {
                            const optionDetails = getOptionDetails(option.id);
                            return (
                              <li key={index} className={styles.optionItem}>
                                <div>
                                  <div className={styles.optionName}>
                                    {optionDetails?.name ||
                                      `Tùy chọn ${index + 1}`}
                                  </div>
                                  {optionDetails?.description && (
                                    <div className={styles.optionDescription}>
                                      {optionDetails.description}
                                    </div>
                                  )}
                                </div>
                                <span className={styles.optionPrice}>
                                  {formatPrice(option.price)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                  {/* Custom Quantities */}
                  {orderData.customQuantities &&
                    Object.keys(orderData.customQuantities).length > 0 && (
                      <div className={styles.detailsCard}>
                        <h3 className={styles.detailsTitle}>
                          Số lượng tùy chỉnh
                        </h3>
                        <ul className={styles.optionsList}>
                          {Object.entries(orderData.customQuantities).map(
                            ([key, value]) => (
                              <li key={key} className={styles.optionItem}>
                                <span>{key}</span>
                                <span>{value} sản phẩm</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Selected Category Products */}
                  {orderData.selectedCategoryProducts &&
                    Object.keys(orderData.selectedCategoryProducts).length >
                      0 && (
                      <div className={styles.detailsCard}>
                        <h3 className={styles.detailsTitle}>
                          Sản phẩm tùy chỉnh theo danh mục
                        </h3>
                        {Object.entries(orderData.selectedCategoryProducts).map(
                          ([categoryId, products]) => {
                            const category = categoryDetails.get(categoryId);
                            return (
                              <div
                                key={categoryId}
                                className={styles.categoryGroup}
                              >
                                <h4 className={styles.categoryTitle}>
                                  {category?.name || `Danh mục ${categoryId}`}
                                </h4>
                                <ul className={styles.customProductsList}>
                                  {products.map(
                                    ({ productCustomId, quantity }) => {
                                      const customProduct =
                                        productCustomDetails.get(
                                          productCustomId
                                        );
                                      return (
                                        <li
                                          key={productCustomId}
                                          className={styles.customProductItem}
                                        >
                                          <div
                                            className={styles.customProductInfo}
                                          >
                                            {customProduct?.imageUrl && (
                                              <img
                                                src={customProduct.imageUrl}
                                                alt={customProduct.name}
                                                className={
                                                  styles.customProductImage
                                                }
                                              />
                                            )}
                                            <div
                                              className={
                                                styles.customProductDetails
                                              }
                                            >
                                              <span
                                                className={
                                                  styles.customProductName
                                                }
                                              >
                                                {customProduct?.name ||
                                                  `[Sản phẩm không tồn tại]`}
                                              </span>
                                              {customProduct?.description && (
                                                <span
                                                  className={
                                                    styles.customProductDesc
                                                  }
                                                >
                                                  {customProduct.description}
                                                </span>
                                              )}
                                              {!customProduct && (
                                                <span
                                                  className={
                                                    styles.customProductDesc
                                                  }
                                                >
                                                  ID: {productCustomId}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div
                                            className={styles.customProductQty}
                                          >
                                            <span>Số lượng: {quantity}</span>
                                            {customProduct?.price && (
                                              <span
                                                className={
                                                  styles.customProductPrice
                                                }
                                              >
                                                {formatPrice(
                                                  customProduct.price
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                  {/* Multi-Item Customizations */}
                  {orderData.multiItemCustomizations &&
                    Object.keys(orderData.multiItemCustomizations).length >
                      0 && (
                      <div className={styles.detailsCard}>
                        <h3 className={styles.detailsTitle}>
                          Tùy chỉnh nhiều sản phẩm
                        </h3>
                        {Object.entries(orderData.multiItemCustomizations).map(
                          ([itemIndex, itemCustoms]) => (
                            <div
                              key={itemIndex}
                              className={styles.multiItemGroup}
                            >
                              <h4 className={styles.multiItemTitle}>
                                Sản phẩm #{parseInt(itemIndex) + 1}
                              </h4>
                              {Object.entries(itemCustoms).map(
                                ([categoryId, products]) => {
                                  const category =
                                    categoryDetails.get(categoryId);
                                  return (
                                    <div
                                      key={categoryId}
                                      className={styles.categoryGroup}
                                    >
                                      <h5 className={styles.categorySubtitle}>
                                        {category?.name ||
                                          `Danh mục ${categoryId}`}
                                      </h5>
                                      <ul className={styles.customProductsList}>
                                        {products.map(
                                          ({ productCustomId, quantity }) => {
                                            const customProduct =
                                              productCustomDetails.get(
                                                productCustomId
                                              );
                                            return (
                                              <li
                                                key={productCustomId}
                                                className={
                                                  styles.customProductItem
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.customProductInfo
                                                  }
                                                >
                                                  {customProduct?.imageUrl && (
                                                    <img
                                                      src={
                                                        customProduct.imageUrl
                                                      }
                                                      alt={customProduct.name}
                                                      className={
                                                        styles.customProductImage
                                                      }
                                                    />
                                                  )}
                                                  <div
                                                    className={
                                                      styles.customProductDetails
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.customProductName
                                                      }
                                                    >
                                                      {customProduct?.name ||
                                                        `[Sản phẩm không tồn tại]`}
                                                    </span>
                                                    {customProduct?.description && (
                                                      <span
                                                        className={
                                                          styles.customProductDesc
                                                        }
                                                      >
                                                        {
                                                          customProduct.description
                                                        }
                                                      </span>
                                                    )}
                                                    {!customProduct && (
                                                      <span
                                                        className={
                                                          styles.customProductDesc
                                                        }
                                                      >
                                                        ID: {productCustomId}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                <div
                                                  className={
                                                    styles.customProductQty
                                                  }
                                                >
                                                  <span>
                                                    Số lượng: {quantity}
                                                  </span>
                                                  {customProduct?.price && (
                                                    <span
                                                      className={
                                                        styles.customProductPrice
                                                      }
                                                    >
                                                      {formatPrice(
                                                        customProduct.price
                                                      )}
                                                    </span>
                                                  )}
                                                </div>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* Background Information */}
                  {backgrounds.length > 0 && (
                    <div className={styles.detailsCard}>
                      <h3 className={styles.detailsTitle}>
                        Background đã chọn
                      </h3>
                      {backgrounds.map((bg) => (
                        <div key={bg.id} className={styles.backgroundInfo}>
                          <div className={styles.backgroundRow}>
                            <span className={styles.productLabel}>Tên:</span>
                            <span className={styles.productValue}>
                              {bg.name || "Background"}
                            </span>
                          </div>
                          {bg.description && (
                            <div className={styles.backgroundRow}>
                              <span className={styles.productLabel}>
                                Mô tả:
                              </span>
                              <span className={styles.productValue}>
                                {bg.description}
                              </span>
                            </div>
                          )}
                          {bg.imageUrl && (
                            <div className={styles.backgroundImageWrapper}>
                              <img
                                src={bg.imageUrl}
                                alt={bg.name || "Background"}
                                className={styles.backgroundImage}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Background Form Data */}
                  {orderData.backgroundFormData &&
                    Object.keys(orderData.backgroundFormData).length > 0 && (
                      <div className={styles.detailsCard}>
                        <h3 className={styles.detailsTitle}>
                          Thông tin tùy chỉnh background
                        </h3>
                        <div className={styles.formDataList}>
                          {/* Parse the values field if it exists */}
                          {orderData.backgroundFormData.values &&
                          Array.isArray(orderData.backgroundFormData.values)
                            ? // Display field values from background config
                              orderData.backgroundFormData.values.map(
                                (fieldValue: FieldValue, index: number) => {
                                  const background = backgrounds[0]; // Assuming first background
                                  const fieldTitle = getFieldTitle(
                                    background,
                                    fieldValue.fieldId
                                  );

                                  return (
                                    <div
                                      key={index}
                                      className={styles.formDataItem}
                                    >
                                      <span className={styles.formDataLabel}>
                                        {fieldTitle}:
                                      </span>
                                      <span className={styles.formDataValue}>
                                        {formatFieldValue(fieldValue.value)}
                                        {fieldValue.otherValue &&
                                          ` (${fieldValue.otherValue})`}
                                      </span>
                                    </div>
                                  );
                                }
                              )
                            : // Display other background form data
                              Object.entries(orderData.backgroundFormData).map(
                                ([key, value]) => {
                                  if (key === "backgroundId") {
                                    const background = backgrounds.find(
                                      (bg) => bg.id === value
                                    );
                                    return (
                                      <div
                                        key={key}
                                        className={styles.formDataItem}
                                      >
                                        <span className={styles.formDataLabel}>
                                          Background:
                                        </span>
                                        <span className={styles.formDataValue}>
                                          {background?.name || value}
                                        </span>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={key}
                                      className={styles.formDataItem}
                                    >
                                      <span className={styles.formDataLabel}>
                                        {key}:
                                      </span>
                                      <span className={styles.formDataValue}>
                                        {formatFieldValue(value)}
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                        </div>
                      </div>
                    )}
                </>
              )}

              {/* Price Summary */}
              <div className={styles.summaryCard}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tạm tính:</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(calculateSubtotal())}
                  </span>
                </div>

                {/* Shipping Options */}
                <div className={styles.shippingSection}>
                  <div className={styles.shippingSectionHeader}>
                    <FaTruck className={styles.summaryIcon} />
                    <span className={styles.summaryLabel}>Phí vận chuyển:</span>
                  </div>

                  {loadingShipping ? (
                    <div className={styles.loadingText}>Đang tải...</div>
                  ) : availableShippingOptions.length > 0 ? (
                    <div className={styles.shippingSelectWrapper}>
                      <select
                        value={selectedShipping?.id || ""}
                        onChange={(e) => handleShippingChange(e.target.value)}
                        className={styles.shippingSelect}
                      >
                        {availableShippingOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.shippingType} - {option.area} (
                            {option.estimatedDeliveryTime}) -{" "}
                            {formatPrice(Number(option.shippingFee))}
                          </option>
                        ))}
                      </select>
                      {selectedShipping && (
                        <div className={styles.shippingInfo}>
                          <div className={styles.shippingFeeDisplay}>
                            {formatPrice(Number(selectedShipping.shippingFee))}
                          </div>
                          {selectedShipping.notesOrRemarks && (
                            <div className={styles.shippingNote}>
                              {selectedShipping.notesOrRemarks}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.noShippingText}>
                      {`Phí ship mặc định: ${formatPrice(shippingFee)}`}
                    </div>
                  )}
                </div>

                {appliedPromotion && (
                  <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                    <span className={styles.summaryLabel}>
                      <FaTag className={styles.summaryIcon} />
                      Giảm giá ({appliedPromotion.promoCode}):
                    </span>
                    <span className={styles.summaryValue}>
                      -{formatPrice(calculateDiscount())}
                    </span>
                  </div>
                )}

                <div className={styles.summaryDivider} />

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span className={styles.summaryLabel}>Tổng cộng:</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className={styles.promoSection}>
                <h3 className={styles.promoTitle}>
                  <FaTag /> Mã giảm giá
                </h3>
                {!appliedPromotion ? (
                  <div className={styles.promoInputGroup}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleApplyPromo()
                      }
                      placeholder="Nhập mã giảm giá"
                      className={styles.promoInput}
                      disabled={promoLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className={styles.promoButton}
                      disabled={promoLoading || !promoCode.trim()}
                    >
                      {promoLoading ? "Đang kiểm tra..." : "Áp dụng"}
                    </button>
                  </div>
                ) : (
                  <div className={styles.appliedPromo}>
                    <div className={styles.appliedPromoInfo}>
                      <span className={styles.appliedPromoCode}>
                        {appliedPromotion.promoCode}
                      </span>
                      <span className={styles.appliedPromoDesc}>
                        {appliedPromotion.description}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className={styles.removePromoButton}
                    >
                      Xóa
                    </button>
                  </div>
                )}
                {promoError && (
                  <div className={styles.promoError}>{promoError}</div>
                )}
              </div>

              <div className={styles.noteBox}>
                <p className={styles.noteTitle}>Lưu ý:</p>
                <ul className={styles.noteList}>
                  <li>Đơn hàng sẽ được xử lý trong vòng 24h</li>
                  <li>
                    Chúng tôi sẽ liên hệ qua email hoặc điện thoại để xác nhận
                  </li>
                  <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                </ul>
              </div>

              {/* Submit Button */}
              {submitError && (
                <div className={styles.submitError}>{submitError}</div>
              )}

              <div className={styles.actionButtons}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={styles.addToCartBtn}
                  disabled={isSubmitting}
                >
                  <FaShoppingCart /> Thêm vào giỏ hàng
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

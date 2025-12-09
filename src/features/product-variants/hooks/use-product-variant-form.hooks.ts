import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
} from "../mutations";
import { ProductVariantValidator } from "../utils";
import { productCustomsService } from "../services/product-customs.service";
import type {
  ProductVariantWithProduct,
  IProductVariantFormData,
  IProductVariantFormHook,
} from "../types";

interface UseProductVariantFormProps {
  variant?: ProductVariantWithProduct;
  onSuccess?: (variant: ProductVariantWithProduct) => void;
}

/**
 * Custom hook for managing product variant form
 * Following Single Responsibility Principle
 */
export const useProductVariantForm = ({
  variant,
  onSuccess,
}: UseProductVariantFormProps = {}): IProductVariantFormHook => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!variant;

  const createMutation = useCreateProductVariantMutation();
  const updateMutation = useUpdateProductVariantMutation();

  const form = useForm<IProductVariantFormData>({
    defaultValues: {
      productId: "",
      name: "",
      description: "",
      price: 0,
      endow: "",
      option: "",
      config: "",
      status: "active" as const,
    },
  });

  const { reset } = form;

  // Reset form when variant changes
  useEffect(() => {
    const resetForm = async () => {
      if (variant) {
        // Populate custom products with full data
        const populatedEndow = await (async () => {
          if (!variant.endow) return "";

          try {
            if (typeof variant.endow === "string") {
              // Legacy string format - wrap in EndowSystem
              return JSON.stringify({
                endows: [variant.endow],
                customProducts: [],
              });
            } else if (variant.endow.items || variant.endow.customProducts) {
              // Backend EndowSystem format - convert to frontend format
              const endows = variant.endow.items
                ? variant.endow.items.map((item: any) => item.content)
                : [];

              let customProducts = variant.endow.customProducts || [];

              // Fetch full product custom data for each custom product
              if (customProducts.length > 0) {
                const populatedProducts = await Promise.allSettled(
                  customProducts.map(async (cp: any) => {
                    try {
                      const productCustom =
                        await productCustomsService.getProductCustomById(
                          cp.productCustomId
                        );
                      return {
                        ...cp,
                        productCustom,
                      };
                    } catch (error) {
                      console.error(
                        `Failed to fetch product custom ${cp.productCustomId}:`,
                        error
                      );
                      return cp; // Return original if fetch fails
                    }
                  })
                );

                customProducts = populatedProducts
                  .filter(
                    (result): result is PromiseFulfilledResult<any> =>
                      result.status === "fulfilled"
                  )
                  .map((result) => result.value);
              }

              return JSON.stringify({
                endows,
                customProducts,
              });
            }
          } catch (error) {
            console.error("Error processing endow data:", error);
            return "";
          }

          return "";
        })();

        reset({
          productId: variant.productId,
          name: variant.name,
          description: variant.description || "",
          price: variant.price,
          endow: populatedEndow,
          option: variant.option ? JSON.stringify(variant.option, null, 2) : "",
          config: variant.config ? JSON.stringify(variant.config, null, 2) : "",
          status: variant.status || "active",
        });
      } else {
        reset({
          productId: "",
          name: "",
          description: "",
          price: 0,
          endow: "",
          option: "",
          config: "",
          status: "active",
        });
      }
    };

    resetForm();
  }, [variant, reset]);

  // Submit handler
  const onSubmit = async (data: IProductVariantFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const validation = ProductVariantValidator.validateForm(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // Transform form data for API
      const submitData = {
        productId: data.productId,
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: Number(data.price),
        endow: (() => {
          if (
            !data.endow ||
            typeof data.endow !== "string" ||
            data.endow.trim() === ""
          ) {
            return undefined;
          }

          try {
            const frontendEndowSystem = JSON.parse(data.endow);
            const endows = frontendEndowSystem.endows || [];
            const customProducts = frontendEndowSystem.customProducts || [];

            // Convert frontend format to backend format
            if (endows.length === 0 && customProducts.length === 0) {
              return undefined;
            }

            const result: any = {};

            // Add text endows if any
            if (endows.length > 0) {
              result.items = endows.map((text: string, index: number) => ({
                id: `endow_${Date.now()}_${index}`,
                content: text,
                isActive: true,
                priority: index + 1,
              }));
            }

            // Add custom products if any
            if (customProducts.length > 0) {
              result.customProducts = customProducts.map((product: any) => ({
                id: product.id,
                productCustomId: product.productCustomId,
                quantity: product.quantity,
                isActive: product.isActive,
                priority: product.priority,
              }));
            }

            // Add display settings
            result.displaySettings = {
              showAsList: true,
              prefix: "• ",
              showInactive: false,
            };

            return result;
          } catch {
            return undefined;
          }
        })(),
        option:
          data.option &&
          typeof data.option === "string" &&
          data.option.trim() !== ""
            ? JSON.parse(data.option)
            : undefined,
        config:
          data.config &&
          typeof data.config === "string" &&
          data.config.trim() !== ""
            ? JSON.parse(data.config)
            : undefined,
        status: data.status,
      };

      let result: ProductVariantWithProduct;

      if (isEditing && variant) {
        // Update existing variant
        const { productId, ...updateData } = submitData; // Remove productId for update
        result = await updateMutation.mutateAsync({
          id: variant.id,
          data: updateData,
        });
      } else {
        // Create new variant
        result = await createMutation.mutateAsync(submitData);
      }

      onSuccess?.(result);
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form function
  const validateForm = (data: IProductVariantFormData) => {
    return ProductVariantValidator.validateForm(data);
  };

  return {
    form,
    isSubmitting:
      isSubmitting || createMutation.isPending || updateMutation.isPending,
    isEditing,
    onSubmit,
    validateForm,
    reset: () => {
      reset();
      setIsSubmitting(false);
    },
  };
};

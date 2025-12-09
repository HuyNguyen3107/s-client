import { useProduct as useProductBase } from "../../products/queries/product.queries";

export const useProduct = (id: string, enabled = true) => {
  // only enable the underlying query when id is truthy
  return useProductBase(id, Boolean(id) && enabled);
};

export default useProduct;

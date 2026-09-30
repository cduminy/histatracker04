import { useProductStore } from "@/state/useProductStore";

export function useProducts() {
  const products = useProductStore((state) => state.products);
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const selectProduct = useProductStore((state) => state.selectProduct);
  const reloadProducts = useProductStore((state) => state.reloadProducts);
  return { products, loading: false, selectedProduct, selectProduct, reloadProducts };
}
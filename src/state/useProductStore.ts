import { create } from "zustand";
import { loadProductBriefings } from "@/services/products";
import type { ProductBriefing } from "@/utils/types";

interface ProductState {
  products: ProductBriefing[];
  selectedProduct: string | null;
  selectProduct: (productName: string | null) => void;
  reloadProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: loadProductBriefings(),
  selectedProduct: null,
  selectProduct: (selectedProduct) => set({ selectedProduct }),
  reloadProducts: () => set({ products: loadProductBriefings() }),
}));
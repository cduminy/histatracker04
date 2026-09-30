import product1 from "@/data/briefing/histastack_product1.json";
import product2 from "@/data/briefing/histastack_product2.json";
import product3 from "@/data/briefing/histastack_product3.json";
import product4 from "@/data/briefing/histastack_product4.json";
import product5 from "@/data/briefing/histastack_product5.json";
import type { ProductBriefing } from "@/utils/types";

const briefings: ProductBriefing[] = [product1, product2, product3, product4, product5];

export function loadProductBriefings(): ProductBriefing[] {
  return briefings.map((product) => ({ ...product, ingredients: [...product.ingredients] }));
}
import {
  CATEGORY_ICON_MAP,
  DEFAULT_CATEGORY_ICON,
  FALLBACK_ICON,
} from "@/constants/categoryIcons";


export const getCategoryIcon = (categoryName: string): string => {
  if (!categoryName) return FALLBACK_ICON;

  const name = categoryName.toLowerCase();

  const matchedCategory = CATEGORY_ICON_MAP.find((item) =>
    item.keywords.some((keyword) => name.includes(keyword)),
  );

  return matchedCategory ? matchedCategory.icon : DEFAULT_CATEGORY_ICON;
};

export const CATEGORIES = [
  { value: "BUKU", label: "Buku" },
  { value: "PAKAIAN", label: "Pakaian" },
  { value: "ELEKTRONIK", label: "Elektronik" },
  { value: "ALAT_TULIS", label: "Alat Tulis" },
  { value: "AKSESORIS", label: "Aksesoris" },
  { value: "LAINNYA", label: "Lainnya" },
] as const;

export const ITEM_TYPES = [
  { value: "BARTER", label: "Barter" },
  { value: "DONASI", label: "Donasi" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type ItemTypeValue = (typeof ITEM_TYPES)[number]["value"];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

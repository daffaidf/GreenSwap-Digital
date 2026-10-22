// Normalisasi nomor WhatsApp ke format internasional tanpa "+" dan tanpa nol
// di depan, karena wa.me (lihat waLink di components/RequestCard.tsx) hanya
// menerima format tersebut. Contoh: 081234567890 -> 6281234567890.

export const DEFAULT_COUNTRY_CODE = "62";

export function normalizeWaNumber(input: string): string | null {
  const digits = input.replace(/[^0-9]/g, "");
  if (!digits) return null;

  let normalized: string;
  if (digits.startsWith("620")) {
    // "+6208..." -> buang nol di belakang kode negara
    normalized = `${DEFAULT_COUNTRY_CODE}${digits.slice(3)}`;
  } else if (digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    normalized = digits;
  } else if (digits.startsWith("0")) {
    normalized = `${DEFAULT_COUNTRY_CODE}${digits.slice(1)}`;
  } else if (digits.startsWith("8")) {
    normalized = `${DEFAULT_COUNTRY_CODE}${digits}`;
  } else {
    normalized = digits;
  }

  // E.164: maksimal 15 digit, dan nomor Indonesia 10-13 digit
  if (normalized.length < 10 || normalized.length > 15) return null;

  return normalized;
}

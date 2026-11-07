// Bộ lọc từ bậy dùng chung cho các game BH Studio (bản gốc: hp-game-shop/loc-tu-bay/, chép sang từng game).
// Mục tiêu: KHÔNG hiện / KHÔNG đọc tên hay bình luận bậy lên LIVE (tránh bị TikTok khoá / sập live).
// Bắt được: có dấu / không dấu, viết hoa, chữ lặp (đđịịt), chèn dấu chấm gạch (đ.ị.t, l-ồ-n), số thay chữ (l0n, d1t, c4c),
// teencode (dm, vcl, dcm…), tiếng Anh, cụm từ (địt mẹ, óc chó…). Cố ý KHÔNG bắt chữ thường: lớn, lồng, các, buổi, đeo, đĩa, đụng…
// Thêm từ: thêm vào các danh sách dưới (viết thường).

// 1) Từ có dấu: khớp nguyên từ (sau khi gộp chữ lặp)
const ACCENTED = new Set([
  'lồn', 'lìn', 'cặc', 'buồi', 'đéo', 'địt', 'đụ', 'đĩ', 'cứt', 'dái', 'đù', 'nứng', 'chịch', 'đjt', 'đcm', 'đkm', 'đm', 'đmm', 'đmvl', 'vãi', 'vl',
]);
// 2) Từ không dấu / teencode / tiếng Anh: khớp nguyên từ (đã bỏ dấu)
const PLAIN = new Set([
  'dm', 'dmm', 'dcm', 'dcmm', 'dkm', 'dmvl', 'vcl', 'vkl', 'vcc', 'vcd', 'clgt', 'cmm', 'clm', 'loz', 'lozz', 'djt', 'dit', 'ditme', 'ditmemay', 'ditconme',
  'dume', 'duma', 'dumame', 'dumemay', 'cailon', 'concac', 'oc cho', 'du ma', 'dit me', 'dit con me', 'deo me', 'du me',
  'fuck', 'fck', 'fuk', 'fucking', 'fuckyou', 'shit', 'bitch', 'dick', 'pussy', 'porn', 'porno', 'nude', 'nudes', 'sex', 'sexy', 'xxx', 'cave', 'horny', 'cock', 'cum', 'whore', 'slut',
]);
// 3) Cụm từ có dấu (khớp trong câu đã gộp khoảng trắng)
const PHRASES = [
  'địt mẹ', 'đụ má', 'đù má', 'đéo mẹ', 'con đĩ', 'óc chó', 'chó đẻ', 'mặt lồn', 'con lồn', 'cái lồn', 'con cặc', 'đờ mờ', 'đầu buồi',
  'ma túy', 'ma tuý', 'thuốc lắc', 'cần sa', 'cá độ', 'lô đề', 'cờ bạc', 'lừa đảo',
];
// 4) Dò trong chuỗi đã bỏ hết ký tự ngăn cách (bắt đ.ị.t, l-ồ-n…): chỉ những mẫu không lẫn với chữ thường
const JOINED_ACCENTED = [/cặc/, /buồi/, /địt/, /đéo/, /lồn(?!g)/, /đĩ(?![anế])/, /đụ(?![a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/];
const JOINED_PLAIN = ['ditme', 'ditcon', 'dumemay', 'dumamay', 'dcm', 'dkm', 'dmm', 'vcl', 'vkl', 'fuck', 'bitch', 'pussy', 'porn', 'concac'];
// 5) Từ "nhạy cảm" khi bỏ dấu: chỉ coi là bậy nếu người viết cố tình thay chữ bằng số/ký hiệu (l0n, c4c, d1t, đ!t)
const LEET_STEMS = new Set(['lon', 'cac', 'buoi', 'deo', 'dit', 'du', 'di', 'cut', 'dai', 'loz', 'fuck', 'fuk', 'sex', 'dm', 'dmm', 'vcl', 'dcm']);
const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', 9: 'g', '@': 'a', $: 's', '!': 'i', '|': 'l', '€': 'e' };

const nfc = (s) => String(s || '').normalize('NFC').toLowerCase();
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
const squeeze = (s) => s.replace(/(.)\1+/gu, '$1'); // đđịịịt → địt, fuuuck → fuck
const LETTER = /[\p{L}\p{M}]/u;

function tokenBad(raw) {
  const t = squeeze(raw);
  if (ACCENTED.has(t)) return true;
  const f = fold(t);
  if (PLAIN.has(f) || PLAIN.has(fold(raw))) return true; // xxx, dmm (không gộp chữ lặp)
  if (/[0-9@$!|€]/.test(raw) && /\p{L}/u.test(raw)) { // l0n, c4c, d1t
    const de = squeeze(fold(raw.replace(/[0-9@$!|€]/g, (c) => LEET[c] || c)));
    if (LEET_STEMS.has(de) || PLAIN.has(de)) return true;
  }
  return false;
}

export function hasBad(text) {
  const s = nfc(text);
  if (!s.trim()) return false;
  const tokens = s.split(/[^\p{L}\p{M}\p{N}@$!|€]+/u).filter(Boolean);
  if (tokens.some(tokenBad)) return true;
  const spaced = ` ${squeeze(s.replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')).trim()} `;
  if (PHRASES.some((p) => spaced.includes(` ${p} `))) return true;
  const plainSpaced = fold(spaced);
  if ([...PLAIN].some((w) => w.includes(' ') && plainSpaced.includes(` ${w} `))) return true;
  const joined = squeeze([...s].filter((c) => LETTER.test(c)).join(''));
  if (JOINED_ACCENTED.some((re) => re.test(joined))) return true;
  const joinedPlain = squeeze(fold(s.replace(/[0-9@$!|€]/g, (c) => LEET[c] || c)).replace(/[^a-z]/g, ''));
  return JOINED_PLAIN.some((w) => joinedPlain.includes(w));
}

// Từ Bảo chốt 07/11: TÊN có các từ này (chê ngoại hình, xúc phạm, tục) → che thành *** và MC không đọc.
// Chỉ áp cho tên (bình luận như "sống tới già" vẫn hiện). Khớp nguyên từ, có dấu đúng như viết (cao ≠ cáo, chó ≠ cho).
const NAME_WORDS = new Set([
  'béo', 'gầy', 'mập', 'ốm', 'lùn', 'cao', 'trắng', 'đen', 'xấu', 'già', 'hói', 'sẹo', 'què', 'mù', 'điếc', 'câm', 'ngu', 'điên', 'khùng', 'dở', 'đần', 'ngốc',
  'chó', 'lợn', 'heo', 'đĩ', 'cave', 'đụ', 'địt', 'lồn', 'cặc', 'buồi', 'cứt',
  'fat', 'ugly', 'stupid', 'idiot', 'fuck', 'shit', 'bitch', 'sex', 'sexy', 'dick', 'pussy',
]);
export function nameBad(name) {
  const s = nfc(name);
  const tokens = s.split(/[^\p{L}\p{M}\p{N}]+/u).filter(Boolean);
  return tokens.some((t) => NAME_WORDS.has(t) || NAME_WORDS.has(squeeze(t))) || hasBad(s);
}

// Tên người xem: có từ cấm → '***' (hiện *** trên màn hình; giọng đọc tự bỏ ***)
export function cleanName(name, fallback = '***') {
  const n = String(name || '').trim();
  return !n || nameBad(n) ? fallback : n;
}

// Câu chữ (bình luận, câu đọc): bỏ từ bậy; còn bậy (cụm từ, chèn ký tự) thì trả về thay thế
export function cleanText(text, replacement = '❤️') {
  const s = String(text || '');
  if (!hasBad(s)) return s;
  const out = s.split(/(\s+)/).map((w) => (w.trim() && hasBad(w) ? '***' : w)).join('');
  return hasBad(out) ? replacement : out;
}

// Câu đưa vào giọng đọc: bỏ hẳn từ bậy (không đọc "sao sao"); còn bậy thì trả '' = không đọc
export function speakSafe(text) {
  const s = String(text || '').replace(/\*+/g, ' ').replace(/\s+([,.!?])/g, '$1').replace(/\s+/g, ' ').trim(); // tên đã che *** → bỏ, MC không đọc
  if (!hasBad(s)) return s;
  const out = s.split(/(\s+)/).filter((w) => !(w.trim() && hasBad(w))).join('').replace(/\s+/g, ' ').trim();
  return hasBad(out) ? '' : out;
}

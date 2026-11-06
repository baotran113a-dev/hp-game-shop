# HP Media Game — website bán game + cấp mã kích hoạt

Bảo (HP Media BMT, không phải dân kỹ thuật) bán game live TikTok (Câu Cá Online, sau này thêm game khác) theo **thuê tháng**.
Trả lời tiếng Việt, ngắn, có ảnh.

## Cách bán (Bảo đã chốt 04/11)
Khách tải file cài (Windows) → mở app lấy **mã máy** → web hiện QR chuyển khoản (nội dung `<GAME> <mãmáy>`) → nhắn Zalo →
Bảo kiểm tra tiền, mở `CAP-MA.bat` cấp mã → gửi mã qua Zalo → khách dán vào app.

## File
- `docs/` = website tĩnh (GitHub Pages): `index.html` đọc `games.json` (`shop`: tên, zalo, bankBin/bankAccount/bankName/accountName cho QR img.vietqr.io; `games`: id, ảnh, tính năng, `plans` [{days,label,price}], `download`, `version`).
  Thêm game = thêm 1 mục vào `games` + ảnh vào `docs/img/`. App mở web với `?game=<id>&may=<mã máy>` là tự mở hộp mua.
- Từ 06/11 web mang tên **BH Studio** (logo `docs/img/logo.webp`, tím bạc; không ghi "HP Media"; bố cục tham khảo hpvn.media nhưng không chép chữ/số liệu), tuyển Idol/NPC TikTok LIVE + bán game.
  **Nhiều trang**: index (trang chủ), quyen-loi, idol (chính sách NPC BMT + lưới creator), dao-tao (lộ trình 7 ngày), game (bán game + hộp mua QR), hoi-dap.
  Mỗi trang chỉ là khung `<body data-page=...>`; nội dung vẽ bằng `docs/assets/app.js` từ `docs/site.json` (mỗi trang 1 khóa: home/perks/idol/training/game/faq), CSS chung `docs/assets/style.css`.
  `index.html?game=..&may=..` (app mở) tự chuyển sang `game.html`. Ảnh creator `docs/img/creators/<id>.jpg` (lấy từ TikTok LIVE Backstage, 100px), danh sách ở `site.json` idol.list.
  `docs/admin.html` = trang admin trên web: mật khẩu + chìa GitHub fine-grained (Contents của repo này) mã hóa trong máy; form tự sinh theo JSON (nhãn ở biến `L`), tải ảnh `docs/img/up-*`, xem trước `?preview=1`, đăng = commit qua GitHub API.
  `docs/noi-bo.html` = trang Nội bộ, mỗi mục 1 mật khẩu: nội dung chữ thường ở `noi-bo/*.md` (KHÔNG lên git), web chỉ chứa bản mã `docs/noi-bo/<id>.enc.json` tạo bằng `node ma-hoa-noi-bo.mjs [id]` (AES-GCM + PBKDF2). Không bao giờ ghi mật khẩu vào file/git/bàn giao.
  Không làm hỏng các trường app đọc (`games[].version/download/changes`).
- `cap-ma/server.mjs` + `index.html`: công cụ cấp mã (chỉ 127.0.0.1:8690), ký Ed25519 bằng `khoa-rieng/private.pem`; lưu khách ở `du-lieu/khach-hang.json`.
  Còn hạn thì cộng tiếp từ ngày hết hạn cũ. Số ngày tính cả hôm nay.
- `khoa-rieng/` và `du-lieu/` **không lưu git, không bao giờ đưa lên mạng**. Khóa công khai tương ứng nằm trong `license.mjs` của từng game.
- Xem thử web: `node xem-web.mjs` (8691). Game dùng chung khóa: game mới copy `cau-ca-online/license.mjs`, đặt `game` = id trong games.json.

## Quy tắc
- Không bịa giá/số tài khoản: chỉ điền khi Bảo đưa. Đăng web/file cài lên GitHub công khai phải hỏi Bảo trước.
- Kho `hpmedia-posts` chỉ để ảnh/video bài đăng — không để file cài ở đó.

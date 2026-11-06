# HP Media Game — website bán game + cấp mã kích hoạt

Bảo (HP Media BMT, không phải dân kỹ thuật) bán game live TikTok (Câu Cá Online, sau này thêm game khác) theo **thuê tháng**.
Trả lời tiếng Việt, ngắn, có ảnh.

## Cách bán (Bảo đã chốt 04/11)
Khách tải file cài (Windows) → mở app lấy **mã máy** → web hiện QR chuyển khoản (nội dung `<GAME> <mãmáy>`) → nhắn Zalo →
Bảo kiểm tra tiền, mở `CAP-MA.bat` cấp mã → gửi mã qua Zalo → khách dán vào app.

## File
- `docs/` = website tĩnh (GitHub Pages): `index.html` đọc `games.json` (`shop`: tên, zalo, bankBin/bankAccount/bankName/accountName cho QR img.vietqr.io; `games`: id, ảnh, tính năng, `plans` [{days,label,price}], `download`, `version`).
  Thêm game = thêm 1 mục vào `games` + ảnh vào `docs/img/`. App mở web với `?game=<id>&may=<mã máy>` là tự mở hộp mua.
- Từ 06/11 web mang tên **BSMEDIA** (không ghi "HP Media"), hướng tuyển Idol TikTok LIVE + bán game. Mọi chữ/ảnh trang chủ nằm trong `docs/site.json`.
  `docs/admin.html` = trang admin trên web: đăng nhập mật khẩu (khóa chìa GitHub fine-grained, chỉ quyền Contents của repo này, lưu mã hóa trong máy),
  sửa site.json + games.json (form tự sinh theo JSON), tải ảnh lên `docs/img/up-*.jpg`, xem trước `index.html?preview=1`, đăng = commit qua GitHub API.
  Thêm mục mới vào site.json thì thêm nhãn tiếng Việt vào biến `L` trong admin.html. Không làm hỏng các trường app đọc (`games[].version/download/changes`).
- `cap-ma/server.mjs` + `index.html`: công cụ cấp mã (chỉ 127.0.0.1:8690), ký Ed25519 bằng `khoa-rieng/private.pem`; lưu khách ở `du-lieu/khach-hang.json`.
  Còn hạn thì cộng tiếp từ ngày hết hạn cũ. Số ngày tính cả hôm nay.
- `khoa-rieng/` và `du-lieu/` **không lưu git, không bao giờ đưa lên mạng**. Khóa công khai tương ứng nằm trong `license.mjs` của từng game.
- Xem thử web: `node xem-web.mjs` (8691). Game dùng chung khóa: game mới copy `cau-ca-online/license.mjs`, đặt `game` = id trong games.json.

## Quy tắc
- Không bịa giá/số tài khoản: chỉ điền khi Bảo đưa. Đăng web/file cài lên GitHub công khai phải hỏi Bảo trước.
- Kho `hpmedia-posts` chỉ để ảnh/video bài đăng — không để file cài ở đó.

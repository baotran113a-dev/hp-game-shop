# Bàn giao — web BH Studio (hp-game-shop/docs)

## Trạng thái (06/11/2026)
- Web đã làm lại thành **BH Studio** (logo `docs/img/logo.webp` từ `Downloads\Logo 3D BH Studio Tím Bạc.png`, màu tím bạc, font Lexend + Be Vietnam Pro).
  Commit cục bộ mới nhất `4e84673` (web nhiều trang). **ĐÃ ĐĂNG** web thật 06/11 (Bảo đồng ý), kiểm tra 6 trang + link app mở hộp mua OK.
- Nội dung mọi trang trong `docs/site.json` (đã có 97 creator, đã xóa _list.json và tài khoản hpmedia.bmt khỏi lưới); `docs/admin.html` = trang admin (mật khẩu + chìa GitHub fine-grained mã hóa trong máy, sửa site.json/games.json, tải ảnh, xem trước `?preview=1`). Chưa thử đăng nhập thật (cần Bảo tạo chìa).
- Xem thử: `preview_start` "shop-web" (8691). Khung browser hay bị ẩn → chụp bằng Edge headless (`msedge --headless=new --screenshot=... --window-size=1280,6400 --user-data-dir=D:\video-ai\.tmp\edge-shot`), ảnh điện thoại dùng iframe 390px. Ảnh chụp ở `anh-thu/` (git bỏ qua).

## Yêu cầu 06/11 (ĐÃ LÀM + ĐÃ ĐĂNG)
1. Tách web thành **các trang (thẻ) riêng**, không lộn xộn: Trang chủ (chỉ giới thiệu), Quyền lợi, Idol/Creator (giống hpvn.media/npc-creator: lưới creator có ảnh + ID, lọc), Các bước đào tạo (lộ trình), Game (bán game, hộp mua QR), Hỏi đáp/Liên hệ.
   App Câu Cá mở `.../hp-game-shop/?game=cauca&may=...` → trang chủ phải chuyển tiếp sang trang game giữ tham số.
2. Thêm đủ nội dung, tham khảo hpvn.media/quyen-loi và /npc-creator (viết lại, KHÔNG chép; không nhận các thứ riêng của HP Media như App HP Media, MFVN, Sony, báo chí).
   Chính sách NPC chi nhánh BMT (thật): thu nhập 10–50 triệu (lương + chuyên cần + hoa hồng), nghỉ 4 ngày/tháng, 130 giờ/tháng, BHXH, từ 18 tuổi.
3. Ảnh creator + ID: đã lấy 98 creator từ TikTok LIVE Backstage (Chrome của Bảo) → `docs/img/creators/<id>.jpg` (100x100), danh sách thứ tự `docs/img/creators/_list.json` (name, rank; không công bố số kim cương). Xóa `_list.json` khỏi docs sau khi đưa vào site.json.
4. Mạng xã hội: Fanpage https://www.facebook.com/Hpmediabmt , TikTok https://www.tiktok.com/@hpmedia.bmt
5. Trang admin phải sửa được nội dung mọi trang (thêm nhãn vào biến `L`).

## Lưu ý
- Không làm hỏng `games.json` (app đọc `games[].version/download/changes`).
- Git tác giả `Bao <baotran113a@gmail.com>`. Máy không có `gh`.

## 06/11 chiều — chuyển động 3D (ĐÃ ĐĂNG, Bảo đồng ý)
- `docs/assets/fx.js` + `fx.css` (gắn vào cả 6 trang, three.js r128 từ cdnjs): nền 3D khối pha lê tím bạc + hạt sáng xoay theo chuột/trôi theo cuộn; thẻ nghiêng 3D + vệt sáng; nút hút theo chuột; con trỏ vòng tròn + tia lấp lánh; thanh tiến độ cuộn; tiêu đề trôi; chữ chạy nghiêng theo tốc độ cuộn; hiện ra kiểu lật 3D.
- Máy Bảo bật "giảm chuyển động" của Windows → đã bỏ hết điều kiện prefers-reduced-motion (Bảo muốn luôn có hiệu ứng).
- Việc tiếp: Bảo xem http://localhost:8691 → đồng ý thì `git push origin main`.

## Thẻ "Nội bộ" có mật khẩu (06/11 tối) — ĐÃ LÀM, CHƯA CÓ MẬT KHẨU THẬT
- Trang `docs/noi-bo.html` (menu "Nội bộ", noindex), 2 mục, mỗi mục 1 mật khẩu: `idol-tai-nha` (chép từ hpvn.media/creator-2026, "HP Media" đổi thành "công ty") và `npc-cong-ty` (bảng A1–A20).
- Nguồn chữ thường: `noi-bo/thuong-idol-tai-nha.md`, `noi-bo/chinh-sach-npc-tai-cong-ty.md` (gitignore `/noi-bo/` — có dấu / đầu để KHÔNG bỏ qua `docs/noi-bo/`). Ghi chú trong `<!-- -->` bị bỏ khi mã hóa.
  Cú pháp md: #/##/### tiêu đề, bảng `|`, `- ` danh sách, `::: nhãn | số to | mô tả` = ô thống kê, `> !` = cảnh báo đỏ, `>` = khung ghi chú.
- Mã hóa: `node ma-hoa-noi-bo.mjs [id]` (hỏi pass ẩn, gõ 2 lần, ≥ 8 ký tự; hoặc biến NOIBO_PASS_IDOL_TAI_NHA / NOIBO_PASS_NPC_CONG_TY) → `docs/noi-bo/<id>.enc.json`. AES-256-GCM, PBKDF2-SHA256 600k vòng, salt/iv ngẫu nhiên, tự kiểm tra giải mã.
  Trình duyệt giải mã bằng WebCrypto (`nbOpen`/`md2html` trong app.js), nhớ khóa trong sessionStorage (nút "Khóa lại").
- Đã thử: sai pass báo lỗi, đúng pass mở bảng (24 dòng NPC, 41 dòng idol), tải lại vẫn mở. Ảnh: `anh-thu/noibo-*.png`.
- 06/11: đã mã hóa bằng 2 mật khẩu thật Bảo đưa (không ghi ở đây) và commit. Bảo biết là pass ngắn (< 10 ký tự) dễ bị dò; muốn đổi thì chạy lại script. **Chưa push — hỏi Bảo trước.**
- Admin chỉ sửa được tiêu đề/mô tả 2 mục (site.json `noibo`); nội dung mã hóa phải nhờ Claude sửa file md + chạy script.
- Chống copy (06/11, Bảo yêu cầu): `noCopy()` cuối app.js + CSS cuối style.css — mọi trang tắt bôi đen/chuột phải/copy/kéo ảnh/Ctrl+C,S,P,U,F12, xóa clipboard khi bấm PrintScreen, in ra trang trắng; ô nhập vẫn dán được. Trang Nội bộ: in chìm "BH STUDIO · NỘI BỘ" + làm mờ nội dung khi rời cửa sổ/đổi tab. Không chặn hẳn được chụp màn hình/chụp bằng điện thoại (đã nói Bảo).
- Chụp ảnh khi khung browser ẩn: tạo tạm `docs/_shot.html` (iframe noi-bo.html, đặt sessionStorage khóa, ép `.rv` hiện, tắt animation `.nbd`) → Edge headless → xóa file tạm.

## Trang admin
- Bảo tạo chìa GitHub nhưng báo "Resource not accessible by personal access token" → đã hướng dẫn sửa chìa: Resource owner baotran113a-dev, Only select repositories → hp-game-shop, Contents: Read and write. Chưa biết kết quả.

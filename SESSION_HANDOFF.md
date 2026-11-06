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

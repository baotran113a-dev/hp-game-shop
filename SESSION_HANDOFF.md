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

## VIỆC TIẾP THEO (Bảo yêu cầu 06/11 tối) — thẻ "Nội bộ" có mật khẩu
Thêm 1 trang mới `noi-bo.html` (thêm vào menu `site.json` nav), trong đó 2 mục, **mỗi mục 1 mật khẩu riêng**:
1. **Chính sách thưởng Idol LIVE tại nhà (bao gồm live game)** — nội dung lấy từ https://hpvn.media/creator-2026/ (Bảo cho phép chép nguyên, đây là chính sách của công ty mẹ cho chi nhánh). Đọc trang đó bằng browser rồi đưa vào.
2. **Chính sách lương NPC — tại công ty** — dữ liệu Bảo gửi đã lưu ở `noi-bo/chinh-sach-npc-tai-cong-ty.md` (bảng mốc A1–A20 + lưu ý + lương cứng/thử việc/học việc). Thư mục `noi-bo/` đã cho vào .gitignore.
CÁCH LÀM BẮT BUỘC (web là GitHub Pages công khai):
- KHÔNG để nội dung chữ thường trên web/kho. Mã hóa mỗi mục bằng AES-GCM, khóa từ mật khẩu (PBKDF2-SHA256 ~250k vòng, salt riêng), chỉ lưu bản mã (vd `docs/noi-bo/*.enc.json`). Trang giải mã trong trình duyệt khi nhập đúng pass (có thể nhớ trong sessionStorage).
- Viết script cục bộ (node) để mã hóa từ file .md/.json trong `noi-bo/` → `docs/noi-bo/*.enc.json`; Bảo đổi nội dung/pass thì chạy lại.
- HỎI Bảo 2 mật khẩu (không tự đặt, không ghi pass vào file/git/bàn giao). Bảng hiển thị đẹp, cuộn ngang trên điện thoại, cùng giao diện tím bạc + hiệu ứng 3D.
- Trang admin hiện không sửa được 2 mục này (vì mã hóa) — nói rõ với Bảo; muốn sửa thì nhờ Claude chạy script.
- Làm xong: chụp ảnh, hỏi Bảo trước khi push.

## Trang admin
- Bảo tạo chìa GitHub nhưng báo "Resource not accessible by personal access token" → đã hướng dẫn sửa chìa: Resource owner baotran113a-dev, Only select repositories → hp-game-shop, Contents: Read and write. Chưa biết kết quả.

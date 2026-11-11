# BeautyGlow AI — Website bán mỹ phẩm

Dự án giữ phong cách giao diện BeautyGlow trong bản ZIP ban đầu (màu pastel, bố cục cửa hàng, banner, danh mục, sản phẩm và BeautyBot), đồng thời bổ sung các chức năng demo để phục vụ đồ án.

## Chức năng

- Trang chủ BeautyGlow responsive, danh mục và sản phẩm mẫu.
- Tìm kiếm theo tên/thương hiệu/mô tả; lọc danh mục, thương hiệu, mức giá; sắp xếp giá tăng/giảm và tên A-Z.
- Yêu thích sản phẩm; giỏ hàng có tăng/giảm số lượng, xóa sản phẩm và tính tổng tiền.
- Đăng ký/đăng nhập demo, đăng xuất; thông tin tài khoản lưu trên trình duyệt.
- Đặt hàng demo, nhập thông tin người nhận và xem lịch sử đơn hàng.
- BeautyBot: gọi API backend; nếu không có `OPENAI_API_KEY` thì dùng câu trả lời dự phòng theo từ khóa.
- **Tùy chỉnh theme:** chuyển giao diện sáng/tối và đổi màu chủ đạo (hồng, tím lavender, xanh sage). Theme được lưu bằng LocalStorage.
- Giỏ hàng, yêu thích, tài khoản, đơn hàng và theme được lưu bằng LocalStorage. Đây là bản demo học tập, chưa phải hệ thống thương mại thật.

## Yêu cầu

- Cài Node.js bản LTS (đã bao gồm npm): https://nodejs.org/
- Mở thư mục `BeautyGlow_AI` bằng VS Code.

## Cách chạy đơn giản (khuyên dùng)

Mở Terminal tại thư mục gốc `BeautyGlow_AI`, chạy:

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ frontend hiện trong Terminal (thường là `http://localhost:5173`). Backend API chạy ở `http://localhost:5000`.

## Cách chạy riêng từng phần

Nếu muốn chạy riêng, mở 2 Terminal:

**Terminal 1 — Backend**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Bật chatbot dùng OpenAI (không bắt buộc)

1. Trong Terminal backend, tạo file `.env` từ `.env.example` (Windows PowerShell: `Copy-Item .env.example .env`).
2. Mở `backend/.env`, điền `OPENAI_API_KEY=...`.
3. Khởi động lại backend.

Không đưa API key lên GitHub. Nếu để trống API key, BeautyBot vẫn trả lời bằng chế độ dự phòng nhưng không phải AI tạo sinh.

## Đưa lên GitHub

Đưa toàn bộ thư mục `BeautyGlow_AI` lên repository. Không tải `node_modules`, file `.env` hoặc thông tin API key lên GitHub. File `.gitignore` đã có trong từng phần.

## Ghi chú đồ án

Đăng nhập, đặt hàng và quản lý trạng thái là chức năng mô phỏng phía trình duyệt bằng LocalStorage; chưa có cơ sở dữ liệu, xác thực bảo mật, thanh toán trực tuyến hoặc quản trị viên thực tế. Ảnh sản phẩm hiện dùng URL Unsplash nên cần Internet để tải ảnh.

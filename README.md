# BeautyGlow — Website bán mỹ phẩm có chatbot AI

Dự án mẫu gồm:
- `frontend`: giao diện React + Vite, responsive, danh mục mỹ phẩm, tìm kiếm, giỏ hàng demo và chatbot.
- `backend`: API Node.js + Express, danh sách sản phẩm và API trò chuyện.
- Chatbot sử dụng OpenAI khi bạn cấu hình `OPENAI_API_KEY`; nếu chưa có khóa, chatbot dùng chế độ tư vấn dự phòng theo từ khóa (không phải mô hình AI tạo sinh).

## Yêu cầu
- Node.js bản LTS (bao gồm npm): https://nodejs.org/
- VS Code (không bắt buộc).

## 1. Chạy backend
Mở Terminal thứ nhất tại thư mục `backend`:

```bash
npm install
```

Tạo file `.env` từ `.env.example` (Windows PowerShell):

```powershell
Copy-Item .env.example .env
```

Mở `.env`. Nếu có OpenAI API key, điền vào `OPENAI_API_KEY`. Nếu chưa có, để trống vẫn chạy được chatbot dự phòng.

Chạy backend:

```bash
npm run dev
```

API mặc định chạy tại `http://localhost:5000`.

## 2. Chạy frontend
Mở Terminal thứ hai tại thư mục `frontend`:

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong Terminal, thường là `http://localhost:5173`.

## 3. Dùng chatbot với OpenAI
1. Tạo API key trong tài khoản OpenAI của bạn.
2. Đặt khóa vào `backend/.env`:
   `OPENAI_API_KEY=your_api_key_here`
3. Khởi động lại backend.

Không đưa API key vào frontend hoặc đưa file `.env` lên GitHub. Việc sử dụng API có thể phát sinh chi phí theo tài khoản của bạn.

## Chức năng demo
- Tìm kiếm sản phẩm theo tên.
- Lọc theo danh mục.
- Thêm sản phẩm vào giỏ hàng (giỏ hàng demo ở phía trình duyệt).
- Chatbot tư vấn sản phẩm, loại da, nhu cầu chăm sóc da ở mức thông tin chung.
- API danh sách sản phẩm và API chat.

Đây là dự án học tập: chưa có thanh toán thật, đăng nhập, quản lý kho hay cơ sở dữ liệu. Hình sản phẩm dùng ảnh từ Unsplash qua URL và cần có kết nối Internet để hiển thị.


## 4. Tài khoản demo để kiểm thử
Website có màn hình đăng nhập demo ở nút **Đăng nhập** trên thanh đầu trang:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin@beautyglow.vn` | `Admin123` |
| Khách hàng | `customer@beautyglow.vn` | `User123` |

Chọn tài khoản trong hộp đăng nhập để tự điền thông tin. Tài khoản admin mở được bảng quản trị minh họa; tài khoản khách hàng dùng để thử trạng thái đăng nhập thông thường.

**Lưu ý:** Đây là đăng nhập giả lập phía frontend, lưu trạng thái trong trình duyệt bằng `localStorage`, không phải xác thực an toàn. Không dùng các tài khoản/mật khẩu này cho website thật; dự án hiện chưa có cơ sở dữ liệu người dùng, phân quyền bảo mật hoặc quản lý đơn hàng thật.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { products } from "./products.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "BeautyGlow API" }));
app.get("/api/products", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const category = String(req.query.category || "");
  const result = products.filter(p =>
    (!q || `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q)) &&
    (!category || category === "Tất cả" || p.category === category)
  );
  res.json({ products: result });
});

const systemPrompt = `Bạn là BeautyBot, trợ lý tư vấn mua sắm của website mỹ phẩm BeautyGlow. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn. Chỉ tư vấn dựa trên danh mục sản phẩm được cung cấp. Hỏi thêm về loại da/nhu cầu khi thiếu thông tin. Không chẩn đoán bệnh, không cam kết sản phẩm chữa bệnh; khuyên thử trên vùng da nhỏ và ngừng dùng nếu kích ứng. Với vấn đề da nghiêm trọng, khuyên gặp bác sĩ da liễu. Không bịa thành phần sản phẩm nếu dữ liệu không cung cấp.`;
function fallbackReply(message) {
  const m = message.toLowerCase();
  if (m.includes("mụn") || m.includes("nhạy cảm") || m.includes("kích ứng")) {
    return "Nếu da bạn dễ nổi mụn hoặc nhạy cảm, hãy ưu tiên routine tối giản và sản phẩm dịu nhẹ. Bạn cho mình biết da dầu, khô hay hỗn hợp nhé? Mình chưa có đủ dữ liệu thành phần để khẳng định sản phẩm nào phù hợp tuyệt đối. Hãy thử trên vùng da nhỏ trước khi dùng toàn mặt.";
  }
  if (m.includes("chống nắng") || m.includes("spf")) {
    const p = products.find(x => x.category === "Chống nắng");
    return `Bạn có thể tham khảo ${p.name} (${p.price.toLocaleString("vi-VN")}đ). Hãy dùng theo hướng dẫn trên nhãn và thoa lại theo điều kiện hoạt động.`;
  }
  if (m.includes("son") || m.includes("trang điểm") || m.includes("makeup")) {
    return "Bạn có thể tham khảo Son Velvet Rose hoặc Phấn má Soft Peach trong danh mục Trang điểm. Bạn thích phong cách tự nhiên, ngọt ngào hay nổi bật?";
  }
  if (m.includes("khô") || m.includes("dưỡng ẩm")) {
    const p = products.find(x => x.name.includes("Hydra"));
    return `Với nhu cầu dưỡng ẩm, bạn có thể tham khảo ${p.name} (${p.price.toLocaleString("vi-VN")}đ). Nếu da rất khô hoặc đang kích ứng, nên chọn sản phẩm phù hợp và thử trước trên vùng nhỏ.`;
  }
  const matches = products.filter(p => m.split(/\s+/).some(w => w.length > 3 && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(w))).slice(0, 3);
  if (matches.length) return "Mình tìm thấy một vài sản phẩm bạn có thể tham khảo: " + matches.map(p => `${p.name} (${p.price.toLocaleString("vi-VN")}đ)`).join("; ") + ". Bạn cho mình biết thêm nhu cầu hoặc loại da để tư vấn sát hơn nhé.";
  return "Xin chào! Mình là BeautyBot 💗 Mình có thể giúp bạn tìm mỹ phẩm theo nhu cầu, loại da và ngân sách. Bạn đang muốn tìm sản phẩm chăm sóc da, chống nắng hay trang điểm?";
}

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
    if (!message) return res.status(400).json({ error: "Vui lòng nhập câu hỏi." });
    if (message.length > 1500) return res.status(400).json({ error: "Tin nhắn quá dài (tối đa 1500 ký tự)." });

    if (process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const catalog = products.map(p => `${p.name} | ${p.category} | ${p.price} VND | ${p.description} | Phù hợp: ${p.skin}`).join("\n");
      const messages = [
        { role: "system", content: `${systemPrompt}\nDanh mục hiện có:\n${catalog}` },
        ...history.filter(x => ["user", "assistant"].includes(x.role) && typeof x.content === "string").map(x => ({ role: x.role, content: x.content.slice(0, 1500) })),
        { role: "user", content: message }
      ];
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages,
        temperature: 0.5,
        max_tokens: 350
      });
      return res.json({ reply: completion.choices[0]?.message?.content || fallbackReply(message), mode: "ai" });
    }
    return res.json({ reply: fallbackReply(message), mode: "fallback" });
  } catch (error) {
    console.error("Chat error:", error.message);
    return res.status(500).json({ error: "Chatbot đang gặp sự cố. Bạn thử lại sau nhé." });
  }
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`BeautyGlow API đang chạy tại http://localhost:${port}`));

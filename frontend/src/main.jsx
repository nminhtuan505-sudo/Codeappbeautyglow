import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Search, ShoppingBag, Heart, Menu, Sparkles, Send, X, ArrowRight, Star, Leaf, Truck, ShieldCheck, Instagram, Facebook, Sun, Moon, User, Plus, Minus, Trash2, SlidersHorizontal, LogOut, Package } from "lucide-react";
import "./styles.css";

const money = n => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
const categories = ["Tất cả", "Chăm sóc da", "Làm sạch", "Chống nắng", "Trang điểm", "Mặt nạ"];
const fallbackProducts = [
 {id:1,name:"Serum Vitamin C Glow",brand:"Lumière",category:"Chăm sóc da",price:289000,oldPrice:359000,rating:4.8,badge:"Bán chạy",description:"Serum dưỡng sáng da, hỗ trợ làm đều màu da.",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85"},
 {id:2,name:"Kem dưỡng ẩm Hydra",brand:"Derma Bloom",category:"Chăm sóc da",price:325000,oldPrice:390000,rating:4.9,badge:"Dưỡng ẩm",description:"Kem dưỡng ẩm hằng ngày, giúp da mềm mại.",image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85"},
 {id:3,name:"Sữa rửa mặt dịu nhẹ",brand:"Pure Skin",category:"Làm sạch",price:159000,oldPrice:189000,rating:4.7,badge:"",description:"Làm sạch bụi bẩn nhẹ nhàng, phù hợp dùng mỗi ngày.",image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85"},
 {id:4,name:"Son Velvet Rose",brand:"Mộc Beauty",category:"Trang điểm",price:219000,oldPrice:259000,rating:4.8,badge:"Mới",description:"Son màu hồng đất dễ dùng cho phong cách hằng ngày.",image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85"},
 {id:5,name:"Kem chống nắng SPF 50+",brand:"Sun Atelier",category:"Chống nắng",price:279000,oldPrice:329000,rating:4.9,badge:"Ưa thích",description:"Bảo vệ da trước tia UV; dùng theo hướng dẫn trên nhãn.",image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85"},
 {id:6,name:"Mặt nạ cấp ẩm",brand:"Dewy Lab",category:"Mặt nạ",price:49000,oldPrice:65000,rating:4.6,badge:"",description:"Mặt nạ chăm sóc da nhanh, tiện lợi.",image:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85"},
 {id:7,name:"Phấn má Soft Peach",brand:"Mộc Beauty",category:"Trang điểm",price:189000,oldPrice:229000,rating:4.7,badge:"",description:"Phấn má tông đào tự nhiên, dễ tán.",image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85"},
 {id:8,name:"Toner cân bằng da",brand:"Pure Skin",category:"Chăm sóc da",price:199000,oldPrice:249000,rating:4.6,badge:"",description:"Bước chăm sóc sau làm sạch, giúp da dễ chịu.",image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85"}
];

function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([{role:"assistant",content:"Xin chào nàng 💗 Mình là BeautyBot. Bạn đang tìm sản phẩm cho loại da hoặc nhu cầu nào?"}]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({behavior:"smooth"}), [messages, busy]);
  async function send(text = input) {
    const value = text.trim();
    if (!value || busy) return;
    const next = [...messages, {role:"user",content:value}];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const response = await fetch("/api/chat", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:value,history:messages.slice(-8)})});
      const data = await response.json();
      setMessages(prev => [...prev,{role:"assistant",content:data.reply || data.error || "Mình chưa trả lời được, bạn thử lại nhé."}]);
    } catch {
      setMessages(prev => [...prev,{role:"assistant",content:"Mình chưa kết nối được máy chủ. Hãy kiểm tra backend đang chạy ở cổng 5000 nhé."}]);
    } finally { setBusy(false); }
  }
  return <div className="chat-window">
    <div className="chat-head"><div className="bot-avatar"><Sparkles size={19}/></div><div><b>BeautyBot</b><small><span className="online-dot"/> Trợ lý làm đẹp trực tuyến</small></div><button className="icon-btn chat-close" onClick={onClose} aria-label="Đóng chat"><X/></button></div>
    <div className="chat-body">{messages.map((m,i)=><div key={i} className={`chat-row ${m.role}`}><div className="bubble">{m.content}</div></div>)}{busy&&<div className="chat-row assistant"><div className="bubble typing">BeautyBot đang trả lời…</div></div>}<div ref={endRef}/></div>
    {messages.length===1&&<div className="quick-prompts">{["Da khô nên dùng gì?","Tư vấn chống nắng","Tìm son trang điểm"].map(t=><button key={t} onClick={()=>send(t)}>{t}</button>)}</div>}
    <form className="chat-input" onSubmit={e=>{e.preventDefault();send();}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Nhập câu hỏi của bạn..." aria-label="Tin nhắn"/><button disabled={busy||!input.trim()} aria-label="Gửi"><Send size={18}/></button></form>
    <div className="chat-note">Thông tin tham khảo; hãy thử sản phẩm trên vùng da nhỏ trước khi dùng.</div>
  </div>;
}

function App() {
  const [products,setProducts] = useState(fallbackProducts);
  const [category,setCategory] = useState("Tất cả");
  const [query,setQuery] = useState("");
  const [cart,setCart] = useState(()=>JSON.parse(localStorage.getItem("bg_cart")||"[]"));
  const [favorites,setFavorites] = useState(()=>JSON.parse(localStorage.getItem("bg_favorites")||"[]"));
  const [favoriteOnly,setFavoriteOnly] = useState(false);
  const [orders,setOrders] = useState(()=>JSON.parse(localStorage.getItem("bg_orders")||"[]"));
  const [account,setAccount] = useState(()=>JSON.parse(localStorage.getItem("bg_account")||"null"));
  const [chatOpen,setChatOpen] = useState(false);
  const [notice,setNotice] = useState("");
  const [theme,setTheme] = useState(()=>localStorage.getItem("bg_theme")||"light");
  const [accent,setAccent] = useState(()=>localStorage.getItem("bg_accent")||"rose");
  const [themePanel,setThemePanel] = useState(false);
  const [cartOpen,setCartOpen] = useState(false);
  const [accountOpen,setAccountOpen] = useState(false);
  const [checkoutOpen,setCheckoutOpen] = useState(false);
  const [ordersOpen,setOrdersOpen] = useState(false);
  const [brand,setBrand] = useState("Tất cả");
  const [sort,setSort] = useState("featured");
  const [maxPrice,setMaxPrice] = useState("all");
  const [authMode,setAuthMode] = useState("login");
  const [authForm,setAuthForm] = useState({name:"",email:"",password:""});
  const [shipping,setShipping] = useState({name:"",phone:"",address:""});
  useEffect(()=>{fetch("/api/products").then(r=>r.json()).then(d=>d.products&&setProducts(d.products)).catch(()=>{});},[]);
  useEffect(()=>localStorage.setItem("bg_cart",JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem("bg_favorites",JSON.stringify(favorites)),[favorites]);
  useEffect(()=>localStorage.setItem("bg_orders",JSON.stringify(orders)),[orders]);
  useEffect(()=>{localStorage.setItem("bg_theme",theme);document.documentElement.dataset.theme=theme;},[theme]);
  useEffect(()=>{localStorage.setItem("bg_accent",accent);document.documentElement.dataset.accent=accent;},[accent]);
  const brands = ["Tất cả",...new Set(products.map(p=>p.brand))];
  const visible = useMemo(()=>{
    let result=products.filter(p=>(category==="Tất cả"||p.category===category)&&(brand==="Tất cả"||p.brand===brand)&&(`${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(query.toLowerCase()))&&(maxPrice==="all"||p.price<=Number(maxPrice))&&(!favoriteOnly||favorites.includes(p.id)));
    if(sort==="low") result.sort((a,b)=>a.price-b.price);
    if(sort==="high") result.sort((a,b)=>b.price-a.price);
    if(sort==="name") result.sort((a,b)=>a.name.localeCompare(b.name,"vi"));
    return result;
  },[products,category,brand,query,maxPrice,sort,favoriteOnly,favorites]);
  const total = cart.reduce((s,p)=>s+p.price*p.qty,0);
  const count = cart.reduce((s,p)=>s+p.qty,0);
  const toast = message => {setNotice(message);setTimeout(()=>setNotice(""),2400);};
  const addCart = p => {setCart(old=>old.some(x=>x.id===p.id)?old.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...old,{...p,qty:1}]);toast(`Đã thêm ${p.name} vào giỏ hàng`);};
  const changeQty=(id,delta)=>setCart(old=>old.map(p=>p.id===id?{...p,qty:Math.max(1,p.qty+delta)}:p));
  const removeCart=id=>setCart(old=>old.filter(p=>p.id!==id));
  const toggleFavorite = id => setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
  function submitAuth(e){e.preventDefault();if(!authForm.email||!authForm.password)return;const user={name:authForm.name||authForm.email.split("@")[0],email:authForm.email};localStorage.setItem("bg_account",JSON.stringify(user));setAccount(user);setAccountOpen(false);toast(authMode==="register"?"Tạo tài khoản demo thành công":"Đăng nhập thành công");}
  function placeOrder(e){e.preventDefault();if(!cart.length)return;const order={id:"BG"+Date.now().toString().slice(-7),date:new Date().toLocaleString("vi-VN"),items:cart,total,status:"Đang xử lý",customer:shipping};setOrders(old=>[order,...old]);setCart([]);setCheckoutOpen(false);setCartOpen(false);toast("Đặt hàng thành công! Cảm ơn bạn 💗");}
  return <div className={`site-shell ${theme}`}>
    <div className="announcement">✨ Ưu đãi làm đẹp mỗi ngày · Miễn phí vận chuyển cho đơn từ 499K</div>
    <header className="header"><a className="logo" href="#"><span className="logo-mark">b.</span><span>beauty<span className="logo-light">glow</span><small>BEAUTY, YOUR WAY</small></span></a>
      <nav className="main-nav"><a href="#products">Cửa hàng</a><a href="#categories">Danh mục</a><a href="#story">Câu chuyện</a><a href="#footer">Liên hệ</a></nav>
      <div className="header-actions"><label className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm mỹ phẩm..."/></label><button className="header-icon" onClick={()=>{setCategory("Tất cả");setQuery("");setFavoriteOnly(v=>!v);document.getElementById("products").scrollIntoView({behavior:"smooth"});toast(favoriteOnly?"Đang hiển thị tất cả sản phẩm":"Đang hiển thị sản phẩm yêu thích");}} aria-label="Yêu thích"><Heart size={20}/><span>{favorites.length}</span></button><button className="header-icon bag-icon" onClick={()=>setCartOpen(true)} aria-label="Giỏ hàng"><ShoppingBag size={20}/><span>{count}</span></button><button className="header-icon" onClick={()=>setAccountOpen(true)} aria-label="Tài khoản"><User size={19}/></button><button className="header-icon" onClick={()=>setThemePanel(v=>!v)} aria-label="Tùy chỉnh giao diện"><SlidersHorizontal size={19}/></button></div>
    </header>
    {themePanel&&<div className="theme-panel"><b>Tuỳ chỉnh giao diện</b><div className="theme-options"><button onClick={()=>setTheme("light")} className={theme==="light"?"selected":""}><Sun size={15}/> Sáng</button><button onClick={()=>setTheme("dark")} className={theme==="dark"?"selected":""}><Moon size={15}/> Tối</button></div><small>Màu chủ đạo</small><div className="swatches"><button className="swatch rose" aria-label="Hồng" onClick={()=>setAccent("rose")}/><button className="swatch lavender" aria-label="Tím" onClick={()=>setAccent("lavender")}/><button className="swatch sage" aria-label="Xanh sage" onClick={()=>setAccent("sage")}/></div><button className="panel-close" onClick={()=>setThemePanel(false)}>Đóng</button></div>}
    <main>
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span/> BEAUTY STARTS WITH YOU</div><h1>Chạm vào vẻ đẹp<br/> <em>tự nhiên</em> của bạn.</h1><p>Khám phá những sản phẩm chăm sóc da và trang điểm được chọn lọc để mỗi ngày đều là một phiên bản rạng rỡ hơn của chính mình.</p><div className="hero-buttons"><a className="btn-primary" href="#products">Khám phá ngay <ArrowRight size={17}/></a><a className="text-link" href="#story">Câu chuyện của chúng tôi</a></div><div className="hero-proof"><div className="avatar-stack"><span>🌸</span><span>💗</span><span>✨</span></div><div><div className="stars">★★★★★</div><small>Được yêu thích bởi <b>2.000+</b> khách hàng</small></div></div></div>
        <div className="hero-visual"><div className="hero-photo"><img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=90" alt="Bộ sưu tập mỹ phẩm làm đẹp"/><div className="photo-overlay"></div><div className="hero-label"><span>THE GLOW EDIT</span><b>Rituals for<br/>your radiance.</b><small>Discover your daily ritual ↗</small></div></div><div className="floating-note"><span className="note-icon"><Leaf size={20}/></span><div><b>Self-care, naturally</b><small>Yêu làn da của bạn mỗi ngày</small></div></div><div className="decor-circle">✳</div></div>
      </section>
      <section className="benefits"><div><span><Leaf/></span><div><b>Chọn lọc tinh tế</b><small>Sản phẩm được tuyển chọn</small></div></div><div><span><Truck/></span><div><b>Giao hàng tận tâm</b><small>Theo dõi đơn hàng dễ dàng</small></div></div><div><span><ShieldCheck/></span><div><b>Mua sắm an tâm</b><small>Hỗ trợ khách hàng chu đáo</small></div></div><div><span><Sparkles/></span><div><b>Tư vấn làm đẹp</b><small>BeautyBot hỗ trợ 24/7</small></div></div></section>
      <section className="category-section" id="categories"><div className="section-heading"><div><span className="eyebrow">FIND YOUR FAVORITE</span><h2>Khám phá danh mục</h2></div><p>Một chút chăm sóc, thật nhiều yêu thương.</p></div><div className="category-grid">{[{name:"Chăm sóc da",sub:"Skincare essentials",emoji:"🧴",tone:"pink"},{name:"Làm sạch",sub:"Cleanse & refresh",emoji:"🫧",tone:"cream"},{name:"Chống nắng",sub:"Everyday protection",emoji:"☀️",tone:"yellow"},{name:"Trang điểm",sub:"Your color story",emoji:"💄",tone:"rose"}].map(c=><button key={c.name} className={`category-card ${c.tone}`} onClick={()=>{setCategory(c.name);document.getElementById("products").scrollIntoView({behavior:"smooth"});}}><span className="category-emoji">{c.emoji}</span><span className="category-title">{c.name}</span><span className="category-sub">{c.sub}</span><span className="category-arrow"><ArrowRight size={17}/></span></button>)}</div></section>
      <section className="product-section" id="products"><div className="section-heading"><div><span className="eyebrow">THE BEAUTY SHELF</span><h2>Sản phẩm được yêu thích <span>♡</span></h2><p className="section-description">Những món nhỏ xinh cho chu trình chăm sóc bản thân của bạn.</p></div><a className="view-all" href="#products">Xem bộ sưu tập <ArrowRight size={16}/></a></div><div className="filters">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?"active":""}>{c}</button>)}</div>
        <div className="advanced-filters"><select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select><select value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}><option value="all">Mọi mức giá</option><option value="100000">Dưới 100K</option><option value="200000">Dưới 200K</option><option value="300000">Dưới 300K</option><option value="500000">Dưới 500K</option></select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Sắp xếp: Nổi bật</option><option value="low">Giá thấp đến cao</option><option value="high">Giá cao đến thấp</option><option value="name">Tên A-Z</option></select></div>
        <div className="product-grid">{visible.map(p=><article className="product-card" key={p.id}><div className="product-image"><img src={p.image} alt={p.name} loading="lazy" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("image-fallback");}}/>{p.badge&&<span className="product-badge">{p.badge}</span>}<button className={`favorite-btn ${favorites.includes(p.id)?"favorited":""}`} onClick={()=>toggleFavorite(p.id)} aria-label="Thêm yêu thích"><Heart size={18} fill={favorites.includes(p.id)?"currentColor":"none"}/></button><button className="quick-add" onClick={()=>addCart(p)}><ShoppingBag size={16}/> Thêm vào giỏ</button></div><div className="product-info"><span className="product-brand">{p.brand}</span><h3>{p.name}</h3><div className="rating"><Star size={14} fill="currentColor"/><b>{p.rating}</b><span>(Được yêu thích)</span></div><div className="price-row"><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div></div></article>)}</div>{visible.length===0&&<div className="empty-state">Không tìm thấy sản phẩm phù hợp. Thử từ khóa khác nhé.</div>}</section>
      <section className="story" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85" alt="Chăm sóc da mỗi ngày"/></div><div className="story-copy"><span className="eyebrow">A LITTLE LOVE NOTE</span><h2>Vẻ đẹp không cần<br/><em>hoàn hảo.</em></h2><p>Chúng tôi tin rằng làm đẹp bắt đầu từ việc lắng nghe chính mình. BeautyGlow mang đến một không gian nhẹ nhàng để bạn khám phá sản phẩm, tìm hiểu nhu cầu làn da và tận hưởng những khoảnh khắc chăm sóc bản thân.</p><a className="btn-primary" href="#products">Tìm món đồ dành cho bạn <ArrowRight size={17}/></a></div></section>
      <section className="newsletter"><div><span className="eyebrow">A NOTE FROM BEAUTYGLOW</span><h2>Một chút ngọt ngào<br/>trong hộp thư của bạn.</h2><p>Nhận mẹo chăm sóc da, bộ sưu tập mới và ưu đãi đặc biệt.</p></div><form onSubmit={e=>{e.preventDefault();toast("Cảm ơn bạn đã đăng ký nhận tin 💗");e.currentTarget.reset();}}><input type="email" placeholder="Địa chỉ email của bạn" required/><button>Đăng ký <ArrowRight size={16}/></button></form></section>
    </main>
    <footer id="footer"><div className="footer-main"><a className="logo" href="#"><span className="logo-mark">b.</span><span>beauty<span className="logo-light">glow</span><small>BEAUTY, YOUR WAY</small></span></a><p>Không chỉ là mỹ phẩm,<br/>đó là cách bạn yêu thương chính mình.</p><div className="socials"><a href="#footer"><Instagram/></a><a href="#footer"><Facebook/></a></div></div><div className="footer-links"><div><b>Khám phá</b><a href="#products">Sản phẩm</a><a href="#categories">Danh mục</a><a href="#story">Về BeautyGlow</a></div><div><b>Hỗ trợ</b><a href="#footer">Chính sách giao hàng</a><a href="#footer">Đổi trả & hoàn tiền</a><a href="#footer">Liên hệ</a></div><div><b>BeautyBot</b><p>Cần một chút gợi ý?<br/>Trò chuyện với trợ lý làm đẹp AI.</p><button className="footer-chat" onClick={()=>setChatOpen(true)}>Bắt đầu trò chuyện ↗</button></div></div><div className="copyright"><span>© 2026 BeautyGlow. Dự án demo phục vụ học tập.</span><span>Made with ♡ for your glow</span></div></footer>
    {notice&&<div className="toast">{notice}</div>}
    {cartOpen&&<div className="modal-backdrop" onClick={()=>setCartOpen(false)}><div className="app-modal cart-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setCartOpen(false)}><X/></button><h2>Giỏ hàng của bạn</h2>{cart.length===0?<p>Giỏ hàng đang trống.</p>:<>{cart.map(p=><div className="cart-line" key={p.id}><img src={p.image} alt=""/><div className="cart-line-info"><b>{p.name}</b><small>{money(p.price)}</small><div className="qty-control"><button onClick={()=>changeQty(p.id,-1)}><Minus size={13}/></button><span>{p.qty}</span><button onClick={()=>changeQty(p.id,1)}><Plus size={13}/></button><button onClick={()=>removeCart(p.id)}><Trash2 size={14}/></button></div></div></div>)}<div className="cart-total"><b>Tổng cộng</b><strong>{money(total)}</strong></div><button className="btn-primary modal-primary" onClick={()=>{setShipping({name:account?.name||"",phone:"",address:""});setCartOpen(false);setCheckoutOpen(true);}}>Tiến hành đặt hàng</button></>}</div></div>}
    {accountOpen&&<div className="modal-backdrop" onClick={()=>setAccountOpen(false)}><div className="app-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setAccountOpen(false)}><X/></button>{account?<><h2>Xin chào, {account.name}</h2><p>{account.email}</p><button className="secondary-action" onClick={()=>{localStorage.removeItem("bg_account");setAccount(null);setAccountOpen(false);toast("Đã đăng xuất");}}><LogOut size={16}/> Đăng xuất</button><button className="secondary-action" onClick={()=>{setAccountOpen(false);setOrdersOpen(true);}}><Package size={16}/> Lịch sử đơn hàng ({orders.length})</button></>:<><h2>{authMode==="login"?"Đăng nhập":"Tạo tài khoản"}</h2><div className="auth-tabs"><button onClick={()=>setAuthMode("login")} className={authMode==="login"?"active":""}>Đăng nhập</button><button onClick={()=>setAuthMode("register")} className={authMode==="register"?"active":""}>Đăng ký</button></div><form className="app-form" onSubmit={submitAuth}>{authMode==="register"&&<input placeholder="Họ và tên" required value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})}/>}<input type="email" placeholder="Email" required value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})}/><input type="password" placeholder="Mật khẩu" required value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})}/><button className="btn-primary modal-primary">{authMode==="login"?"Đăng nhập":"Đăng ký"}</button><small>Đăng nhập demo trên trình duyệt, chưa kết nối cơ sở dữ liệu.</small></form></>}</div></div>}
    {checkoutOpen&&<div className="modal-backdrop" onClick={()=>setCheckoutOpen(false)}><div className="app-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setCheckoutOpen(false)}><X/></button><h2>Thông tin đặt hàng</h2><p>Tổng thanh toán: <b>{money(total)}</b></p><form className="app-form" onSubmit={placeOrder}><input placeholder="Họ tên người nhận" required value={shipping.name} onChange={e=>setShipping({...shipping,name:e.target.value})}/><input placeholder="Số điện thoại" required value={shipping.phone} onChange={e=>setShipping({...shipping,phone:e.target.value})}/><textarea placeholder="Địa chỉ nhận hàng" required value={shipping.address} onChange={e=>setShipping({...shipping,address:e.target.value})}/><button className="btn-primary modal-primary">Xác nhận đặt hàng</button></form></div></div>}
    {ordersOpen&&<div className="modal-backdrop" onClick={()=>setOrdersOpen(false)}><div className="app-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setOrdersOpen(false)}><X/></button><h2>Lịch sử đơn hàng</h2>{orders.length===0?<p>Bạn chưa có đơn hàng nào.</p>:orders.map(o=><div className="order-line" key={o.id}><b>{o.id}</b><small>{o.date} · {o.status}</small><strong>{money(o.total)}</strong></div>)}</div></div>}
    <button className={`chat-launcher ${chatOpen?"opened":""}`} onClick={()=>setChatOpen(v=>!v)} aria-label="Mở chatbot">{chatOpen?<X/>:<><span className="chat-spark"><Sparkles size={18}/></span><span>Hỏi BeautyBot</span></>}</button>
    {chatOpen&&<Chatbot onClose={()=>setChatOpen(false)}/>}
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);

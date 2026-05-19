// আপনার দেওয়া অফিশিয়াল হোয়াটসঅ্যাপ নম্বর (স্থির রাখা হয়েছে)
const WHATSAPP_NUMBER = "8801611341846";

// ওয়েবসাইট প্রথমবার ওপেন হলে দেখানোর জন্য ২টি আকর্ষণীয় ডেমো প্রোডাক্ট
const defaultProducts = [
    {
        id: 1,
        name: "প্রিমিয়াম ফ্লোরাল ক্যালিগ্রাফি টোট",
        price: 290,
        oldPrice: 380,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    },
    {
        id: 2,
        name: "মিনিমালিস্ট আরবান ব্ল্যাক এডিশন",
        price: 240,
        oldPrice: 320,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"
    }
];

// ব্রাউজারের মেমোরি (LocalStorage) থেকে ডাটা রিড করা
let products = JSON.parse(localStorage.getItem('tote_v2_products')) || defaultProducts;
let reviews = JSON.parse(localStorage.getItem('tote_v2_reviews')) || {};

// গড লেভেল প্রোডাক্ট রেন্ডারিং ফাংশন
function displayProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = '';

    products.forEach(product => {
        const prodReviews = reviews[product.id] || [];
        const avgRating = prodReviews.length 
            ? (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1) 
            : "5.0"; // কোনো রিভিউ না থাকলে বাই-ডিফল্ট ৫ দেখাবে

        const productCard = `
            <div class="glass-card rounded-3xl overflow-hidden border border-indigo-50 relative flex flex-col justify-between shadow-sm">
                ${product.oldPrice ? `<div class="absolute top-4 left-4 bg-rose-500 text-white px-4 py-1 rounded-full text-xs font-bold z-10 offer-badge">SALE</div>` : ''}
                
                <div class="h-80 overflow-hidden bg-slate-100">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transform hover:scale-110 transition duration-700" loading="lazy">
                </div>

                <div class="p-8 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold text-slate-800 leading-tight">${product.name}</h3>
                            <div class="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg text-sm">
                                <span>★</span>
                                <span class="ml-1">${avgRating}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 mb-6">
                            <span class="text-2xl font-black text-indigo-600">৳${product.price}</span>
                            ${product.oldPrice ? `<span class="text-slate-400 line-through text-sm">৳${product.oldPrice}</span>` : ''}
                        </div>
                    </div>

                    <div>
                        <button onclick="orderProduct('${product.name}', ${product.price})" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold glow-button mb-6">
                            🛍️ এখনই অর্ডার করুন
                        </button>

                        <!-- প্রিমিয়াম কাস্টমার রেটিং সিস্টেম -->
                        <div class="border-t border-slate-100 pt-4">
                            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">কাস্টমার ফিডব্যাক ও রেটিং</p>
                            <div class="flex gap-2">
                                <select id="rate-${product.id}" class="bg-slate-50 border border-slate-200 rounded-xl px-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-amber-600">
                                    <option value="5">5 ★</option>
                                    <option value="4">4 ★</option>
                                    <option value="3">3 ★</option>
                                </select>
                                <input type="text" id="rev-${product.id}" placeholder="মতামত লিখুন..." class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <button onclick="addReview(${product.id})" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition">সাবমিট</button>
                            </div>
                            
                            <!-- রিভিউ শো করার জায়গা -->
                            <div class="mt-4 space-y-2 max-h-28 overflow-y-auto pr-1">
                                ${prodReviews.length === 0 ? `<p class="text-xs text-center text-slate-400 italic">এখনো কোনো মন্তব্য নেই!</p>` : ''}
                                ${prodReviews.map(r => `
                                    <div class="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <span class="text-amber-500 font-bold">★${r.rating}</span> <span class="text-slate-600">${r.text}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

// অর্ডার করার অটোমেটিক ফাংশন (হোয়াটসঅ্যাপ চ্যাট লিঙ্ক জেনারেটর)
function orderProduct(name, price) {
    const msg = `হ্যালো ToteStyle! 👋\n\nআমি ওয়েবসাইট থেকে এই ব্যাগটি পছন্দ করেছি এবং অর্ডার কনফার্ম করতে চাই:\n\n📦 প্রোডাক্ট: *${name}*\n💰 অফার মূল্য: *৳${price}*\n\nদয়া করে ঢাকার ভেতর/বাইরে ডেলিভারি প্রসেসটি আমাকে জানান। ধন্যবাদ!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// অ্যাডমিন প্যানেল থেকে নতুন প্রোডাক্ট যুক্ত করার লজিক
const form = document.getElementById('add-product-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('prod-name').value;
        const price = document.getElementById('prod-price').value;
        const oldPrice = document.getElementById('prod-old-price').value;
        const image = document.getElementById('prod-img').value;

        const newProd = {
            id: Date.now(), // ইউনিক আইডি জেনারেট করার ট্রিক
            name: name,
            price: parseInt(price),
            oldPrice: oldPrice ? parseInt(oldPrice) : null,
            image: image
        };

        products.unshift(newProd); // নতুন প্রোডাক্ট সবসময় সবার প্রথমে দেখাবে
        localStorage.setItem('tote_v2_products', JSON.stringify(products));
        
        displayProducts();
        this.reset();
        
        // আপলোড হওয়ার পর স্ক্রিন অটোমেটিক প্রোডাক্ট সেকশনে স্ক্রোল করবে
        window.location.hash = "products";
        alert("🎉 অভিনন্দন! নতুন প্রোডাক্টটি ওয়েবসাইটে সফলভাবে লাইভ হয়েছে।");
    });
}

// রিভিউ ও রেটিং সাবমিট করার ফাংশন
function addReview(id) {
    const ratingSelect = document.getElementById(`rate-${id}`);
    const reviewInput = document.getElementById(`rev-${id}`);
    
    if(!ratingSelect || !reviewInput) return;

    const rating = parseInt(ratingSelect.value);
    const text = reviewInput.value.trim();
    
    if(!text) {
        alert("অনুগ্রহ করে রিভিউ বক্সে কিছু টাইপ করুন!");
        return;
    }
    
    if(!reviews[id]) {
        reviews[id] = [];
    }
    
    reviews[id].unshift({ rating, text });
    localStorage.setItem('tote_v2_reviews', JSON.stringify(reviews));
    
    displayProducts();
}

// সাইট ওপেন হওয়ামাত্রই প্রোডাক্টগুলো স্ক্রিনে দেখানোর নির্দেশক
document.addEventListener('DOMContentLoaded', displayProducts);
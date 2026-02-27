// components/Chatbot.tsx

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../apis/chatbot";
import type { ChatMessage, ChatProduct } from "../types/chatbot";

// ─── Icons ────────────────────────────────────────────────────────────────
const ChatIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const ExpandIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
);

const CompressIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
    </svg>
);

// ─── Typing indicator ──────────────────────────────────────────────────────
const TypingDots = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        {[0, 1, 2].map(i => (
            <span
                key={i}
                className="w-2 h-2 rounded-full bg-wine/50"
                style={{
                    animation: "chatBounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                }}
            />
        ))}
    </div>
);

// ─── Product card inside chat ──────────────────────────────────────────────
const ChatProductCard = ({ product, onClick, expanded }: {
    product: ChatProduct;
    onClick: () => void;
    expanded: boolean;
}) => (
    <div
        onClick={onClick}
        className={`flex gap-2 bg-white rounded-xl border border-moonstone p-2 cursor-pointer hover:border-wine hover:shadow-md transition-all duration-200 ${expanded ? "min-w-[220px] max-w-[260px]" : "min-w-[180px] max-w-[200px]"}`}
    >
        <img
            src={product.image_url}
            alt={product.BrandName}
            className={`object-cover rounded-lg flex-shrink-0 bg-blush ${expanded ? "w-16 h-16" : "w-14 h-14"}`}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x56/f9e4e4/7a3d5c?text=Tiyara"; }}
        />
        <div className="flex flex-col justify-between min-w-0">
            <p className="text-xs font-bold text-plum truncate">{product.BrandName}</p>
            <p className="text-xs text-wine/70 truncate capitalize">{product.Individual_category}</p>
            <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-plum">₹{product.OriginalPrice}</p>
                {product.DiscountOffer && (
                    <span className="text-[10px] text-green-600 font-semibold">{product.DiscountOffer}</span>
                )}
            </div>
            {product.Ratings && (
                <p className="text-[10px] text-wine/60">⭐ {product.Ratings}</p>
            )}
        </div>
    </div>
);

// ─── Single message bubble ──────────────────────────────────────────────────
const MessageBubble = ({ msg, onProductClick, expanded }: {
    msg: ChatMessage;
    onProductClick: (id: number) => void;
    expanded: boolean;
}) => {
    const isUser = msg.role === "user";
    return (
        <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
            <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${expanded ? "max-w-[70%]" : "max-w-[85%]"
                    } ${isUser ? "bg-wine text-ivory rounded-br-sm" : "bg-blush text-plum rounded-bl-sm"}`}
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
                {msg.content}
            </div>

            {msg.products && msg.products.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-hide">
                    {msg.products.map(p => (
                        <ChatProductCard
                            key={p.Product_id}
                            product={p}
                            onClick={() => onProductClick(p.Product_id)}
                            expanded={expanded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Chatbot component ────────────────────────────────────────────────
export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content: "Hi! 👗 I'm Tiyara's style assistant. Ask me about outfits, colors for your skin tone, or anything fashion-related!",
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Reset expanded when chat closes
    useEffect(() => {
        if (!isOpen) setIsExpanded(false);
    }, [isOpen]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isTyping) return;

        const userMsg: ChatMessage = {
            role: "user",
            content: text,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        const history = messages
            .filter(m => m.timestamp !== messages[0].timestamp)
            .map(m => ({ role: m.role, content: m.content }));

        try {
            const res = await sendChatMessage({
                message: text,
                conversation_history: history,
            });

            const assistantMsg: ChatMessage = {
                role: "assistant",
                content: res.reply,
                products: res.products || [],
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMsg]);
            if (!isOpen) setHasUnread(true);

        } catch {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again! 🙏",
                    timestamp: Date.now(),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleProductClick = (productId: number) => {
        navigate(`/recommend/${productId}`);
        setIsOpen(false);
    };

    const suggestions = [
        "Tops for olive warm skin",
        "Party outfit ideas",
        "Best colors for fair skin",
        "Budget under ₹1000",
    ];

    return (
        <>
            {/* ── Floating button ── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-wine text-ivory shadow-2xl flex items-center justify-center hover:bg-plum hover:scale-110 transition-all duration-300"
                style={{ boxShadow: "0 8px 32px rgba(122,61,92,0.45)" }}
                aria-label="Open fashion assistant"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
                {hasUnread && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* ── Chat window ── */}
            <div
                className={`fixed z-50 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
                    } ${isExpanded
                        ? "inset-4 rounded-3xl"
                        : "bottom-24 right-6 w-[360px] max-w-[calc(100vw-1.5rem)] rounded-3xl"
                    }`}
                style={{
                    height: isExpanded ? undefined : "520px",
                    transformOrigin: isExpanded ? "center" : "bottom right",
                    background: "linear-gradient(160deg, #fff9f9 0%, #fff 100%)",
                    boxShadow: "0 24px 64px rgba(122,61,92,0.2), 0 4px 16px rgba(0,0,0,0.08)",
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-wine text-ivory flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-blush/30 flex items-center justify-center flex-shrink-0">
                        <ChatIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">Tiyara Style Assistant</p>
                        <p className="text-xs text-ivory/70">Fashion & product queries</p>
                    </div>
                    {/* Expand toggle */}
                    <button
                        onClick={() => setIsExpanded(prev => !prev)}
                        className="hover:bg-white/20 rounded-full p-1.5 transition-colors mr-1"
                        aria-label={isExpanded ? "Collapse chat" : "Expand to fullscreen"}
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <CompressIcon /> : <ExpandIcon />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        aria-label="Close chat"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-moonstone scrollbar-track-transparent">
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={i}
                            msg={msg}
                            onProductClick={handleProductClick}
                            expanded={isExpanded}
                        />
                    ))}

                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {suggestions.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                                    className="text-xs px-3 py-1.5 rounded-full border border-wine/30 text-wine hover:bg-wine hover:text-ivory transition-all duration-200"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex items-start">
                            <div className="bg-blush rounded-2xl rounded-bl-sm">
                                <TypingDots />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-3 py-3 border-t border-moonstone/40 bg-white flex-shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about fashion or products..."
                        disabled={isTyping}
                        className="flex-1 px-4 py-2.5 rounded-full bg-blush/30 text-plum placeholder-plum/40 text-sm focus:outline-none focus:ring-2 focus:ring-wine/30 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="w-10 h-10 rounded-full bg-wine text-ivory flex items-center justify-center flex-shrink-0 hover:bg-plum transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes chatBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
            `}</style>
        </>
    );
}
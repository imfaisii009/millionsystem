"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { Code2, Copy, Check, Database } from "lucide-react";
// Inline SVG icons to avoid react-icons barrel imports (saves ~2MB)
const NodejsIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.193-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.085.049-.139.143-.139.242v10.15c0 .097.054.189.134.235l2.409 1.392c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.509 0-.909 0-2.026-.551l-2.304-1.326c-.57-.329-.922-.943-.922-1.596V6.921c0-.653.352-1.267.922-1.596L11.076.249c.559-.324 1.303-.324 1.858 0l8.795 5.076c.57.329.924.943.924 1.596v10.15c0 .653-.354 1.267-.924 1.596l-8.795 5.076c-.28.163-.6.247-.936.247zm2.72-6.998c-3.846 0-4.654-1.766-4.654-3.249 0-.142.114-.253.256-.253h1.136c.127 0 .233.092.253.216.172 1.162.686 1.75 3.009 1.75 1.853 0 2.64-.419 2.64-1.401 0-.566-.224-.986-3.103-1.269-2.407-.238-3.896-.77-3.896-2.693 0-1.775 1.497-2.833 4.006-2.833 2.818 0 4.213.978 4.39 3.076.007.071-.018.141-.066.195-.047.052-.113.082-.182.082h-1.14c-.12 0-.226-.083-.251-.199-.278-1.238-.954-1.634-2.751-1.634-2.027 0-2.263.707-2.263 1.236 0 .642.279.829 3.008 1.192 2.703.358 3.99.868 3.99 2.757 0 1.917-1.596 3.017-4.382 3.017z"/>
    </svg>
);

const VercelIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
    </svg>
);

const DenoIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm-.469 6.793c-3.49 0-6.204 2.196-6.204 4.928 0 2.58 2.498 4.228 6.37 4.137l.097-.003-.002.08c0 .957.776 1.733 1.733 1.733.958 0 1.734-.776 1.734-1.733 0-.529-.238-1.003-.612-1.32.093-.09.193-.201.293-.339.323-.44.515-1.022.515-1.676 0-1.09-.559-2.036-1.394-2.582l-.004-.053c0-1.762-1.141-3.172-2.526-3.172zm3.903 5.168a.82.82 0 11-.001 1.64.82.82 0 010-1.64z"/>
    </svg>
);

const CloudflareIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.2862-.2246-.2862-.5708-.4369-.9722-.4708l-8.3788-.1123c-.0569 0-.0908-.0283-.1086-.0569-.0181-.037-.0181-.0845.0053-.1212.0283-.0538.0789-.0892.1383-.0931l8.4895-.1124c.9661-.0661 2.0147-.8396 2.3533-1.7934l.4299-1.2124c.021-.0593.0264-.1207.0156-.18-.5765-2.6954-3.0178-4.7066-5.8877-4.7066-3.2521 0-5.91 2.5874-5.998 5.8183-.7924-.3565-1.6923-.322-2.4586.1491-1.1457.6914-1.6348 2.0502-1.2386 3.2748-.0661-.0069-.1315-.0069-.1969-.0069-1.3161.0354-2.4124 1.0657-2.4801 2.4056-.0069.0907-.0069.0907 0 .1815 0 .0722.0569.1291.1291.1291h16.1839c.0785 0 .146-.0496.1638-.1207l.0538-.2046v-.0093z"/>
    </svg>
);

const PythonIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
    </svg>
);

const GoIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274.047-.093.152-.245.304-.245h4.5c-.023.257-.023.514-.058.77-.105.77-.35 1.496-.745 2.162-.653 1.11-1.577 1.87-2.78 2.256-.946.304-1.882.327-2.793.058-1.006-.292-1.788-.878-2.338-1.753-.514-.822-.675-1.718-.584-2.662.14-1.472.826-2.674 1.975-3.602 1.006-.816 2.163-1.227 3.46-1.239 1.075-.012 2.08.245 2.96.886.456.327.816.722 1.087 1.18.07.117.046.187-.093.234z"/>
    </svg>
);

const RubyIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503 1.172 2.805-9.144-.03.007 1.018.206 2.109 4.042V5.2l3.563-.124-.534 2.065 2.076-.67 1.627-2.162-1.783-.992.78-1.156 3.314-.012 1.576-1.322-.837-.27z"/>
    </svg>
);

const PhpIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 01-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 01-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 01-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zm-2.595-1.382h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"/>
    </svg>
);

const AwsIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.216-.151-.24-.223a.535.535 0 01-.04-.2v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/>
    </svg>
);

import { IQQuizCompact } from "./iq-quiz-compact";
import { CODE_SNIPPETS } from "@/lib/constants/sdk-code-snippets";

// Framework icons mapping using inline SVG components (saves ~2MB vs react-icons barrel imports)
const FRAMEWORK_ICONS: Record<string, React.ReactNode> = {
    nodejs: <NodejsIcon className="w-4 h-4" />,
    vercel: <VercelIcon className="w-4 h-4" />,
    supabase: <Database className="w-4 h-4" />,
    deno: <DenoIcon className="w-4 h-4" />,
    cloudflare: <CloudflareIcon className="w-4 h-4" />,
    lambda: <AwsIcon className="w-4 h-4" />,
    python: <PythonIcon className="w-4 h-4" />,
    go: <GoIcon className="w-4 h-4" />,
    ruby: <RubyIcon className="w-4 h-4" />,
    php: <PhpIcon className="w-4 h-4" />,
};

export function SDKShowcase() {
    const [activeTab, setActiveTab] = useState("nodejs");
    const [copied, setCopied] = useState(false);

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success("Code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy code");
        }
    };

    const activeSnippet = CODE_SNIPPETS.find(s => s.id === activeTab);

    return (
        <section className="relative py-24 w-full bg-[#02040a]" id="sdk-showcase">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-40 blur-[130px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-30 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">Developer Experience</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Integrate in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Minutes
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Copy-paste ready code examples for your favorite framework.
                        Our IQ Quiz API is free and public - try it live!
                    </p>
                </motion.div>

                {/* Two-column layout - Code Left, Quiz Right */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                    {/* Left: Code Tabs - Takes remaining space */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:flex-1 min-w-0"
                    >
                        {/* Tab Navigation */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {CODE_SNIPPETS.map((snippet) => (
                                <button
                                    key={snippet.id}
                                    onClick={() => setActiveTab(snippet.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === snippet.id
                                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 border'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 border'
                                        }`}
                                >
                                    {FRAMEWORK_ICONS[snippet.id]}
                                    <span className="hidden sm:inline">{snippet.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Code Display */}
                        {activeSnippet && (
                            <div className="rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/10 shadow-2xl">
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {activeSnippet.label.toLowerCase().replace(/\s+/g, '-')}.{activeSnippet.language === 'javascript' ? 'js' : activeSnippet.language === 'typescript' ? 'ts' : activeSnippet.language}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(activeSnippet.code)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-400 hover:text-white"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                                <span className="text-green-500">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Code Block */}
                                <div className="p-4 overflow-x-auto max-h-[450px] overflow-y-auto">
                                    <SyntaxHighlighter
                                        language={activeSnippet.language}
                                        style={vscDarkPlus}
                                        customStyle={{
                                            background: "transparent",
                                            margin: 0,
                                            padding: 0,
                                            fontSize: "0.85rem",
                                            lineHeight: "1.6",
                                        }}
                                        showLineNumbers
                                        lineNumberStyle={{
                                            minWidth: "2.5em",
                                            paddingRight: "1em",
                                            color: "#4a5568",
                                            userSelect: "none",
                                        }}
                                    >
                                        {activeSnippet.code}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}

                    </motion.div>

                    {/* Right: Compact Quiz Demo - Fixed width, vertically centered */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-[400px] lg:flex-shrink-0 flex flex-col justify-center"
                    >
                        <div className="text-center mb-3">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Live Demo</span>
                        </div>
                        <IQQuizCompact />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

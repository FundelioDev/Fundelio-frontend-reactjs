import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Clapperboard, Gift, Briefcase, 
  Zap, Timer, CheckCircle2, ArrowRight, 
  Sparkles, PlayCircle, ShieldCheck 
} from 'lucide-react';

const CampaignSetupGuide = () => {
    const isDarkMode = false; 

    const basicSteps = [
        {
            icon: Briefcase,
            title: "Tiêu đề & Mô tả",
            desc: "Viết tiêu đề ngắn gọn và mô tả hấp dẫn để thu hút ngay từ cái nhìn đầu tiên.",
            color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
            border: "hover:border-blue-200 dark:hover:border-blue-800"
        },
        {
            icon: Zap,
            title: "Mục tiêu Tài chính",
            desc: "Đặt mục tiêu tối thiểu thực tế. Hãy tính toán cả chi phí sản xuất, marketing và phí nền tảng.",
            color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
            border: "hover:border-amber-200 dark:hover:border-amber-800"
        },
        {
            icon: Clapperboard,
            title: "Hình ảnh đại diện",
            desc: "Đây là bộ mặt của dự án, hãy chọn hình ảnh sắc nét và chuyên nghiệp nhất.",
            color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
            border: "hover:border-purple-200 dark:hover:border-purple-800"
        },
        {
            icon: Timer,
            title: "Thời gian chạy",
            desc: "30-45 ngày là khoảng thời gian vàng. Đủ dài để lan tỏa, nhưng đủ ngắn để tạo cảm giác cấp bách.",
            color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
            border: "hover:border-rose-200 dark:hover:border-rose-800"
        },
    ];

    return (
        <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-500 font-sans`}>
            
            {/* HERO HEADER */}
            <div className="relative pt-20 pb-24 px-6 lg:px-8 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4" /> 
                        <span>Hướng dẫn khởi tạo</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white leading-tight">
                        Kiến tạo chiến dịch <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Thành công rực rỡ
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Chỉ với 3 bước chuẩn bị kỹ lưỡng, bạn đã sẵn sàng biến ý tưởng thành hiện thực trên Fundelio.
                    </p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 -mt-0.01 relative z-20 pb-20 space-y-24">
                
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-500/30">1</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin cơ bản</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Nền móng vững chắc cho dự án</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {basicSteps.map((step, index) => (
                            <div key={index} className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${step.border} group h-full flex flex-col min-h-[280px]`}>
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-500/30">2</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Câu chuyện & Hình ảnh</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Kết nối cảm xúc với Backer</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-xl font-bold">Nội dung thuyết phục</h3>
                            </div>

                            <div className="space-y-5 relative z-10">
                                {[
                                    { title: "Vấn đề & Giải pháp", text: "Bắt đầu bằng vấn đề bạn đang giải quyết và tại sao giải pháp của bạn là duy nhất." },
                                    { title: "Sử dụng nguồn vốn", text: "Minh bạch về cách bạn sẽ sử dụng số tiền gây quỹ được." },
                                    { title: "Lời kêu gọi (CTA)", text: "Nói rõ ràng bạn cần backer làm gì và họ sẽ nhận được gì." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full h-fit">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group h-full">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <PlayCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold">Video Chiến dịch</h3>
                                </div>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    Dự án có video thường gọi vốn thành công hơn <strong>50%</strong>. Hãy quay một video ngắn (1-3 phút) chân thực, đầy cảm hứng.
                                </p>
                            </div>

                            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-400" /> Yêu cầu kỹ thuật
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                                    <li>Độ phân giải tối thiểu 720p (HD).</li>
                                    <li>Định dạng MP4 hoặc Link Youtube/Vimeo.</li>
                                    <li>Âm thanh rõ ràng, nên có phụ đề.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-500/30">3</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thiết kế Phần thưởng</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Động lực để Backer "xuống tiền"</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            <div className="md:col-span-1">
                                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                                    <Gift className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Chiến lược giá</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Đừng chỉ tạo 1 mức giá. Hãy tạo "phễu" để phục vụ nhiều đối tượng backer khác nhau.
                                </p>
                            </div>

                            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm opacity-75 scale-95">
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Cơ bản</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">150.000đ</div>
                                    <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded-full my-3"></div>
                                    <p className="text-xs text-gray-500">Lời cảm ơn + Ebook kỹ thuật số.</p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-2 border-indigo-500 shadow-xl relative transform md:-translate-y-4">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Phổ biến nhất</div>
                                    <div className="text-xs font-bold text-indigo-600 mb-1">Tiêu chuẩn</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">500.000đ</div>
                                    <div className="h-1 w-12 bg-indigo-200 rounded-full my-3"></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Sản phẩm chính + Phụ kiện + Freeship.</p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm opacity-75 scale-95 sm:col-span-2 md:col-span-1 md:col-start-2">
                                    <div className="text-xs font-bold text-purple-500 uppercase mb-1">VIP</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">2.000.000đ</div>
                                    <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded-full my-3"></div>
                                    <p className="text-xs text-gray-500">Combo giới hạn + Tên trên bảng vàng.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <div className="pb-24 px-6">
                <div className="max-w-6xl mx-auto bg-gray-900 dark:bg-white rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
                    
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-colors duration-500"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-colors duration-500"></div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white dark:text-gray-900 mb-6">
                            Đã sẵn sàng tạo nên lịch sử?
                        </h2>
                        <p className="text-lg text-gray-300 dark:text-gray-600 mb-10 max-w-2xl mx-auto">
                            Đừng để ý tưởng mãi nằm trên giấy. Hàng ngàn backer đang chờ đợi sản phẩm đột phá tiếp theo từ bạn.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                             <Link
                                to="/campaigns/create"
                                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center min-w-[200px] dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
                            >
                                <Zap className="w-5 h-5 mr-2 fill-current" /> Bắt đầu ngay
                            </Link>
                            <Link 
                                to="/search"
                                className="px-8 py-4 bg-transparent border border-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center min-w-[200px] dark:border-gray-300 dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Xem thêm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CampaignSetupGuide;
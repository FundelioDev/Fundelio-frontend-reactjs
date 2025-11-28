import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Sun, TrendingUp, Target, Award, Users,
  CheckCircle, XCircle, ArrowRight, Shield, Rocket,
  DollarSign, Clock, Layers
} from 'lucide-react';

const AboutFundelioPage = () => {

  const steps = [
    {
      step: "01",
      icon: Target,
      title: "Khởi tạo",
      desc: "Founder thiết lập mục tiêu vốn & quà tặng (Rewards).",
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30"
    },
    {
      step: "02",
      icon: Users,
      title: "Huy động",
      desc: "Backer ủng hộ (Pledge) để nhận quyền lợi sớm.",
      color: "text-amber-400",
      borderColor: "border-amber-500/30"
    },
    {
      step: "03",
      icon: Clock,
      title: "Về đích",
      desc: "Hệ thống chốt sổ khi hết hạn chiến dịch.",
      color: "text-blue-400",
      borderColor: "border-blue-500/30"
    },
    {
      step: "04",
      icon: Award,
      title: "Hoàn tất",
      desc: "Thành công: Giải ngân. Thất bại: Hoàn tiền 100%.",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-bold mb-8 uppercase tracking-wider shadow-lg shadow-cyan-500/10">
            <Rocket className="w-4 h-4" /> Bệ phóng khởi nghiệp Việt
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight text-white">
            Hiện thực hóa ý tưởng cùng <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-500">
              Fundelio
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Nền tảng Crowdfunding minh bạch, nơi nguồn vốn gặp gỡ ánh sáng sáng tạo.
            Biến dự án trên giấy thành sản phẩm trên tay.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/campaigns/create" 
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              Tạo Chiến Dịch
            </Link>

            <Link 
              to="/home" 
              className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white rounded-xl font-bold transition-all inline-flex items-center justify-center"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </div>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/50 transition-colors group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Fund <span className="text-sm font-normal text-slate-500">(Fundus)</span></h3>
            <p className="text-slate-400 text-sm">Nền tảng tài chính vững chắc. Đại diện cho nguồn vốn và sự bảo đảm nguồn lực.</p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-amber-500/50 transition-colors group">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Elio <span className="text-sm font-normal text-slate-500">(Helios)</span></h3>
            <p className="text-slate-400 text-sm">Ánh sáng mặt trời. Biểu tượng cho sự minh bạch, soi đường và dẫn lối.</p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-amber-500/20 blur-2xl" />
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" /> Sứ mệnh
            </h3>
            <p className="text-slate-300 font-medium">
              "Trao quyền cho cộng đồng để biến những ý tưởng đột phá thành hiện thực thông qua mô hình <span className="text-cyan-400">Reward-based Crowdfunding</span>."
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Quy Trình Hoạt Động</h2>
            <p className="text-slate-400">Đơn giản. Minh bạch. An toàn.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 -z-10" />
            
            {steps.map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className={`w-24 h-24 rounded-full bg-slate-950 border-4 ${item.borderColor} flex flex-col items-center justify-center mb-6 shadow-xl z-10 transition-transform group-hover:scale-110 duration-300`}>
                  <item.icon className={`w-8 h-8 ${item.color} mb-1`} />
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest">{item.step}</span>
                </div>
                <h3 className={`text-lg font-bold text-white mb-2`}>{item.title}</h3>
                <p className="text-sm text-slate-400 px-2">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-emerald-400 mb-1">Thành công (Goal Met)</h4>
                <p className="text-sm text-emerald-100/70">Founder nhận vốn (trừ 5% phí). Backer nhận quà.</p>
              </div>
            </div>
            <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-xl flex items-start gap-4">
              <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-400 mb-1">Không đạt (Goal Missed)</h4>
                <p className="text-sm text-red-100/70">Dự án hủy. <span className="font-bold underline">Hoàn tiền 100%</span> cho Backer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
         <h2 className="text-3xl font-bold text-center text-white mb-12">Tại sao chọn Fundelio?</h2>
         <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Minh Bạch 100%", desc: "Dữ liệu đóng góp cập nhật Real-time." },
              { icon: Zap, title: "Tập Trung Ý Tưởng", desc: "Ưu tiên tính khả thi hơn quy mô vốn." },
              { icon: TrendingUp, title: "Hiệu Suất Cao", desc: "Cơ chế All-or-Nothing bảo vệ quyền lợi." }
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 hover:bg-slate-900 rounded-xl transition-colors">
                 <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-white">
                   <v.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                 <p className="text-slate-400 text-sm">{v.desc}</p>
              </div>
            ))}
         </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden text-center p-12 lg:p-16 border border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-amber-500/10 z-0" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bạn đã sẵn sàng kiến tạo tương lai?</h2>
            <Link to="/campaigns/create" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-white/10">
              Bắt đầu ngay <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutFundelioPage;
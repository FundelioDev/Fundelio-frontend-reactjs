import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, TrendingUp, Users,
  Quote, Zap, Award, ArrowUpRight, Lightbulb, Heart
} from 'lucide-react';

const SuccessStoriesPage = () => {
  const spotlightStory = {
    id: 1,
    category: "Công nghệ đột phá",
    title: "EcoPack: Balo năng lượng mặt trời",
    author: "Minh TechLab",
    raised: "2.5 Tỷ VND",
    percent: 520,
    backers: 3400,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200",
    quote: "Fundelio không chỉ giúp tôi gọi vốn, mà còn giúp tôi tìm thấy 3.000 khách hàng trung thành đầu tiên.",
    storyText: [
      "Ban đầu, EcoPack chỉ là bản vẽ trên giấy với mục tiêu tạo ra chiếc ba lô vừa thời trang vừa thân thiện môi trường. Nhưng điều làm nên sự khác biệt là việc tích hợp tấm pin mặt trời siêu mỏng để sạc các thiết bị điện tử. Đây là một thách thức lớn về kỹ thuật và thiết kế.",
      "Chiến dịch đã bùng nổ vượt ngoài mong đợi, không chỉ vì sản phẩm mà còn vì câu chuyện về lối sống xanh mà đội ngũ Minh TechLab truyền tải. Với số tiền gây quỹ vượt mục tiêu 520%, họ đã chuyển từ mô hình khởi nghiệp nhỏ sang dây chuyền sản xuất quy mô lớn chỉ trong 6 tháng.",
      "Thành công này chứng minh rằng, cộng đồng luôn sẵn sàng ủng hộ những ý tưởng giải quyết vấn đề thực tế và mang lại giá trị bền vững cho xã hội."
    ],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
  };

  const inspirationalStories = [
    {
      id: 2,
      category: "Văn hóa & Nghệ thuật",
      icon: Lightbulb,
      title: "Sài Gòn Phố & Hẻm",
      raised: "500 Triệu VND",
      percent: 150,
      image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=800",
      intro: "Bộ Artbook tái hiện ký ức Sài Gòn qua những nét màu nước tinh tế, gây quỹ thành công nhờ chạm đến nỗi nhớ chung của người Việt.",
      detail: "Mục tiêu ban đầu chỉ là in 500 cuốn, nhưng với sự ủng hộ nồng nhiệt, dự án đã in được 3.000 bản đặc biệt và tổ chức thành công triển lãm khắp ba miền. Đây là minh chứng cho sức mạnh của văn hóa địa phương."
    },
    {
      id: 3,
      category: "Board Game Lịch sử",
      icon: Award,
      title: "Sử Hộ Vương",
      raised: "1.2 Tỷ VND",
      percent: 300,
      image: "https://images.unsplash.com/photo-1610890716171-6b1c9f2bd405?auto=format&fit=crop&q=80&w=800",
      intro: "Game thẻ bài chiến thuật đưa các nhân vật lịch sử Việt Nam vào cuộc chơi, thu hút kỷ lục người ủng hộ trẻ tuổi.",
      detail: "Chiến dịch đạt 300% mục tiêu trong 48 giờ. Đội ngũ đã sử dụng vốn để phát triển thêm các bản mở rộng, hợp tác với nhà sử học để đảm bảo tính chính xác, và xây dựng một cộng đồng game thủ lớn mạnh, yêu thích lịch sử."
    },
    {
      id: 4,
      category: "Ẩm thực Xanh",
      icon: Heart,
      title: "Cà Phê Organic Farm",
      raised: "800 Triệu VND",
      percent: 110,
      image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
      intro: "Mô hình cà phê bền vững, hỗ trợ nông dân vùng cao. Câu chuyện thành công về việc kết hợp lợi nhuận và trách nhiệm xã hội.",
      detail: "Mặc dù chỉ vượt mục tiêu 110%, dự án này tạo ra ảnh hưởng lớn. Số vốn được dùng để mua hạt cà phê trực tiếp từ nông trại không qua trung gian, giúp cải thiện sinh kế cho hàng chục hộ gia đình và xây dựng thương hiệu cà phê đạo đức."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-500">
      
      <div className="relative pt-24 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" /> Tuyển Tập Thành Công
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            Những Khởi Đầu <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 dark:from-green-400 dark:to-emerald-500">
              Đã Thay Đổi Cuộc Chơi
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Khám phá chi tiết hành trình biến ý tưởng thành sản phẩm được cộng đồng đón nhận nồng nhiệt.
          </p>
        </div>
      </div>
      
      ---

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 dark:bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl relative group">

                <div className="grid lg:grid-cols-2 gap-0 lg:gap-12 items-center">
                    <div className="relative h-96 lg:h-full overflow-hidden rounded-t-[2rem] lg:rounded-l-[2rem] lg:rounded-tr-none">
                        <img
                            src={spotlightStory.image}
                            alt={spotlightStory.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-900 shadow-lg">
                            <Star className="w-3 h-3 inline-block mr-1 text-yellow-500 mb-0.5" /> Spotlight
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 lg:py-16 flex flex-col justify-center relative z-10">
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                            {spotlightStory.category}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                            {spotlightStory.title}
                        </h2>

                        <div className="text-gray-300 space-y-4 mb-8">
                            {spotlightStory.storyText.map((text, index) => (
                                <p key={index}>{text}</p>
                            ))}
                        </div>

                        <div className="mb-8 relative p-4 bg-white/10 rounded-xl">
                            <Quote className="absolute -top-2 left-4 w-6 h-6 text-indigo-400/50" />
                            <p className="text-gray-200 italic relative z-10 pl-2">
                                "{spotlightStory.quote}"
                            </p>
                            <div className="flex items-center mt-4 pl-2">
                                <img src={spotlightStory.avatar} alt="Author" className="w-8 h-8 rounded-full mr-3 border border-white/20" />
                                <span className="text-sm font-medium text-white">{spotlightStory.author}</span>
                            </div>
                        </div>

                        <Link
                            to={`/campaigns/${spotlightStory.id}`}
                            className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all w-fit group/btn"
                        >
                            Đọc toàn bộ câu chuyện
                            <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>

      ---

      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">💡 Những Lát Cắt Cảm Hứng</h2>
                <p className="text-gray-500">Tóm tắt các dự án nổi bật, truyền cảm hứng từ các lĩnh vực khác nhau.</p>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {inspirationalStories.map((story) => (
                <Link to={`/campaigns/${story.id}`} key={story.id} className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <story.icon className="w-3 h-3"/> {story.category}
                        </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {story.title}
                        </h3>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">
                            {story.intro}
                        </p>

                        <blockquote className="text-xs text-gray-700 dark:text-gray-300 border-l-2 border-green-500 pl-3 italic mt-auto pt-4">
                          {story.detail}
                        </blockquote>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div>
                                <div className="text-xs text-gray-500">Gây quỹ</div>
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">{story.raised}</div>
                            </div>
                            <div className={`text-sm font-bold text-indigo-600 dark:text-indigo-400`}>
                                Đạt {story.percent}%
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      ---

      <section className="bg-indigo-50 dark:bg-gray-900/50 border-y border-indigo-100 dark:border-gray-800 py-16 px-6">
          <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                      { label: "Dự án thành công", val: "15,000+", icon: Award },
                      { label: "Tổng số tiền gây quỹ", val: "500 Tỷ+", icon: Zap },
                      { label: "Người ủng hộ", val: "2.5 Triệu", icon: Users },
                      { label: "Tỷ lệ thành công", val: "85%", icon: TrendingUp },
                  ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mb-4">
                              <stat.icon className="w-6 h-6" />
                          </div>
                          <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.val}</div>
                          <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      ---

      <div className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-indigo-900 dark:to-purple-900 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                      Câu chuyện tiếp theo <br/> có thể là của bạn
                  </h2>
                  <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                      Đừng giữ ý tưởng đó trong đầu nữa. Fundelio cung cấp nền tảng và công cụ để bạn tỏa sáng.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link
                          to="/campaigns/create"
                          className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold text-lg transform hover:scale-105 transition-all shadow-lg flex items-center justify-center min-w-[200px]"
                      >
                          Bắt đầu dự án
                      </Link>
                      <Link
                          to="/launch"
                          className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center min-w-[200px]"
                      >
                          Xem hướng dẫn
                      </Link>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default SuccessStoriesPage;
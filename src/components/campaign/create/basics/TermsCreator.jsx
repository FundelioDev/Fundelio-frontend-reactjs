import { X } from 'lucide-react';
import Button from '@/components/common/Button';

export default function TermsCreator({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-darker-2 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-light dark:border-white/10">
                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white">
                        Điều khoản dịch vụ dành cho Creator
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Đóng"
                    >
                        <X className="w-5 h-5 text-text-primary dark:text-white" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                        <div className="space-y-6 text-muted-foreground">
                            {/* Intro */}
                            <p className="text-sm sm:text-base leading-relaxed">
                                <strong>ĐIỀU KHOẢN DỊCH VỤ DÀNH CHO CREATOR (TOSC)</strong>
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Chúng tôi rất vui vì bạn quyết định trở thành Creator và sử dụng các Dịch vụ của Fundelio. Việc bạn hiểu rõ các quy tắc hợp tác là cực kỳ quan trọng. Chúng tôi tin rằng sự minh bạch và rõ ràng là nền tảng cho một mối quan hệ lâu dài và vững chắc. Vì vậy, dưới đây là phần tóm tắt và nội dung chính của Điều khoản Dịch vụ cho Creator (“TOSC”) – là nền tảng cho việc chúng ta làm việc cùng nhau.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Khi sử dụng Fundelio với tư cách Creator, Người dùng cần có tài khoản cá nhân đang hoạt động và đồng ý với <strong>Điều khoản Sử dụng Fundelio (Terms of Service – “TOS”)</strong> và TOSC này. Việc bạn chấp nhận TOSC và hoàn tất quy trình onboarding đồng nghĩa với việc giao kết Hợp đồng giữa Fundelio và bạn, cho phép bạn truy cập các tính năng dành riêng cho Creator trên Nền tảng.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                TOSC là một phần không tách rời của TOS và áp dụng cho các Dịch vụ liên quan đến Creator. Tất cả các thuật ngữ viết hoa sẽ có nghĩa như trong TOS của Fundelio, trừ khi được giải thích khác trong TOSC. Trong trường hợp có mâu thuẫn giữa TOS và TOSC, <strong>TOSC sẽ được ưu tiên áp dụng</strong> đối với các vấn đề liên quan đến Creator.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Để sử dụng Dịch vụ Fundelio và trở thành Creator, bạn cần trải qua quy trình onboarding, bao gồm việc cung cấp thêm thông tin và tài liệu cần thiết cho việc xác minh và tuân thủ quy định pháp luật, quy định về thanh toán.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Fundelio được xây dựng như một nền tảng crowdfunding kết hợp Pledge Manager cho các Dự án gọi vốn trên Nền tảng. Đây là công cụ giúp Creator tổ chức chiến dịch crowdfunding và quản lý hậu kỳ (ví dụ: thu thập thông tin giao hàng, quản lý đặt hàng và vận chuyển Reward cho Backer).
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Một số Dịch vụ của Fundelio – đặc biệt là các dịch vụ liên quan đến crowdfunding và Pledge Manager – có thể tính phí. Creator xác nhận rằng, ngoài <strong>phí hoa hồng</strong> trên số tiền huy động được, Creator còn có thể chịu <strong>phí xử lý thanh toán</strong> và các loại phí khác (nếu có).
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator chịu trách nhiệm hoàn toàn đối với mọi nội dung đăng tải trên Nền tảng liên quan đến Dự án. Fundelio <strong>không phải là một bên trong hợp đồng</strong> giữa Creator và Backer. Creator là bên duy nhất chịu trách nhiệm đối với Dự án và Reward (bao gồm lỗi vật lý, pháp lý…).
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed">
                                <strong>Quyền sở hữu trí tuệ</strong> là cốt lõi của hoạt động sáng tạo của Creator, đồng thời cũng rất quan trọng với các Dịch vụ mà chúng tôi cung cấp. Vui lòng tôn trọng quyền sở hữu trí tuệ của Fundelio và các Creator khác. Để cung cấp Dịch vụ, trong thời gian Hợp đồng có hiệu lực, Creator cấp cho Fundelio giấy phép không độc quyền đối với các nội dung mà Creator xuất bản trên Nền tảng.
                            </p>

                            {/* TOC */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                Mục lục
                            </h3>
                            <ul className="list-decimal list-inside space-y-2 text-sm sm:text-base">
                                <li>Phạm vi Dịch vụ</li>
                                <li>Crowdfunding</li>
                                <li>Pledge / Pledge Manager</li>
                                <li>Phí</li>
                                <li>Xoá tài khoản hoặc Dự án</li>
                                <li>Trách nhiệm</li>
                                <li>Sở hữu trí tuệ</li>
                                <li>Điều khoản cuối cùng</li>
                            </ul>

                            {/* 1. PHẠM VI DỊCH VỤ */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                1. PHẠM VI DỊCH VỤ
                            </h3>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                1.1 Quy định chung
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Khi sử dụng Fundelio với tư cách Creator, Người dùng phải:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                                <li>Có tài khoản cá nhân đang hoạt động; và</li>
                                <li>Đồng ý với Điều khoản Sử dụng Fundelio (TOS) và TOSC này.</li>
                            </ul>

                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Việc bạn chấp nhận TOSC và hoàn tất quy trình onboarding đồng nghĩa với việc giao kết Hợp đồng giữa Fundelio và bạn, cho phép sử dụng các tính năng Creator trên Nền tảng.
                            </p>

                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio cung cấp cho Creator các Dịch vụ, bao gồm nhưng không giới hạn:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                                <li>Tổ chức và quản lý các Dự án crowdfunding trên Nền tảng.</li>
                                <li>Tạo nội dung, hình ảnh, mô tả về Dự án và Reward hiển thị cho Backer.</li>
                                <li>Thiết lập quy tắc tính phí vận chuyển, phương thức giao hàng cho các đơn đặt hàng của Backer.</li>
                                <li>Quản lý Dự án, bao gồm mời cộng sự tham gia đồng quản lý Dự án và phân quyền.</li>
                                <li>Sử dụng các công cụ marketing hỗ trợ quảng bá Dự án.</li>
                                <li>Thu thập thông tin về Reward mà Backer chọn, các đơn hàng trong Dự án.</li>
                                <li>Quản lý Pledge trong phạm vi Dự án của Creator.</li>
                                <li>Cung cấp công cụ để Creator nhận tiền từ Backer (nếu Creator chọn dùng dịch vụ này).</li>
                                <li>Tạo link giới thiệu / referral.</li>
                                <li>Hỗ trợ Creator trong việc xử lý một số tranh chấp với Backer (trong phạm vi khả năng của Fundelio).</li>
                                <li>Cung cấp hạ tầng cho trao đổi thông tin, cập nhật và xử lý hoàn tiền trong Dự án.</li>
                            </ul>

                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Điều khoản chi tiết giữa Creator và Backer về Dự án (bao gồm điều kiện đặt hàng, hoàn tiền, giao hàng…) do Creator tự thiết lập và phải công khai cho Backer trong suốt thời gian Dự án cho đến khi hoàn tất giao Reward. Khi ủng hộ Dự án, Backer đồng ý với <strong>điều khoản riêng của Creator</strong> và giao kết hợp đồng trực tiếp với Creator. Fundelio <strong>không phải là một bên trong hợp đồng đó.</strong>
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Các bên trong hợp đồng (Creator – Backer) tự chịu trách nhiệm với nhau về việc thực hiện nghĩa vụ của mình (giao Reward, hỗ trợ hậu mãi, sử dụng khoản ủng hộ đúng cam kết…). Fundelio và đơn vị trung gian thanh toán <strong>không giám sát</strong> và <strong>không chịu trách nhiệm</strong> về việc thực hiện đúng hạn các nghĩa vụ này.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Creator thừa nhận rằng nếu muốn tổ chức <strong>chiến dịch crowdfunding</strong> trên Nền tảng, Creator sẽ cần sử dụng Pledge Manager cho Dự án đó (giai đoạn hậu chiến dịch). Fundelio <strong>không cung cấp dịch vụ chỉ crowdfunding mà không có Pledge Manager.</strong>
                            </p>

                            {/* 2. CROWDFUNDING */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                2. CROWDFUNDING
                            </h3>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                2.1 Onboarding
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Trước khi cho phép khởi chạy Dự án, Fundelio và/hoặc đối tác trung gian thanh toán có thể tiến hành xác minh thông tin Creator, mô hình kinh doanh, chủ sở hữu và người đại diện Creator.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Tùy từng trường hợp, Creator có thể được yêu cầu cung cấp:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                                <li>Giấy tờ pháp lý của tổ chức/doanh nghiệp (nếu Creator là pháp nhân).</li>
                                <li>Giấy uỷ quyền nếu người ký hợp đồng không phải là đại diện pháp luật.</li>
                                <li>Thông tin tài khoản ngân hàng để nhận tiền.</li>
                                <li>Giấy tờ xác minh danh tính của cá nhân sở hữu chính và người đại diện ký kết.</li>
                                <li>Các thông tin bổ sung phục vụ tuân thủ quy định về thuế, phòng chống rửa tiền và các quy định pháp lý khác (nếu có).</li>
                            </ul>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Bằng việc cung cấp thông tin/tài liệu, Creator đồng ý cho phép Fundelio chia sẻ dữ liệu cần thiết với đối tác thanh toán nhằm mục đích xác minh và xử lý thanh toán. Creator có thể cần chấp nhận thêm điều khoản riêng của đối tác thanh toán.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Nếu không vượt qua bước xác minh hoặc đánh giá rủi ro, Fundelio có quyền từ chối cho khởi chạy Dự án.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                2.2 Gửi Dự án đầu tiên
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Sau khi hoàn tất onboarding, Creator có thể gửi Dự án để Fundelio duyệt. Tùy loại Dự án, Creator cần cung cấp tối thiểu:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                                <li>Tên Creator và thông tin liên hệ.</li>
                                <li>Địa chỉ trụ sở hoặc nơi cư trú.</li>
                                <li>Mô tả chi tiết Dự án, mục tiêu vốn, thời gian kết thúc crowdfunding.</li>
                                <li>Danh sách Reward, thời gian dự kiến giao hàng.</li>
                                <li>Rủi ro &amp; thách thức của Dự án.</li>
                                <li>Chính sách hoàn tiền / hủy Pledge liên quan đến Dự án.</li>
                            </ul>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio sẽ thông báo cho Creator qua email về việc chấp nhận hoặc từ chối Dự án. Dự án bắt đầu vào thời điểm Creator nhận được thông báo chấp thuận, hoặc thời điểm bắt đầu do Creator đặt sau đó.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                2.3 Gửi các Dự án tiếp theo
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Khi gửi Dự án mới, Fundelio có thể yêu cầu Creator bổ sung lại một phần hoặc toàn bộ thông tin như ở mục 2.2 và có quyền cập nhật/bổ sung thông tin Creator định kỳ.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                2.4 Thu tiền từ Backer
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Fundelio và đối tác thanh toán cung cấp công cụ để Creator thu tiền ủng hộ từ Backer cho từng Dự án. Quy trình thanh toán tuân theo điều khoản riêng của đối tác thanh toán.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Thông thường, Backer chỉ bị trừ tiền khi Dự án đạt mục tiêu. Nếu dùng phương thức thanh toán tức thời và Dự án không đạt mục tiêu, khoản tiền này sẽ được hoàn lại cho Backer.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio không đảm bảo toàn bộ số tiền mà Backer cam kết sẽ thu đủ 100% (ví dụ thẻ hết hạn, tài khoản không đủ tiền, Backer không cập nhật thông tin…). Tiền sẽ được chuyển cho Creator trong thời hạn hợp lý về tài khoản ngân hàng mà Creator đăng ký.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Trong các trường hợp đặc biệt (nghi ngờ gian lận, giao dịch bất thường…), Fundelio có thể yêu cầu Creator hoàn trả một phần hoặc toàn bộ khoản tiền đã thu để xử lý hoàn tiền, chargeback. Creator có nghĩa vụ phối hợp và chịu các chi phí phát sinh liên quan nếu lỗi/vi phạm thuộc về Creator.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                2.5 Hủy Dự án crowdfunding
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator có quyền hủy Dự án crowdfunding bất kỳ lúc nào trước ngày kết thúc. Trong trường hợp đó, Fundelio sẽ không trừ tiền Backer hoặc hoàn trả khoản đã thu cho Backer nếu thanh toán đã được thực hiện.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Việc thay đổi ngày kết thúc crowdfunding chỉ được chấp nhận trong những trường hợp đặc biệt và có thể yêu cầu Creator cung cấp thêm thông tin/chứng cứ. Khi Creator hủy crowdfunding và quyết định không tiếp tục gọi vốn trên Nền tảng, Creator có thể đăng một số bản cập nhật giới hạn trên trang Dự án, sau đó Fundelio có thể lưu trữ/đóng lưu trữ (archive) Dự án.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                2.6 Late Pledge
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Nếu Dự án crowdfunding thành công và Creator cho phép, Backer vẫn có thể Pledge muộn (Late Pledge) sau khi chiến dịch chính kết thúc. Khi Dự án chuyển sang Pledge Manager, Backer sẽ được yêu cầu bổ sung thông tin giao hàng, thuế nếu cần.
                            </p>

                            {/* 3. PLEDGE / PLEDGE MANAGER */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                3. PLEDGE / PLEDGE MANAGER
                            </h3>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                3.1 Quy định chung
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator có thể lựa chọn sử dụng Pledge Manager dưới các hình thức: (a) Pledge Manager là một phần của Dự án crowdfunding trên Fundelio; (b) Pledge Manager cho các nền tảng bên ngoài (nếu Fundelio có hỗ trợ).
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Khi sử dụng Pledge Manager, Creator tiếp tục dùng công cụ thanh toán do Fundelio và đối tác thanh toán cung cấp để thu thêm tiền từ Backer (ví dụ: add-on, nâng cấp, phí ship…).
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Creator tự chịu trách nhiệm cho mọi vấn đề liên quan đến vận chuyển, giao hàng và hoàn tất Reward giữa mình và Backer.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                3.2 Pledge Manager cho Dự án crowdfunding trên Fundelio
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator dùng Pledge Manager để quản lý các Pledge đã thu trong chiến dịch, ví dụ: thu thập địa chỉ giao hàng, cho phép Backer mua thêm add-on, nâng cấp Pledge, tính toán phí ship, thuế…
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Một số tính năng Pledge Manager có thể tính phí và Creator vẫn phải chịu phí xử lý thanh toán cho các giao dịch phát sinh.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                3.3 Pledge Manager cho nền tảng bên ngoài (nếu có)
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Nếu Creator muốn dùng Pledge Manager của Fundelio cho một chiến dịch đã gọi vốn trên nền tảng khác, Creator vẫn phải hoàn tất onboarding và gửi Dự án Pledge Manager để duyệt. Fundelio và đối tác thanh toán cung cấp công cụ thu tiền trong giai đoạn này. Creator chịu mọi khoản phí áp dụng theo mục 4. PHÍ.
                            </p>

                            <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mt-6 mb-3">
                                3.4 Quy định chung cho Pledge Manager
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Fundelio không đảm bảo thu đầy đủ số tiền Backer đã Pledge. Trong các trường hợp nghi ngờ gian lận, giao dịch bất thường, Fundelio có thể yêu cầu Creator hoàn trả tiền và chịu các chi phí liên quan (chargeback, phí ngân hàng…).
                            </p>

                            {/* 4. PHÍ */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                4. PHÍ
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator phải trả phí sử dụng một số Dịch vụ trên Nền tảng liên quan đến quản lý Dự án. Creator sẽ được thông báo về các loại phí này trong quá trình tạo Dự án hoặc tại trang thông tin phí chính thức của Fundelio.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Thông thường, Fundelio có thể thu:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                                <li><strong>Phí hoa hồng</strong> tính trên tổng số tiền đã thu thành công trong chiến dịch crowdfunding hoặc giai đoạn Pledge Manager.</li>
                                <li><strong>Phí Pledge Manager</strong> (nếu có).</li>
                                <li><strong>Phí xử lý thanh toán</strong> do đối tác thanh toán thu.</li>
                            </ul>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio và đối tác thanh toán sẽ khấu trừ các loại phí này trước khi chuyển tiền về cho Creator. Các khoản phí nói trên không hoàn lại. Creator tự chịu trách nhiệm đối với các loại phí, thuế bổ sung khác phát sinh theo pháp luật.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Nếu Dự án crowdfunding không đạt mục tiêu, Fundelio thường không thu phí hoa hồng từ Creator (nhưng một số loại phí khác – nếu có quy định – vẫn có thể phát sinh).
                            </p>

                            {/* 5. XOÁ TÀI KHOẢN HOẶC DỰ ÁN */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                5. XOÁ TÀI KHOẢN HOẶC DỰ ÁN
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator có thể xoá tài khoản hoặc Dự án bất cứ lúc nào trong phần cài đặt tài khoản. Khi đó, các quyền mà Fundelio đã được Creator cấp đối với nội dung trên Nền tảng vẫn tiếp tục có hiệu lực nếu được TOS/TOSC hoặc pháp luật cho phép.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Nếu việc xoá diễn ra trước khi kết thúc crowdfunding hoặc trong giai đoạn Pledge Manager, Fundelio có thể tiếp tục lưu trữ dữ liệu liên quan đến Creator và Dự án, hoặc cung cấp thông tin đó cho Backer nhằm giúp Backer có thể liên hệ Creator để nhận Reward. Fundelio có thể archive trang Dự án và để lại lịch sử Dự án hiển thị công khai.
                            </p>

                            {/* 6. TRÁCH NHIỆM */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                6. TRÁCH NHIỆM
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Creator hoàn toàn chịu trách nhiệm đối với mọi nội dung đăng lên Nền tảng liên quan đến Dự án. Fundelio không chịu trách nhiệm pháp lý cho nội dung này, nhưng sẽ can thiệp khi phát hiện (hoặc được báo cáo) nội dung vi phạm pháp luật, gian lận, lừa đảo, gây hiểu nhầm hoặc xâm hại quyền, lợi ích hợp pháp của bên thứ ba.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Creator chịu trách nhiệm thực hiện đầy đủ các cam kết trong Dự án và giao Reward đúng như mô tả. Nếu Creator không thực hiện được nghĩa vụ, Creator có thể phải chịu trách nhiệm pháp lý trước Backer theo quy định pháp luật hiện hành và chính sách riêng của Creator.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio không chịu trách nhiệm về việc Creator kê khai và nộp thuế. Mọi nội dung hiển thị trên Nền tảng chỉ mang tính tham khảo và không phải là tư vấn pháp lý/thuế. Creator tự chịu rủi ro khi sử dụng Dịch vụ Fundelio và có nghĩa vụ thực hiện đầy đủ nghĩa vụ thuế, phí khác theo luật.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio có thể yêu cầu Creator cung cấp tài sản bảo đảm để phòng ngừa rủi ro hoàn tiền, chargeback nếu cần.
                            </p>

                            {/* 7. SỞ HỮU TRÍ TUỆ */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                7. SỞ HỮU TRÍ TUỆ
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Khi sử dụng Dịch vụ Fundelio, Creator cấp cho Fundelio một giấy phép không độc quyền, trên phạm vi toàn cầu, có thể chuyển giao và được phép cấp lại, để sử dụng các quyền tác giả, nhãn hiệu, quyền về hình ảnh, quyền cơ sở dữ liệu trong phạm vi cần thiết để cung cấp và cải thiện Dịch vụ.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Fundelio có thể sử dụng nội dung Dự án, Reward và thông tin về Creator cho mục đích hiển thị trên Nền tảng, truyền thông, giới thiệu Dự án tới cộng đồng, cũng như nghiên cứu UX/UI nhằm cải thiện sản phẩm.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Creator cam kết nội dung mình đăng tải không xâm phạm quyền của User khác hoặc bên thứ ba. Nếu có khiếu nại cho rằng Fundelio vi phạm quyền sở hữu trí tuệ do nội dung Creator cung cấp, Creator đồng ý hợp tác, đứng ra xử lý, bồi thường hợp lý cho Fundelio theo yêu cầu của cơ quan có thẩm quyền hoặc theo thoả thuận liên quan.
                            </p>

                            {/* 8. ĐIỀU KHOẢN CUỐI CÙNG */}
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">
                                8. ĐIỀU KHOẢN CUỐI CÙNG
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                TOSC là một phần không tách rời của Điều khoản Sử dụng Fundelio (TOS) và áp dụng cho các Dịch vụ liên quan đến Creator. Trong trường hợp có mâu thuẫn giữa TOS và TOSC, đối với các vấn đề liên quan đến Creator, TOSC sẽ được ưu tiên áp dụng.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed mt-4">
                                Phiên bản mới nhất của TOSC luôn được cập nhật trên Nền tảng. Việc bạn tiếp tục sử dụng Dịch vụ Fundelio sau khi TOSC được cập nhật đồng nghĩa với việc bạn chấp nhận phiên bản mới đó.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 sm:p-6 border-t border-border-light dark:border-white/10">
                    <Button
                        onClick={onClose}
                        variant="gradient"
                        className="px-6 py-2"
                    >
                        Đã hiểu
                    </Button>
                </div>
            </div>
        </div>
    );
}

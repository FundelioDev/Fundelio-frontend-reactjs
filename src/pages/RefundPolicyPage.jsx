import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      {/* Header */}
      <div className="bg-white dark:bg-darker border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <RefreshCw className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Chính Sách Hoàn Tiền
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-darker rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <DollarSign className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  1. Giới thiệu
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Tại <span className="font-semibold text-primary">Fundelio</span>, chúng tôi hiểu rằng đôi khi 
                  bạn có thể cần hoàn tiền cho các khoản đóng góp của mình. Chính sách này giải thích các điều 
                  kiện và quy trình hoàn tiền trên nền tảng của chúng tôi.
                </p>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <section>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2 text-lg">
                    ⚠️ Lưu ý quan trọng
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Gây quỹ cộng đồng trên Fundelio là hình thức ủng hộ dựa trên niềm tin. Khi bạn đóng góp 
                    cho một chiến dịch, bạn đang hỗ trợ ý tưởng và người tạo chiến dịch, không phải mua sản phẩm. 
                    Vì vậy, việc hoàn tiền có những hạn chế nhất định.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* When Refunds Are Available */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  2. Khi nào được hoàn tiền
                </h2>
                
                <div className="space-y-4">
                  {/* Case 1 */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          2.1. Chiến dịch không đạt mục tiêu
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Nếu chiến dịch sử dụng mô hình "Tất cả hoặc không gì" (All-or-Nothing) và không đạt 
                          mục tiêu gây quỹ trong thời hạn, tất cả người ủng hộ sẽ được hoàn tiền đầy đủ tự động 
                          trong vòng 5-7 ngày làm việc.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          2.2. Giao dịch bị lỗi kỹ thuật
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Nếu bạn bị tính phí nhiều lần cho cùng một đóng góp do lỗi hệ thống, chúng tôi sẽ 
                          hoàn lại các khoản phí trùng lặp ngay lập tức.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case 3 */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          2.3. Chiến dịch vi phạm điều khoản
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Nếu Fundelio xác định chiến dịch vi phạm điều khoản sử dụng (gian lận, lừa đảo, 
                          nội dung bất hợp pháp), chiến dịch sẽ bị đình chỉ và người ủng hộ được hoàn tiền.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case 4 */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          2.4. Trong vòng 24 giờ kể từ khi đóng góp
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Bạn có thể yêu cầu hoàn tiền trong vòng 24 giờ đầu tiên sau khi đóng góp, 
                          với điều kiện chiến dịch chưa kết thúc. Vui lòng liên hệ bộ phận hỗ trợ khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* When Refunds Are NOT Available */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  3. Khi nào KHÔNG được hoàn tiền
                </h2>
                
                <div className="space-y-4">
                  {/* Case 1 */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✗
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          3.1. Chiến dịch đã thành công và nhận tiền
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Sau khi chiến dịch kết thúc thành công và tiền đã được chuyển cho người tạo chiến dịch, 
                          Fundelio không thể hoàn tiền. Mọi vấn đề về phần thưởng hoặc thực hiện cam kết cần được 
                          giải quyết trực tiếp với người tạo chiến dịch.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✗
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          3.2. Thay đổi ý định
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Nếu bạn đơn giản thay đổi ý định về việc ủng hộ sau 24 giờ hoặc không hài lòng 
                          với cách chiến dịch phát triển (nhưng không có gian lận), hoàn tiền sẽ không được chấp nhận.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case 3 */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✗
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          3.3. Phần thưởng chậm trễ hoặc không như mong đợi
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Fundelio không chịu trách nhiệm về chất lượng, thời gian giao hàng hoặc sự khác biệt 
                          giữa phần thưởng thực tế và mô tả. Vui lòng liên hệ trực tiếp với người tạo chiến dịch.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case 4 */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        ✗
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          3.4. Phí dịch vụ và phí giao dịch
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Các khoản phí dịch vụ của Fundelio và phí xử lý thanh toán từ cổng thanh toán 
                          không được hoàn lại trong mọi trường hợp.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Clock className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  4. Quy trình hoàn tiền
                </h2>
                
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Nếu bạn đủ điều kiện hoàn tiền, vui lòng làm theo các bước sau:
                  </p>

                  {/* Step 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Liên hệ hỗ trợ khách hàng
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Gửi email đến <span className="text-primary font-semibold">support@fundelio.com</span> với 
                        tiêu đề "Yêu cầu hoàn tiền - [Mã đơn hàng]"
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Cung cấp thông tin
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        Bao gồm các thông tin sau trong email:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                        <li>• Tên đầy đủ và email đăng ký</li>
                        <li>• Mã giao dịch hoặc mã đơn hàng</li>
                        <li>• Tên chiến dịch</li>
                        <li>• Lý do yêu cầu hoàn tiền</li>
                        <li>• Bằng chứng (nếu có): ảnh chụp màn hình, email từ người tạo chiến dịch, v.v.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Đợi xem xét
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Đội ngũ của chúng tôi sẽ xem xét yêu cầu trong vòng <span className="font-semibold">3-5 ngày làm việc</span> 
                        và phản hồi qua email.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Nhận hoàn tiền
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Nếu được chấp thuận, tiền sẽ được hoàn về phương thức thanh toán gốc trong vòng 
                        <span className="font-semibold"> 7-14 ngày làm việc</span> (tùy thuộc vào ngân hàng/cổng thanh toán).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Giải quyết tranh chấp
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Nếu bạn có tranh chấp với người tạo chiến dịch về phần thưởng hoặc thực hiện cam kết:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-primary font-bold mt-1">1.</span>
                  <p>Liên hệ trực tiếp với người tạo chiến dịch qua hệ thống nhắn tin trên Fundelio</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary font-bold mt-1">2.</span>
                  <p>Nếu không giải quyết được, báo cáo vấn đề cho Fundelio qua email hỗ trợ</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary font-bold mt-1">3.</span>
                  <p>Fundelio sẽ đóng vai trò trung gian để hỗ trợ giải quyết (nhưng không đảm bảo kết quả)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary font-bold mt-1">4.</span>
                  <p>Trong trường hợp nghiêm trọng, bạn có thể cần tìm kiếm giải pháp pháp lý độc lập</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chargebacks */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Chargeback (Hoàn tiền qua ngân hàng)
            </h2>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-5">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-500 mt-1 flex-shrink-0" />
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Lưu ý:</span> Việc yêu cầu chargeback trực tiếp với ngân hàng 
                    mà không liên hệ Fundelio trước có thể dẫn đến:
                  </p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>• Tài khoản của bạn bị đình chỉ hoặc khóa</li>
                    <li>• Mất quyền truy cập vào các phần thưởng và nội dung độc quyền</li>
                    <li>• Không được sử dụng nền tảng Fundelio trong tương lai</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mt-3">
                    Vui lòng liên hệ với chúng tôi trước để tìm giải pháp hợp lý!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Thay đổi chính sách
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Fundelio có quyền thay đổi chính sách hoàn tiền này bất kỳ lúc nào. Các thay đổi sẽ 
                có hiệu lực ngay khi được công bố trên trang web. Chúng tôi khuyến khích bạn xem xét 
                định kỳ để cập nhật thông tin mới nhất.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Liên hệ hỗ trợ
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nếu bạn có câu hỏi về chính sách hoàn tiền hoặc cần hỗ trợ, vui lòng liên hệ:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><span className="font-semibold">Email:</span> support@fundelio.com</p>
                <p><span className="font-semibold">Email hoàn tiền:</span> refund@fundelio.com</p>
                <p><span className="font-semibold">Điện thoại:</span> 1900 xxxx (8:00 - 18:00, T2-T6)</p>
                <p><span className="font-semibold">Thời gian phản hồi:</span> Trong vòng 24-48 giờ</p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/terms-of-service" 
            className="px-6 py-3 bg-white dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
          >
            Điều khoản sử dụng
          </Link>
          <Link 
            to="/privacy-policy" 
            className="px-6 py-3 bg-white dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
          >
            Chính sách riêng tư
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;


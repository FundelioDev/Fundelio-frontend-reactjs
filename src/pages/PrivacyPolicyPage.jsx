import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
} from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-dark'>
      {/* Header */}
      <div className='bg-white dark:bg-darker border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <Link
            to='/'
            className='inline-flex items-center text-primary hover:text-primary-600 transition-colors'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Quay lại trang chủ
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl'>
        {/* Title Section */}
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-4'>
            <div className='p-4 bg-green-100 dark:bg-green-900 rounded-full'>
              <Shield className='w-12 h-12 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Chính Sách Riêng Tư
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Main Content */}
        <div className='bg-white dark:bg-darker rounded-xl shadow-lg p-8 space-y-8'>
          {/* Introduction */}
          <section>
            <div className='flex items-start space-x-3 mb-4'>
              <Eye className='w-6 h-6 text-primary mt-1 flex-shrink-0' />
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                  1. Giới thiệu
                </h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  Tại{' '}
                  <span className='font-semibold text-primary'>Fundelio</span>,
                  chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân
                  của bạn. Chính sách này mô tả cách chúng tôi thu thập, sử
                  dụng, lưu trữ và bảo vệ dữ liệu của bạn khi sử dụng nền tảng
                  của chúng tôi.
                </p>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <div className='flex items-start space-x-3 mb-4'>
              <Database className='w-6 h-6 text-blue-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  2. Thông tin chúng tôi thu thập
                </h2>

                <div className='space-y-6'>
                  {/* Account Information */}
                  <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      2.1. Thông tin tài khoản
                    </h3>
                    <div className='space-y-2 text-gray-700 dark:text-gray-300 text-sm'>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Họ và tên, địa chỉ email, số điện thoại</p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Tên người dùng và mật khẩu (được mã hóa)</p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Ảnh đại diện và thông tin hồ sơ</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      2.2. Thông tin thanh toán
                    </h3>
                    <div className='space-y-2 text-gray-700 dark:text-gray-300 text-sm'>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>
                          Thông tin thẻ thanh toán (được xử lý bởi bên thứ ba
                          bảo mật)
                        </p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Lịch sử giao dịch và đóng góp</p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Địa chỉ thanh toán và thông tin hóa đơn</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Information */}
                  <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      2.3. Thông tin sử dụng
                    </h3>
                    <div className='space-y-2 text-gray-700 dark:text-gray-300 text-sm'>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Địa chỉ IP, loại trình duyệt, hệ điều hành</p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Thời gian truy cập và các trang đã xem</p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold mt-1'>•</span>
                        <p>Cookies và dữ liệu theo dõi tương tự</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className='flex items-start space-x-3 mb-4'>
              <UserCheck className='w-6 h-6 text-green-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  3. Cách chúng tôi sử dụng thông tin
                </h2>
                <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                  <p className='leading-relaxed'>
                    Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
                  </p>
                  <div className='space-y-2 ml-4'>
                    <div className='flex items-start space-x-2'>
                      <span className='text-green-500 font-bold mt-1'>✓</span>
                      <p>
                        Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi
                      </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-green-500 font-bold mt-1'>✓</span>
                      <p>Xử lý giao dịch và thanh toán</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-green-500 font-bold mt-1'>✓</span>
                      <p>Gửi thông báo về chiến dịch, cập nhật và khuyến mại</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-green-500 font-bold mt-1'>✓</span>
                      <p>Phát hiện và ngăn chặn gian lận, lạm dụng</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-green-500 font-bold mt-1'>✓</span>
                      <p>
                        Phân tích và nghiên cứu để cải thiện trải nghiệm người
                        dùng
                      </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-green-500 font-bold mt-1'>✓</span>
                      <p>Tuân thủ các nghĩa vụ pháp lý</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className='flex items-start space-x-3 mb-4'>
              <Globe className='w-6 h-6 text-purple-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  4. Chia sẻ thông tin
                </h2>
                <div className='space-y-4 text-gray-700 dark:text-gray-300'>
                  <p className='leading-relaxed'>
                    Chúng tôi có thể chia sẻ thông tin của bạn trong các trường
                    hợp sau:
                  </p>

                  <div className='space-y-3'>
                    <div className='border-l-4 border-purple-500 pl-4'>
                      <h4 className='font-semibold mb-1'>
                        Với người tạo chiến dịch
                      </h4>
                      <p className='text-sm'>
                        Thông tin cần thiết để thực hiện cam kết và giao phần
                        thưởng
                      </p>
                    </div>

                    <div className='border-l-4 border-purple-500 pl-4'>
                      <h4 className='font-semibold mb-1'>
                        Với nhà cung cấp dịch vụ
                      </h4>
                      <p className='text-sm'>
                        Xử lý thanh toán, phân tích dữ liệu, dịch vụ email
                      </p>
                    </div>

                    <div className='border-l-4 border-purple-500 pl-4'>
                      <h4 className='font-semibold mb-1'>
                        Theo yêu cầu pháp lý
                      </h4>
                      <p className='text-sm'>
                        Tuân thủ lệnh của tòa án hoặc yêu cầu từ cơ quan chức
                        năng
                      </p>
                    </div>

                    <div className='border-l-4 border-purple-500 pl-4'>
                      <h4 className='font-semibold mb-1'>
                        Trong trường hợp sáp nhập hoặc mua lại
                      </h4>
                      <p className='text-sm'>
                        Nếu công ty được bán hoặc sáp nhập với tổ chức khác
                      </p>
                    </div>
                  </div>

                  <div className='bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-4'>
                    <p className='text-sm font-semibold'>
                      ⚠️ Chúng tôi KHÔNG bán thông tin cá nhân của bạn cho bên
                      thứ ba vì mục đích marketing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className='flex items-start space-x-3 mb-4'>
              <Lock className='w-6 h-6 text-red-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  5. Bảo mật dữ liệu
                </h2>
                <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                  <p className='leading-relaxed'>
                    Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn công
                    nghiệp để bảo vệ thông tin của bạn:
                  </p>
                  <div className='grid md:grid-cols-2 gap-4 mt-4'>
                    <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-4'>
                      <h4 className='font-semibold mb-2'>🔒 Mã hóa SSL/TLS</h4>
                      <p className='text-sm'>
                        Mọi dữ liệu truyền tải được mã hóa
                      </p>
                    </div>
                    <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-4'>
                      <h4 className='font-semibold mb-2'>🛡️ Tường lửa</h4>
                      <p className='text-sm'>
                        Bảo vệ máy chủ khỏi truy cập trái phép
                      </p>
                    </div>
                    <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-4'>
                      <h4 className='font-semibold mb-2'>
                        🔑 Xác thực 2 yếu tố
                      </h4>
                      <p className='text-sm'>
                        Tùy chọn bảo mật nâng cao cho tài khoản
                      </p>
                    </div>
                    <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-4'>
                      <h4 className='font-semibold mb-2'>📊 Giám sát 24/7</h4>
                      <p className='text-sm'>
                        Phát hiện và ngăn chặn mối đe dọa
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              6. Quyền của bạn
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
              </p>
              <div className='space-y-2 ml-4'>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary font-bold mt-1'>→</span>
                  <p>
                    <span className='font-semibold'>Quyền truy cập:</span> Yêu
                    cầu bản sao dữ liệu cá nhân của bạn
                  </p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary font-bold mt-1'>→</span>
                  <p>
                    <span className='font-semibold'>Quyền sửa đổi:</span> Cập
                    nhật hoặc sửa thông tin không chính xác
                  </p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary font-bold mt-1'>→</span>
                  <p>
                    <span className='font-semibold'>Quyền xóa:</span> Yêu cầu
                    xóa dữ liệu cá nhân (với một số ngoại lệ)
                  </p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary font-bold mt-1'>→</span>
                  <p>
                    <span className='font-semibold'>Quyền hạn chế:</span> Yêu
                    cầu hạn chế xử lý dữ liệu của bạn
                  </p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-primary font-bold mt-1'>→</span>
                  <p>
                    <span className='font-semibold'>Quyền phản đối:</span> Phản
                    đối việc xử lý dữ liệu cho mục đích marketing
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              7. Cookies và công nghệ theo dõi
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Chúng tôi sử dụng cookies và công nghệ tương tự để:
              </p>
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2'>
                <p>• Ghi nhớ thông tin đăng nhập và tùy chọn của bạn</p>
                <p>• Phân tích lưu lượng truy cập website</p>
                <p>• Cá nhân hóa nội dung và quảng cáo</p>
                <p>• Cải thiện hiệu suất và trải nghiệm người dùng</p>
              </div>
              <p className='leading-relaxed mt-3'>
                Bạn có thể quản lý cookie thông qua cài đặt trình duyệt của
                mình.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              8. Lưu trữ dữ liệu
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Chúng tôi lưu trữ dữ liệu cá nhân của bạn:
              </p>
              <div className='space-y-2 ml-4'>
                <p>• Trong thời gian tài khoản của bạn còn hoạt động</p>
                <p>• Cần thiết để cung cấp dịch vụ</p>
                <p>• Để tuân thủ các nghĩa vụ pháp lý</p>
                <p>• Để giải quyết tranh chấp và thực thi thỏa thuận</p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              9. Quyền riêng tư của trẻ em
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Dịch vụ của chúng tôi không dành cho người dưới 18 tuổi. Chúng
                tôi không cố ý thu thập thông tin cá nhân từ trẻ em. Nếu bạn là
                phụ huynh và phát hiện con bạn đã cung cấp thông tin cho chúng
                tôi, vui lòng liên hệ để chúng tôi có thể xóa.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              10. Thay đổi chính sách
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Chúng tôi có thể cập nhật chính sách này theo thời gian. Chúng
                tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào qua
                email hoặc thông báo trên nền tảng. Việc tiếp tục sử dụng dịch
                vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp
                nhận chính sách mới.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className='border-t border-gray-200 dark:border-gray-700 pt-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              11. Liên hệ về quyền riêng tư
            </h2>
            <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-6'>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                Nếu bạn có câu hỏi hoặc lo ngại về quyền riêng tư của mình, vui
                lòng liên hệ:
              </p>
              <div className='space-y-2 text-gray-700 dark:text-gray-300'>
                <p>
                  <span className='font-semibold'>Email:</span>{' '}
                  privacy@fundelio.com
                </p>
                <p>
                  <span className='font-semibold'>Điện thoại:</span> 1900 xxxx
                </p>
                <p>
                  <span className='font-semibold'>Địa chỉ:</span> Thành phố Hồ
                  Chí Minh, Việt Nam
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/terms-of-service'
            className='px-6 py-3 bg-white dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center'
          >
            Điều khoản sử dụng
          </Link>
          <Link
            to='/refund-policy'
            className='px-6 py-3 bg-white dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center'
          >
            Chính sách hoàn tiền
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Shield, AlertCircle } from 'lucide-react';

const TermsOfServicePage = () => {
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
            <div className='p-4 bg-primary-100 dark:bg-primary-900 rounded-full'>
              <Scale className='w-12 h-12 text-primary' />
            </div>
          </div>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Điều Khoản Sử Dụng
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
              <FileText className='w-6 h-6 text-primary mt-1 flex-shrink-0' />
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                  1. Giới thiệu
                </h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  Chào mừng bạn đến với{' '}
                  <span className='font-semibold text-primary'>Fundelio</span>.
                  Bằng việc truy cập và sử dụng nền tảng của chúng tôi, bạn đồng
                  ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.
                  Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
                </p>
              </div>
            </div>
          </section>

          {/* Account Terms */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              2. Điều khoản tài khoản
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Bạn phải từ 18 tuổi trở lên hoặc có sự đồng ý của cha mẹ/người
                  giám hộ để sử dụng dịch vụ.
                </p>
              </div>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Bạn có trách nhiệm duy trì tính bảo mật của tài khoản và mật
                  khẩu của mình.
                </p>
              </div>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Bạn chịu trách nhiệm về tất cả các hoạt động xảy ra dưới tài
                  khoản của mình.
                </p>
              </div>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Bạn không được tạo nhiều tài khoản với mục đích gian lận hoặc
                  lạm dụng hệ thống.
                </p>
              </div>
            </div>
          </section>

          {/* Campaign Creation */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              3. Tạo chiến dịch gây quỹ
            </h2>
            <div className='space-y-4 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                <span className='font-semibold'>3.1. Nội dung chiến dịch:</span>{' '}
                Người tạo chiến dịch phải đảm bảo rằng thông tin, hình ảnh và
                nội dung chiến dịch là chính xác, không vi phạm pháp luật, không
                xâm phạm quyền sở hữu trí tuệ của bên thứ ba.
              </p>
              <p className='leading-relaxed'>
                <span className='font-semibold'>3.2. Mục tiêu gây quỹ:</span>{' '}
                Mục tiêu gây quỹ phải thực tế và được sử dụng đúng mục đích đã
                cam kết với người ủng hộ.
              </p>
              <p className='leading-relaxed'>
                <span className='font-semibold'>3.3. Giới hạn nội dung:</span>{' '}
                Fundelio có quyền từ chối hoặc gỡ bỏ các chiến dịch có nội dung
                bạo lực, phân biệt đối xử, lừa đảo hoặc vi phạm pháp luật.
              </p>
            </div>
          </section>

          {/* Funding & Payments */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              4. Thanh toán và gây quỹ
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Fundelio thu phí dịch vụ từ các khoản đóng góp thành công (chi
                  tiết về phí sẽ được công bố rõ ràng).
                </p>
              </div>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Các khoản thanh toán được xử lý thông qua các cổng thanh toán
                  bảo mật của bên thứ ba.
                </p>
              </div>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Người ủng hộ sẽ nhận được xác nhận qua email sau khi hoàn tất
                  giao dịch.
                </p>
              </div>
              <div className='flex items-start space-x-2'>
                <span className='text-primary font-bold mt-1'>•</span>
                <p>
                  Tiền được chuyển đến người tạo chiến dịch sau khi chiến dịch
                  kết thúc thành công và trừ đi phí dịch vụ.
                </p>
              </div>
            </div>
          </section>

          {/* Rewards & Fulfillment */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              5. Phần thưởng và thực hiện cam kết
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Người tạo chiến dịch có trách nhiệm thực hiện tất cả các cam kết
                về phần thưởng đã hứa với người ủng hộ. Fundelio không chịu
                trách nhiệm về việc thực hiện hoặc chất lượng của các phần
                thưởng này.
              </p>
              <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start space-x-3'>
                <AlertCircle className='w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0' />
                <p className='text-yellow-800 dark:text-yellow-200 text-sm'>
                  <span className='font-semibold'>Lưu ý:</span> Người ủng hộ nên
                  hiểu rằng việc hỗ trợ một chiến dịch mang tính rủi ro và không
                  có gì đảm bảo rằng dự án sẽ hoàn thành hoặc phần thưởng sẽ
                  được giao đúng hạn.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className='flex items-start space-x-3 mb-4'>
              <Shield className='w-6 h-6 text-red-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                  6. Các hành vi bị cấm
                </h2>
                <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                  <p className='font-semibold'>Người dùng không được phép:</p>
                  <div className='space-y-2 ml-4'>
                    <div className='flex items-start space-x-2'>
                      <span className='text-red-500 font-bold mt-1'>✗</span>
                      <p>
                        Sử dụng nền tảng cho các mục đích bất hợp pháp hoặc gian
                        lận.
                      </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-red-500 font-bold mt-1'>✗</span>
                      <p>
                        Đăng tải nội dung vi phạm bản quyền, xúc phạm, hoặc gây
                        hại.
                      </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-red-500 font-bold mt-1'>✗</span>
                      <p>
                        Can thiệp, làm gián đoạn hoặc phá hoại hoạt động của nền
                        tảng.
                      </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-red-500 font-bold mt-1'>✗</span>
                      <p>
                        Thu thập dữ liệu người dùng khác mà không có sự đồng ý.
                      </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <span className='text-red-500 font-bold mt-1'>✗</span>
                      <p>Tạo chiến dịch giả mạo hoặc lừa đảo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              7. Quyền sở hữu trí tuệ
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Tất cả nội dung, logo, thương hiệu và tài sản trí tuệ trên nền
                tảng Fundelio thuộc quyền sở hữu của chúng tôi hoặc các bên cấp
                phép. Người dùng không được sao chép, phân phối hoặc sử dụng mà
                không có sự cho phép.
              </p>
            </div>
          </section>

          {/* Liability Limitation */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              8. Giới hạn trách nhiệm
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Fundelio không chịu trách nhiệm về:
              </p>
              <div className='space-y-2 ml-4'>
                <div className='flex items-start space-x-2'>
                  <span className='text-gray-400 font-bold mt-1'>•</span>
                  <p>
                    Thiệt hại trực tiếp hoặc gián tiếp phát sinh từ việc sử dụng
                    nền tảng.
                  </p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-gray-400 font-bold mt-1'>•</span>
                  <p>Nội dung do người dùng tạo ra và đăng tải.</p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-gray-400 font-bold mt-1'>•</span>
                  <p>Tranh chấp giữa người tạo chiến dịch và người ủng hộ.</p>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='text-gray-400 font-bold mt-1'>•</span>
                  <p>
                    Mất mát dữ liệu hoặc gián đoạn dịch vụ do sự cố kỹ thuật.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              9. Thay đổi điều khoản
            </h2>
            <div className='space-y-3 text-gray-700 dark:text-gray-300'>
              <p className='leading-relaxed'>
                Fundelio có quyền thay đổi các điều khoản sử dụng bất kỳ lúc
                nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền
                tảng. Người dùng có trách nhiệm kiểm tra định kỳ để cập nhật các
                thay đổi.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className='border-t border-gray-200 dark:border-gray-700 pt-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              10. Liên hệ
            </h2>
            <div className='bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6'>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Sử dụng này, vui
                lòng liên hệ với chúng tôi:
              </p>
              <div className='space-y-2 text-gray-700 dark:text-gray-300'>
                <p>
                  <span className='font-semibold'>Email:</span>{' '}
                  support@fundelio.com
                </p>
                <p>
                  <span className='font-semibold'>Điện thoại:</span> 1900 xxxx
                </p>
                <p>
                  <span className='font-semibold'>Địa chỉ:</span> Hà Nội, Việt
                  Nam
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/privacy-policy'
            className='px-6 py-3 bg-white dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center'
          >
            Chính sách riêng tư
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

export default TermsOfServicePage;

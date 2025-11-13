import React, { useEffect } from 'react';

const TermsModal = ({ isOpen, onClose }) => {
    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                        Điều khoản và điều kiện nạp tiền
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] space-y-6 text-gray-700 dark:text-gray-300 scrollbar-primary">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                            1. Phạm vi áp dụng
                        </h3>
                        <p className="leading-relaxed">
                            Điều khoản và điều kiện này áp dụng cho việc nạp tiền vào ví điện tử Fundelio.
                            Khi thực hiện giao dịch nạp tiền, bạn đã đọc, hiểu rõ và đồng ý tuân thủ tất cả các
                            điều khoản được nêu trong tài liệu này. Ví Fundelio được sử dụng để thanh toán
                            các dịch vụ và tính năng trong hệ sinh thái của chúng tôi.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                            2. Phương thức thanh toán VNPay
                        </h3>
                        <p className="leading-relaxed mb-2">
                            Fundelio sử dụng cổng thanh toán VNPay để xử lý các giao dịch nạp tiền.
                            VNPay là một trong những cổng thanh toán điện tử uy tín tại Việt Nam, đảm bảo:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Bảo mật thông tin thanh toán theo tiêu chuẩn quốc tế PCI DSS</li>
                            <li>Hỗ trợ đa dạng phương thức: thẻ ATM nội địa, thẻ tín dụng quốc tế, ví điện tử</li>
                            <li>Xử lý giao dịch nhanh chóng, thường trong vòng vài phút</li>
                            <li>Hỗ trợ khách hàng 24/7 qua tổng đài và email</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                            3. Phí và hạn mức nạp tiền
                        </h3>
                        <p className="leading-relaxed mb-2">
                            <strong>Hạn mức giao dịch:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                            <li>Số tiền nạp tối thiểu: 10.000 VND</li>
                            <li>Số tiền nạp tối đa mỗi lần: 50.000.000 VND</li>
                            <li>Tổng số tiền nạp tối đa mỗi ngày: 100.000.000 VND</li>
                            <li>Số lần nạp tiền không giới hạn (trong hạn mức cho phép)</li>
                        </ul>
                        <p className="leading-relaxed">
                            <strong>Phí giao dịch:</strong> Fundelio không thu phí nạp tiền. Tuy nhiên,
                            ngân hàng hoặc nhà cung cấp dịch vụ thanh toán của bạn có thể áp dụng phí riêng.
                            Vui lòng kiểm tra với ngân hàng của bạn để biết thêm chi tiết.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                            4. Chính sách hoàn tiền
                        </h3>
                        <p className="leading-relaxed mb-2">
                            <strong>Trường hợp được hoàn tiền:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                            <li>Tài khoản ngân hàng đã bị trừ tiền nhưng số dư ví không được cập nhật sau 24 giờ</li>
                            <li>Giao dịch bị lỗi do hệ thống của Fundelio hoặc VNPay</li>
                            <li>Nạp trùng lặp do lỗi kỹ thuật</li>
                        </ul>
                        <p className="leading-relaxed mb-2">
                            <strong>Trường hợp không được hoàn tiền:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                            <li>Người dùng nhập sai thông tin tài khoản hoặc số tiền</li>
                            <li>Đã sử dụng số dư trong ví để thanh toán</li>
                            <li>Yêu cầu hoàn tiền sau 30 ngày kể từ ngày giao dịch</li>
                        </ul>
                        <p className="leading-relaxed">
                            Thời gian xử lý hoàn tiền: 7-14 ngày làm việc kể từ khi yêu cầu được chấp thuận.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                            5. Bảo mật thông tin thanh toán
                        </h3>
                        <p className="leading-relaxed mb-2">
                            Fundelio cam kết bảo vệ thông tin cá nhân và tài chính của bạn:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Tất cả thông tin thanh toán được mã hóa bằng công nghệ SSL 256-bit</li>
                            <li>Chúng tôi không lưu trữ thông tin thẻ tín dụng/thẻ ATM của bạn</li>
                            <li>Giao dịch được xử lý qua cổng thanh toán an toàn của VNPay</li>
                            <li>Hệ thống giám sát 24/7 để phát hiện và ngăn chặn giao dịch gian lận</li>
                            <li>Thông tin cá nhân không được chia sẻ với bên thứ ba mà không có sự đồng ý</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                            6. Trách nhiệm của người dùng
                        </h3>
                        <p className="leading-relaxed mb-2">
                            Khi sử dụng dịch vụ nạp tiền, bạn có trách nhiệm:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                            <li>Cung cấp thông tin chính xác và đầy đủ khi thực hiện giao dịch</li>
                            <li>Bảo mật thông tin tài khoản và mật khẩu của bạn</li>
                            <li>Kiểm tra kỹ thông tin trước khi xác nhận thanh toán</li>
                            <li>Thông báo ngay cho Fundelio nếu phát hiện giao dịch bất thường</li>
                            <li>Không sử dụng dịch vụ cho mục đích phi pháp hoặc gian lận</li>
                            <li>Tuân thủ các quy định pháp luật hiện hành về thanh toán điện tử</li>
                        </ul>
                        <p className="leading-relaxed">
                            Bạn chịu hoàn toàn trách nhiệm về các giao dịch được thực hiện từ tài khoản của mình.
                            Fundelio không chịu trách nhiệm về các tổn thất phát sinh do việc tiết lộ thông tin
                            tài khoản hoặc sử dụng sai mục đích.
                        </p>
                    </section>

                    {/* Additional Notes */}
                    <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">
                            📌 Lưu ý quan trọng
                        </h3>
                        <ul className="space-y-1 text-sm">
                            <li>• Luôn kiểm tra email xác nhận sau mỗi giao dịch</li>
                            <li>• Lưu giữ biên lai/mã giao dịch để tra cứu khi cần thiết</li>
                            <li>• Liên hệ bộ phận hỗ trợ khách hàng qua email: support@Fundelio.com hoặc hotline: 1900-xxxx nếu có thắc mắc</li>
                            <li>• Điều khoản có thể được cập nhật, vui lòng kiểm tra định kỳ</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;

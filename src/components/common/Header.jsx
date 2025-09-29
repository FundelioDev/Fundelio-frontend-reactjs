import React from 'react';

const Header = ({ variant = 'light' }) => {
  // Định nghĩa các variant cho header
  const headerVariants = {
    light: {
      container: 'bg-[#fff] text-text-primary',
      title: 'text-text-primary',
      navLink: 'text-text-primary hover:text-primary',
    },
    primary: {
      container: 'bg-primary text-text-white',
      title: 'text-text-white',
      navLink: 'text-text-white hover:text-secondary',
    },
  };

  const currentVariant = headerVariants[variant];

  return (
    <header className={`${currentVariant.container} py-4 px-6 shadow-lg`}>
      <div className="container mx-auto flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${currentVariant.title}`}>
          FundFountain
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                className={`${currentVariant.navLink} transition-colors font-medium`}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${currentVariant.navLink} transition-colors font-medium`}
              >
                Về chúng tôi
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${currentVariant.navLink} transition-colors font-medium`}
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

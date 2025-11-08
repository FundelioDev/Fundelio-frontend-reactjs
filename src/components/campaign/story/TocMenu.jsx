import React, { useEffect } from 'react';

/**
 * TocMenu — NestJS-like timeline with dots + vertical line
 */
const TocMenu = ({ blanks = [], activeId, onClickItem }) => {
  useEffect(() => {
    console.log('📋 TocMenu received:', {
      blanksCount: blanks.length,
      activeId,
      blankIds: blanks.map((b) => b.id),
    });
  }, [activeId, blanks]);

  if (!blanks?.length) return null;

  const handleClick = (id) => {
    if (onClickItem) return onClickItem(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="sticky top-[88px] max-h-[calc(100vh-88px)] overflow-auto pr-2 scrollbar-primary"
      aria-label="Story sections"
    >
      {/* Timeline wrapper */}
      <div
        className="
          relative pl-6
          before:absolute before:left-[17px] before:top-4 before:bottom-4
          before:w-px before:bg-border
        "
      >
        <ul className="space-y-1">
          {blanks.map((b, idx) => {
            const isActive = activeId === b.id;

            return (
              <li key={b.id}>
                <button
                  onClick={() => handleClick(b.id)}
                  className={`
                    group relative w-full text-left py-2 pr-3 pl-4 rounded-md
                    transition-colors duration-200
                   
                    ${
                      isActive
                        ? 'text-primary font-semibold'
                        : 'text-text-secondary dark:text-white'
                    }
                  `}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Dot */}
                  <span
                    className={`
                      absolute left-[-11px] top-1/2 -translate-y-1/2
                      h-2.5 w-2.5 rounded-full border
                      ${
                        isActive
                          ? 'bg-primary border-primary'
                          : 'bg-muted border-border'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {/* Optional first big dot style (like NestJS) */}
                  {idx === 0 && (
                    <span
                      className={`
                        absolute left-[-12px] top-1/2 -translate-y-1/2
                        h-3 w-3 rounded-full
                        ${isActive ? 'bg-primary' : 'bg-muted'}
                      `}
                      aria-hidden="true"
                      style={{ opacity: 0 }} // purely decorative; keep for easy tweak
                    />
                  )}

                  <span className="block truncate">{b.title_text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default TocMenu;

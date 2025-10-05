import React from 'react';

/**
 * BlankSection Component
 * Renders a single blank section with title and content HTML
 */
const BlankSection = ({ blank }) => {
  const { id, order, title_html, content_html } = blank;

  return (
    <section
      id={id}
      data-blank
      data-order={order}
      className="scroll-mt-24 mb-8 last:mb-0"
    >
      {/* Title */}
      {title_html && (
        <h2
          className="text-2xl font-semibold mb-3 text-foreground dark:text-text-white"
          dangerouslySetInnerHTML={{ __html: title_html }}
        />
      )}

      {/* Content */}
      {content_html && (
        <div
          className="prose prose-neutral dark:prose-invert max-w-none [&>*]:my-3 
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-foreground dark:[&>h2]:text-text-white
            [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-foreground dark:[&>h3]:text-text-white
            [&>p]:text-text-secondary [&>p]:leading-relaxed dark:[&>p]:text-text-white
            [&>img]:max-w-full [&>img]:h-auto [&>img]:block [&>img]:mx-auto [&>img]:my-4 [&>img]:rounded-xl
            [&>iframe]:w-full [&>iframe]:aspect-video [&>iframe]:rounded-xl [&>iframe]:my-4
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-3 [&>ul]:text-text-secondary dark:[&>ul]:text-text-white
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-3 [&>ol]:text-text-secondary dark:[&>ol]:text-text-white
            [&>a]:text-primary [&>a]:underline [&>a]:hover:text-primary-600"
          dangerouslySetInnerHTML={{ __html: content_html }}
        />
      )}
    </section>
  );
};

export default BlankSection;

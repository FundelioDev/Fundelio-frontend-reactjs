import { Toaster } from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import CreateCampaignTabs from '@/components/create/CreateCampaignTabs';

export default function CreateCampaignPage() {
  const {
    blanks,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    setActiveEditor,
    scrollToBlank,
    save,
  } = useBlanks();

  const handleAddBlank = () => {
    const newId = addBlank();
    // Wait for DOM update then scroll
    setTimeout(() => scrollToBlank(newId), 100);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black">

        <div
          className="w-full mx-auto px-4 py-6"
          style={{ maxWidth: 'var(--max-width-container)' }}
        >
          <CreateCampaignTabs
            blanks={blanks}
            activeEditorRef={activeEditorRef}
            onAddBlank={handleAddBlank}
            onTitleChange={updateTitle}
            onContentChange={updateContent}
            setActiveEditor={setActiveEditor}
            scrollToBlank={scrollToBlank}
            save={save}
          />
        </div>

        {/* <Footer /> */}
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

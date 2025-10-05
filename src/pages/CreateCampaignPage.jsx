import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import StoryToolbar from '@/components/create/StoryToolbar';
import SidebarTOC from '@/components/create/SidebarTOC';
import BlankSection from '@/components/create/BlankSection';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Menu } from 'lucide-react';

export default function CreateCampaignPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        {/* <Header variant="light" /> */}

        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 left-6 z-40 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all lg:hidden"
          title="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className="w-full mx-auto px-4 py-6"
          style={{ maxWidth: 'var(--max-width-container)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar - Mobile: slide-in, Desktop/Laptop: sticky */}
            <aside
              className={`
                fixed lg:sticky 
                lg:top-20 
                bottom-0 left-0 
                h-[calc(100vh-5rem)] lg:h-auto lg:max-h-[75vh]
                w-[280px] 
                bg-white dark:bg-black 

                border-gray-300 dark:border-gray-700
                transition-transform duration-300 
                rounded-r-lg
                z-40
                ${
                  isSidebarOpen
                    ? 'translate-x-0'
                    : '-translate-x-full lg:translate-x-0'
                }
               
                lg:self-start
              `}
            >
              <SidebarTOC
                blanks={blanks}
                onAddBlank={handleAddBlank}
                onNavigate={(id) => {
                  scrollToBlank(id);
                  setIsSidebarOpen(false);
                }}
              />
            </aside>

            {/* Main Content */}
            <main className="w-full min-w-0">
              {/* Toolbar */}
              <StoryToolbar activeEditorRef={activeEditorRef} onSave={save} />

              {/* Blanks */}
              <div className="mt-18">
                {blanks.map((blank) => (
                  <BlankSection
                    key={blank.id}
                    blank={blank}
                    onTitleChange={updateTitle}
                    onContentChange={updateContent}
                    onFocus={setActiveEditor}
                  />
                ))}
              </div>

              {/* Add Blank Button at Bottom */}
              <button
                onClick={handleAddBlank}
                className="flex items-center justify-center w-full py-3 mb-8 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-black hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors group"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  + Thêm blank
                </span>
              </button>
            </main>
          </div>
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

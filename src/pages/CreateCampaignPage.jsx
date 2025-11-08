import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import CreateCampaignTabs from '@/components/campaign/create/CreateCampaignTabs';
import CreateCampaignHeader from '@/components/common/CreateCampaignHeader';
import Footer from '@/components/common/Footer';
import { generatePreviewId, savePreviewData } from '@/utils/previewStorage';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story');

  // Get data from Redux
  const basicsData = useSelector((state) => state.campaign.basics);
  const rewardsData = useSelector((state) => state.campaign.rewards);

  // Story state management (using Redux via useBlanks hook)
  const {
    blanks,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    reorderBlanks,
    deleteBlank,
    setActiveEditor,
    scrollToBlank,
    save,
  } = useBlanks();

  const handleAddBlank = () => {
    const newId = addBlank();
    // Wait for DOM update then scroll
    setTimeout(() => scrollToBlank(newId), 100);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handlePreview = () => {
    // Validate basics data
    if (!basicsData || !basicsData.title || !basicsData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin cơ bản (Tiêu đề và Mô tả)');
      setActiveTab('basic');
      return;
    }

    // Collect all campaign data from Redux
    const campaignData = {
      // Basics
      basics: basicsData,

      // Story
      story: {
        blanks: blanks.map((blank, index) => ({
          id: blank.id,
          order: index,
          title_text: blank.titleText,
          title_html: blank.titleHtml,
          content_html: blank.contentHtml,
        })),
      },

      // Rewards - send complete rewards object
      rewards: {
        rewards: rewardsData.rewards || [],
        addOns: rewardsData.addOns || [],
        items: rewardsData.items || [],
      },
    };

    // Generate unique preview ID
    const previewId = generatePreviewId();

    // Save to sessionStorage (will automatically handle large images)
    const saved = savePreviewData(previewId, campaignData);

    if (!saved) {
      toast.error('Không thể lưu dữ liệu preview. Vui lòng thử lại.');
      return;
    }

    // Navigate with full state including images (for immediate access)
    navigate(`/campaigns/preview/${previewId}`, {
      state: { campaignData, isPreview: true },
    });

    toast.success('Đang chuyển đến trang xem trước...');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f6f8ff] dark:bg-darker transition-colors duration-300">
        {/* New Header with Tabs */}
        <CreateCampaignHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPreview={handlePreview}
        />

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div
            className="w-full mx-auto px-4 sm:px-20 pt-36 md:pt-24 pb-12"
            style={{ maxWidth: 'var(--max-width-container)' }}
          >
            <CreateCampaignTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              blanks={blanks}
              activeEditorRef={activeEditorRef}
              onAddBlank={handleAddBlank}
              onTitleChange={updateTitle}
              onContentChange={updateContent}
              onReorderBlanks={reorderBlanks}
              onDeleteBlank={deleteBlank}
              setActiveEditor={setActiveEditor}
              scrollToBlank={scrollToBlank}
              save={save}
            />
          </div>
        </main>

        {/* Footer */}
        <Footer />
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

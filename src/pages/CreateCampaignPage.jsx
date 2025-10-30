import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import { useRewardsState } from '@/hooks/useRewardsState';
import { useLocalStorage } from '@/hooks/useLocalStorge';
import CreateCampaignTabs from '@/components/create/CreateCampaignTabs';
import CreateCampaignHeader from '@/components/common/CreateCampaignHeader';
import Footer from '@/components/common/Footer';
import { generatePreviewId, savePreviewData } from '@/utils/previewStorage';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story');
  const [isEditing, setIsEditing] = useState(false);
  const [saveCallback, setSaveCallback] = useState(null);
  const [cancelCallback, setCancelCallback] = useState(null);

  // Story state management
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

  // Rewards state management
  const { state: rewardsState, dispatch: rewardsDispatch } = useRewardsState();

  // Basics data from localStorage (managed by BasicsContent component)
  const { value: basicsData } = useLocalStorage('ff:campaign-basics', null);

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
    if (!basicsData || !basicsData.title || !basicsData.desc) {
      toast.error('Vui lòng điền đầy đủ thông tin cơ bản (Tiêu đề và Mô tả)');
      setActiveTab('basic');
      return;
    }

    // Collect all campaign data
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
      
      // Rewards
      rewards: rewardsState.rewards,
      addOns: rewardsState.addOns,
      items: rewardsState.items,
    };

    // Generate unique preview ID
    const previewId = generatePreviewId();

    // Create lighter version for sessionStorage (remove large base64 images)
    const lightCampaignData = {
      ...campaignData,
      basics: {
        ...campaignData.basics,
        // Keep only URLs, not base64 data
        image_url: campaignData.basics.image_url?.startsWith('data:') 
          ? '[BASE64_IMAGE]' 
          : campaignData.basics.image_url,
        intro_video_url: campaignData.basics.intro_video_url?.startsWith('data:') 
          ? '[BASE64_VIDEO]' 
          : campaignData.basics.intro_video_url,
      }
    };

    // Save lighter version to sessionStorage (for refresh support)
    const saved = savePreviewData(previewId, lightCampaignData);
    
    if (!saved) {
      toast.error('Không thể lưu dữ liệu preview. Vui lòng thử lại.');
      return;
    }

    // Navigate with full state including images (for fast access)
    navigate(`/campaigns/preview/${previewId}`, {
      state: { campaignData, isPreview: true },
    });
    
    toast.success('Đang chuyển đến trang xem trước...');
  };

  const handleCancel = () => {
    if (cancelCallback && typeof cancelCallback === 'function') {
      cancelCallback();
    }
    setIsEditing(false);
    setSaveCallback(null);
    setCancelCallback(null);
  };

  const handleSave = () => {
    if (saveCallback && typeof saveCallback === 'function') {
      saveCallback();
    }
    // Don't set isEditing to false here - let the form handler do it after successful save
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f6f8ff] dark:bg-darker transition-colors duration-300">
        {/* New Header with Tabs */}
        <CreateCampaignHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPreview={handlePreview}
          isEditing={isEditing}
          onCancel={handleCancel}
          onSave={handleSave}
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
              setActiveEditor={setActiveEditor}
              scrollToBlank={scrollToBlank}
              save={save}
              setIsEditing={setIsEditing}
              rewardsState={rewardsState}
              rewardsDispatch={rewardsDispatch}
              setSaveCallback={setSaveCallback}
              setCancelCallback={setCancelCallback}
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

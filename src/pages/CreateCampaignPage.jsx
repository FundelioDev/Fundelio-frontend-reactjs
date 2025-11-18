import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import CreateCampaignTabs from '@/components/campaign/create/CreateCampaignTabs';
import CreateCampaignHeader from '@/components/common/CreateCampaignHeader';
import Footer from '@/components/common/Footer';
import { generatePreviewId, savePreviewData } from '@/utils/previewStorage';
import { setBasics, initializeStory, resetCampaign, addBlank as addBlankAction } from '@/store/campaignSlice';
import { campaignApi } from '@/api/campaignApi';
import { campaignSectionApi } from '@/api/campaignSectionApi';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams(); // Get campaignId from URL if editing
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Get initial tab from URL query param or default to 'basic'
  const initialTab = searchParams.get('tab') || 'basic';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  const lastFocusedBlankRef = useRef(null);

  const isEditMode = Boolean(campaignId);

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

  // Load campaign data if editing
  useEffect(() => {
    const loadCampaignData = async () => {
      if (!campaignId) {
        // Reset Redux when creating new campaign
        dispatch(resetCampaign());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await campaignApi.getCampaignById(campaignId);

        if (response?.data?.data) {
          const campaignData = response.data.data;
          setCampaign(campaignData);

          console.log('API Campaign Data:', campaignData);
          console.log('Category from API:', campaignData.campaignCategory);

          // Load Basics
          const basicsData = {
            title: campaignData.title || '',
            description: campaignData.description || '',
            goalAmount: campaignData.goalAmount || 0,
            campaignCategory: campaignData.campaignCategory || '',
            introImageUrl: campaignData.introImageUrl || '',
            introVideoUrl: campaignData.introVideoUrl || '',
            startDate: campaignData.startDate,
            endDate: campaignData.endDate,
            acceptedTerms: true,
          };

          console.log('Basics Data to Redux:', basicsData);
          dispatch(setBasics(basicsData));

          // Load Story
          if (campaignData.campaignSections && campaignData.campaignSections.length > 0) {
            const sections = campaignData.campaignSections;
            sections.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            const blanksById = {};
            const order = [];

            sections.forEach((section, index) => {
              const blankId = section.campaignSectionId;
              blanksById[blankId] = {
                id: blankId,
                order: section.orderIndex || index,
                titleHtml: section.formatTitle || section.tabTitle || '',
                titleText: section.tabTitle || '',
                contentHtml: section.itemData || '',
              };
              order.push(blankId);
            });

            dispatch(initializeStory({ blanksById, order }));
          }

          console.log('Loaded campaign data into Redux');
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        toast.error('Không thể tải thông tin chiến dịch');
      } finally {
        setLoading(false);
      }
    };

    loadCampaignData();
  }, [campaignId, dispatch]);

  // Auto-save logic with debounce
  const autoSave = useCallback(async (blankId) => {
    if (!isEditMode || !campaignId) return;

    try {
      const blank = blanks.find(b => b.id === blankId);
      if (!blank) return;

      const sectionData = {
        tabTitle: blank.titleText || 'Untitled',
        formatTitle: blank.titleHtml || blank.titleText || '<p>Untitled</p>',
        itemData: blank.contentHtml || '',
      };

      console.log('Auto-saving section:', blankId, 'with data:', sectionData);

      // blankId is the campaign section ID
      await campaignSectionApi.updateSectionToCampaign(campaignId, blankId, sectionData);

      setSaveStatus('idle'); // Back to idle (CloudCheck icon only)
      setHasUnsavedChanges(false);
      console.log('Auto-save successful for section:', blankId);
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaveStatus('idle');
      toast.error('Lỗi khi tự động lưu');
    }
  }, [isEditMode, campaignId, blanks]);

  // Track changes and trigger auto-save on blur with debounce
  useEffect(() => {
    if (!hasUnsavedChanges || !lastFocusedBlankRef.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(lastFocusedBlankRef.current);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, autoSave]);

  // Update handlers to track changes
  const handleTitleChange = (id, html, text) => {
    updateTitle(id, html, text);
    setHasUnsavedChanges(true);
    lastFocusedBlankRef.current = id;
    setSaveStatus('saving'); // Show "Đang lưu..." immediately when typing
  };

  const handleContentChange = (id, html) => {
    updateContent(id, html);
    setHasUnsavedChanges(true);
    lastFocusedBlankRef.current = id;
    setSaveStatus('saving'); // Show "Đang lưu..." immediately when typing

    // Log for debugging
    console.log('Content changed for blank:', id, 'HTML length:', html?.length);
  };

  const handleAddBlank = async () => {
    // If in edit mode, create section via API first to get real ID
    if (isEditMode && campaignId) {
      try {
        const blankIndex = blanks.length;
        const sectionData = {
          tabTitle: 'Untitled',
          formatTitle: 'Untitled',
          itemData: '',
        };

        const response = await campaignSectionApi.addSectionToCampaign(campaignId, sectionData);
        console.log('Section created:', response);

        // Get the real section ID from API response
        const realSectionId = response?.data?.data?.campaignSectionId;

        if (realSectionId) {
          // Add blank to Redux with the real section ID from backend
          const newBlank = {
            id: realSectionId,
            titleHtml: 'Untitled',
            titleText: 'Untitled',
            contentHtml: '',
          };
          dispatch(addBlankAction({ id: realSectionId, blank: newBlank }));

          // Wait for DOM update then scroll
          setTimeout(() => scrollToBlank(realSectionId), 100);
          toast.success('Đã thêm section mới');
        }
      } catch (error) {
        console.error('Error creating section:', error);
        toast.error('Không thể tạo section mới');
      }
    } else {
      // In create mode, just add to Redux with local ID
      const newId = addBlank();
      setTimeout(() => scrollToBlank(newId), 100);
    }
  };

  const handleReorderBlanks = async (newOrder) => {
    reorderBlanks(newOrder); // Update Redux first

    // If in edit mode, also update order via API
    if (isEditMode && campaignId) {
      try {
        const reorderData = {
          orderIndex: newOrder
        };

        await campaignSectionApi.reorderSections(campaignId, reorderData);
        console.log('Sections reordered successfully');
      } catch (error) {
        console.error('Error reordering sections:', error);
        toast.error('Không thể sắp xếp lại sections');
      }
    }
  };

  const handleDeleteBlank = async (blankId) => {
    // If in edit mode, delete via API first
    if (isEditMode && campaignId) {
      try {
        await campaignSectionApi.deleteSectionFromCampaign(campaignId, blankId);
        deleteBlank(blankId); // Then delete from Redux
        toast.success('Đã xóa section thành công!');
      } catch (error) {
        console.error('Error deleting section:', error);
        toast.error('Không thể xóa section');
      }
    } else {
      // In create mode, just delete from Redux
      deleteBlank(blankId);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL with tab query param if in edit mode
    if (isEditMode) {
      navigate(`/campaigns/${campaignId}/edit?tab=${tabId}`, { replace: true });
    }
  };

  const handleSaveStory = async () => {
    if (!isEditMode || !campaignId) {
      save(); // Just save to Redux if not in edit mode
      return;
    }

    try {
      save(); // Save to Redux first
      toast.loading('Đang lưu câu chuyện...', { id: 'save-story' });

      const sectionsToCreate = [];
      const sectionsToUpdate = [];
      const existingSectionIds = campaign?.campaignSections?.map(s => s.campaignSectionId) || [];

      blanks.forEach((blank, index) => {
        const sectionData = {
          tabTitle: blank.titleText || `Section ${index + 1}`,
          formatTitle: blank.titleHtml || blank.titleText || `<p>Section ${index + 1}</p>`,
          itemData: blank.contentHtml || '',
          orderIndex: index,
        };

        if (existingSectionIds.includes(blank.id)) {
          sectionsToUpdate.push({ sectionId: blank.id, data: sectionData });
        } else {
          sectionsToCreate.push(sectionData);
        }
      });

      // Create new sections
      for (const sectionData of sectionsToCreate) {
        await campaignApi.createCampaignSection(campaignId, sectionData);
      }

      // Update existing sections
      for (const { sectionId, data } of sectionsToUpdate) {
        await campaignApi.updateCampaignSection(campaignId, sectionId, data);
      }

      // Delete removed sections
      const currentBlankIds = blanks.map(b => b.id);
      const sectionsToDelete = existingSectionIds.filter(id => !currentBlankIds.includes(id));

      for (const sectionId of sectionsToDelete) {
        await campaignApi.deleteCampaignSection(campaignId, sectionId);
      }

      toast.success('Lưu câu chuyện thành công!', { id: 'save-story' });

      // Reload campaign data
      const response = await campaignApi.getCampaignById(campaignId);
      if (response?.data?.data) {
        setCampaign(response.data.data);
      }
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi lưu câu chuyện', { id: 'save-story' });
    }
  };

  const handlePreview = () => {
    // Validate basics data
    if (!basicsData || !basicsData.title || !basicsData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin cơ bản (Tiêu đề và Mô tả)');
      setActiveTab('basic');
      return;
    }

    // Check if we have a real campaignId (from create/edit)
    if (campaignId) {
      // Navigate to preview route with campaignId - let it load from API
      navigate(`/campaigns/preview/${campaignId}`, {
        state: { isPreview: true },
      });
      toast.success('Đang chuyển đến trang xem trước...');
      return;
    }

    // Fallback: For unsaved campaigns, collect data from Redux
    const campaignData = {
      // Basics
      basics: basicsData,

      // Story - convert blanks to the format expected by preview
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

    // Generate unique preview ID for unsaved campaigns
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
          isEditMode={isEditMode}
          campaignId={campaignId}
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
              onTitleChange={handleTitleChange}
              onContentChange={handleContentChange}
              onReorderBlanks={handleReorderBlanks}
              onDeleteBlank={handleDeleteBlank}
              setActiveEditor={setActiveEditor}
              scrollToBlank={scrollToBlank}
              save={handleSaveStory}
              saveStatus={saveStatus}
              campaignId={campaignId}
              isEditMode={isEditMode}
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

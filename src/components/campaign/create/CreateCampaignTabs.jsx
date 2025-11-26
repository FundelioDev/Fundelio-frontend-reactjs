import { useState, useRef, useEffect, useMemo } from 'react';
import StoryToolbar from './story/StoryToolbar';
import SidebarTOC from './story/SidebarTOC';
import BlankSection from './story/BlankSection';
import RewardCreateTab from './rewards/RewardCreateTab';
import BasicsContent from './basics/BasicsContent';

const OLD_IDS_STORAGE_KEY = 'fundelio-old-reward-item-ids';

const loadOldIdsFromStorage = (campaignId) => {
  if (!campaignId || typeof window === 'undefined') {
    return { oldItems: [], oldRewards: [] };
  }

  try {
    const cacheRaw = window.sessionStorage.getItem(OLD_IDS_STORAGE_KEY);
    if (!cacheRaw) return { oldItems: [], oldRewards: [] };

    const cache = JSON.parse(cacheRaw);
    const entry = cache[String(campaignId)];
    if (!entry) return { oldItems: [], oldRewards: [] };

    return {
      oldItems: entry.oldItems || [],
      oldRewards: entry.oldRewards || [],
    };
  } catch {
    return { oldItems: [], oldRewards: [] };
  }
};

const saveOldIdsToStorage = (campaignId, oldItemsSet, oldRewardsSet) => {
  if (!campaignId || typeof window === 'undefined') return;
  try {
    const cacheRaw = window.sessionStorage.getItem(OLD_IDS_STORAGE_KEY);
    const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
    cache[String(campaignId)] = {
      oldItems: Array.from(oldItemsSet || []),
      oldRewards: Array.from(oldRewardsSet || []),
    };
    window.sessionStorage.setItem(OLD_IDS_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // no-op
  }
};

/**
 * CreateCampaignTabs component - Content for Story and Reward sections
 * Now tabs are managed in CreateCampaignHeader
 * @param {Object} props
 * @param {Array} props.blanks - Story blanks data
 * @param {Object} props.activeEditorRef - Reference to currently active editor
 * @param {Function} props.onAddBlank - Callback to add new blank
 * @param {Function} props.onTitleChange - Callback for title changes
 * @param {Function} props.onContentChange - Callback for content changes
 * @param {Function} props.onReorderBlanks - Callback to reorder blanks
 * @param {Function} props.onDeleteBlank - Callback to delete a blank
 * @param {Function} props.setActiveEditor - Callback to set active editor
 * @param {Function} props.scrollToBlank - Callback to scroll to blank
 * @param {Function} props.save - Callback to save
 * @param {string} props.activeTab - Current active tab from parent
 * @param {Function} props.onTabChange - Callback when tab changes (optional, for compatibility)
 */
export default function CreateCampaignTabs({
  blanks,
  activeEditorRef,
  onAddBlank,
  onTitleChange,
  onContentChange,
  onReorderBlanks,
  onDeleteBlank,
  setActiveEditor,
  scrollToBlank,
  save,
  saveStatus,
  activeTab: externalActiveTab,
  onTabChange,
  campaignId,
  isEditMode,
  isReadOnly = false,
  campaignStatus,
  rewardRules,
  itemRules,
}) {
  // Use external activeTab if provided, otherwise use internal state
  const [internalActiveTab, setInternalActiveTab] = useState('story');
  const activeTab = externalActiveTab || internalActiveTab;
  const handleTabChange = onTabChange || setInternalActiveTab;
  const cachedOldIds = useMemo(
    () => loadOldIdsFromStorage(campaignId),
    [campaignId]
  );
  const initialItemIdsRef = useRef(new Set(cachedOldIds.oldItems));
  const initialRewardIdsRef = useRef(new Set(cachedOldIds.oldRewards));
  const previousCampaignIdRef = useRef(campaignId);

  useEffect(() => {
    const prevId = previousCampaignIdRef.current;
    if (prevId && prevId !== campaignId) {
      saveOldIdsToStorage(
        prevId,
        initialItemIdsRef.current,
        initialRewardIdsRef.current
      );
      initialItemIdsRef.current = new Set();
      initialRewardIdsRef.current = new Set();
    }

    if (campaignId) {
      initialItemIdsRef.current = new Set(cachedOldIds.oldItems);
      initialRewardIdsRef.current = new Set(cachedOldIds.oldRewards);
    } else {
      initialItemIdsRef.current = new Set();
      initialRewardIdsRef.current = new Set();
    }

    previousCampaignIdRef.current = campaignId;
  }, [campaignId, cachedOldIds]);

  useEffect(() => {
    return () => {
      saveOldIdsToStorage(
        campaignId,
        initialItemIdsRef.current,
        initialRewardIdsRef.current
      );
    };
  }, [campaignId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persistOldIds = () => {
      saveOldIdsToStorage(
        campaignId,
        initialItemIdsRef.current,
        initialRewardIdsRef.current
      );
    };
    window.addEventListener('beforeunload', persistOldIds);
    return () => window.removeEventListener('beforeunload', persistOldIds);
  }, [campaignId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleSubmitted = (event) => {
      if (String(event.detail?.campaignId) !== String(campaignId)) return;
      saveOldIdsToStorage(
        campaignId,
        initialItemIdsRef.current,
        initialRewardIdsRef.current
      );
    };
    window.addEventListener('campaign:submitted-for-review', handleSubmitted);
    return () =>
      window.removeEventListener('campaign:submitted-for-review', handleSubmitted);
  }, [campaignId]);

  return (
    <div className="w-full">
      {/* Tab Content - No tab navigation here, it's in the header now */}
      <div>
        {/* Basic Tab */}
        {activeTab === 'basic' && (
          <BasicsContent campaignId={campaignId} isEditMode={isEditMode} isReadOnly={isReadOnly} />
        )}

        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 h-auto lg:max-h-[75vh] bg-white dark:bg-darker lg:self-start ">
              <SidebarTOC
                blanks={blanks}
                onAddBlank={isReadOnly ? undefined : onAddBlank}
                onNavigate={scrollToBlank}
                onReorder={isReadOnly ? undefined : onReorderBlanks}
                onDelete={isReadOnly ? undefined : onDeleteBlank}
                isReadOnly={isReadOnly}
              />
            </aside>

            {/* Main Content */}
            <main className="w-full min-w-0">
              {/* Toolbar */}
              {!isReadOnly && (
                <StoryToolbar
                  activeEditorRef={activeEditorRef}
                  onSave={save}
                  saveStatus={saveStatus}
                />
              )}

              {/* Blanks */}
              <div className="mt-6">
                {blanks.map((blank) => (
                  <BlankSection
                    key={blank.id}
                    blank={blank}
                    onTitleChange={isReadOnly ? undefined : onTitleChange}
                    onContentChange={isReadOnly ? undefined : onContentChange}
                    onFocus={setActiveEditor}
                    isReadOnly={isReadOnly}
                  />
                ))}
              </div>

              {/* Add Blank Button at Bottom */}
              {!isReadOnly && (
                <button
                  onClick={onAddBlank}
                  className="flex items-center justify-center w-full py-3 mb-8 border-1 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-darker hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                    + Thêm blank
                  </span>
                </button>
              )}
            </main>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <RewardCreateTab
            campaignId={campaignId}
            isReadOnly={isReadOnly}
            campaignStatus={campaignStatus}
            rewardRules={rewardRules}
            itemRules={itemRules}
            initialOldItemIdsRef={initialItemIdsRef}
            initialOldRewardIdsRef={initialRewardIdsRef}
          />
        )}
      </div>
    </div>
  );
}

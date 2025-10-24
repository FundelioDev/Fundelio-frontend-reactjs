import { useState } from 'react';
import { BookOpen, Gift } from 'lucide-react';
import StoryToolbar from './story/StoryToolbar';
import SidebarTOC from './story/SidebarTOC';
import BlankSection from './story/BlankSection';
import RewardComingSoon from './rewards/RewardComingSoon';

/**
 * CreateCampaignTabs component - Tabs for Story and Reward sections
 * @param {Object} props
 * @param {Array} props.blanks - Story blanks data
 * @param {Object} props.activeEditorRef - Reference to currently active editor
 * @param {Function} props.onAddBlank - Callback to add new blank
 * @param {Function} props.onTitleChange - Callback for title changes
 * @param {Function} props.onContentChange - Callback for content changes
 * @param {Function} props.setActiveEditor - Callback to set active editor
 * @param {Function} props.scrollToBlank - Callback to scroll to blank
 * @param {Function} props.save - Callback to save
 */
export default function CreateCampaignTabs({
  blanks,
  activeEditorRef,
  onAddBlank,
  onTitleChange,
  onContentChange,
  setActiveEditor,
  scrollToBlank,
  save,
}) {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div className="w-full pt-20">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'story'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Câu chuyện</span>
        </button>

        <button
          onClick={() => setActiveTab('reward')}
          className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'reward'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span>Phần thưởng</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 h-auto lg:max-h-[75vh] bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 lg:self-start">
              <SidebarTOC
                blanks={blanks}
                onAddBlank={onAddBlank}
                onNavigate={scrollToBlank}
              />
            </aside>

            {/* Main Content */}
            <main className="w-full min-w-0">
              {/* Toolbar */}
              <StoryToolbar activeEditorRef={activeEditorRef} onSave={save} />

              {/* Blanks */}
              <div className="mt-6">
                {blanks.map((blank) => (
                  <BlankSection
                    key={blank.id}
                    blank={blank}
                    onTitleChange={onTitleChange}
                    onContentChange={onContentChange}
                    onFocus={setActiveEditor}
                  />
                ))}
              </div>

              {/* Add Blank Button at Bottom */}
              <button
                onClick={onAddBlank}
                className="flex items-center justify-center w-full py-3 mb-8 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-black hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors group"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  + Thêm blank
                </span>
              </button>
            </main>
          </div>
        )}

        {/* Reward Tab */}
        {activeTab === 'reward' && <RewardComingSoon />}
      </div>
    </div>
  );
}

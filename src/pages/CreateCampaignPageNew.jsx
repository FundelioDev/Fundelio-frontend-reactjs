// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import CreateCampaignHeader from '../components/common/CreateCampaignHeader';
// import Footer from '../components/common/Footer';
// import CreateCampaignTabs from '../components/create/CreateCampaignTabs';
// import { useBlanks } from '../hooks/useBlanks';

// /**
//  * CreateCampaignPage - Page for creating a new campaign
//  * Uses new CreateCampaignHeader with tabs
//  */
// export default function CreateCampaignPageNew() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('story');
//   const activeEditorRef = useRef(null);

//   // Use blanks hook
//   const {
//     blanks,
//     addBlank,
//     updateBlankTitle,
//     updateBlankContent,
//     reorderBlanks,
//     deleteBlank,
//     scrollToBlank,
//     save,
//   } = useBlanks();

//   const setActiveEditor = (ref) => {
//     activeEditorRef.current = ref;
//   };

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//   };

//   const handlePreview = () => {
//     console.log('Preview campaign');
//     // TODO: Implement preview functionality
//     // Could open modal or navigate to preview page
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background-light dark:bg-darker transition-colors duration-300">
//       {/* Header with tabs */}
//       <CreateCampaignHeader
//         activeTab={activeTab}
//         onTabChange={handleTabChange}
//         onPreview={handlePreview}
//       />

//       {/* Main Content */}
//       <main className="flex-1 w-full">
//         <div className="mx-auto max-w-container px-4 sm:px-6 pt-20 pb-12">
//           <CreateCampaignTabs
//             activeTab={activeTab}
//             onTabChange={handleTabChange}
//             blanks={blanks}
//             activeEditorRef={activeEditorRef}
//             onAddBlank={addBlank}
//             onTitleChange={updateBlankTitle}
//             onContentChange={updateBlankContent}
//             onReorderBlanks={reorderBlanks}
//             onDeleteBlank={deleteBlank}
//             setActiveEditor={setActiveEditor}
//             scrollToBlank={scrollToBlank}
//             save={save}
//           />
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

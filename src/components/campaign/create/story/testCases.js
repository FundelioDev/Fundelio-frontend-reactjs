/**
 * Manual Test Cases for CreateCampaignPage
 * Run these tests in browser console or manually verify
 */

export const testCases = [
  {
    id: 'TC001',
    name: 'Create New Blank',
    steps: [
      '1. Click "+ Thêm blank" button in sidebar',
      '2. Verify new blank appears at bottom',
      '3. Verify page auto-scrolls to new blank',
      '4. Verify editor is focused',
    ],
    expected: 'New blank created, scrolled into view, and focused',
  },
  {
    id: 'TC002',
    name: 'Edit Title',
    steps: [
      '1. Click on title field',
      '2. Type "My Campaign Title"',
      '3. Check sidebar TOC',
    ],
    expected: 'Title updates in both blank and sidebar',
  },
  {
    id: 'TC003',
    name: 'Format Text - Bold',
    steps: [
      '1. Type some text in editor',
      '2. Select the text',
      '3. Click "B" button in toolbar',
    ],
    expected: 'Text becomes bold',
  },
  {
    id: 'TC004',
    name: 'Format Text - Italic',
    steps: [
      '1. Type some text in editor',
      '2. Select the text',
      '3. Click "I" button in toolbar',
    ],
    expected: 'Text becomes italic',
  },
  {
    id: 'TC005',
    name: 'Format Text - Underline',
    steps: [
      '1. Type some text in editor',
      '2. Select the text',
      '3. Click "U" button in toolbar',
    ],
    expected: 'Text becomes underlined',
  },
  {
    id: 'TC006',
    name: 'Insert H2 Heading',
    steps: ['1. Click in editor', '2. Click "H2" button in toolbar'],
    expected: 'H2 heading "Tiêu đề cấp 2" inserted at cursor',
  },
  {
    id: 'TC007',
    name: 'Change Text Color',
    steps: [
      '1. Type some text in editor',
      '2. Select the text',
      '3. Click color picker',
      '4. Choose a color (e.g., red)',
    ],
    expected: 'Text color changes to selected color',
  },
  {
    id: 'TC008',
    name: 'Upload Image',
    steps: ['1. Click "Ảnh/GIF" button', '2. Select an image file'],
    expected: 'Image appears in editor',
  },
  {
    id: 'TC009',
    name: 'Upload GIF',
    steps: ['1. Click "Ảnh/GIF" button', '2. Select a GIF file'],
    expected: 'Animated GIF appears and animates',
  },
  {
    id: 'TC010',
    name: 'Drag and Drop Image',
    steps: [
      '1. Open file explorer',
      '2. Drag an image file',
      '3. Drop into editor',
    ],
    expected: 'Image appears at drop location',
  },
  {
    id: 'TC011',
    name: 'Embed YouTube Video',
    steps: [
      '1. Copy YouTube URL: https://youtube.com/watch?v=dQw4w9WgXcQ',
      '2. Paste into editor',
    ],
    expected: 'YouTube video embedded as iframe',
  },
  {
    id: 'TC012',
    name: 'Embed YouTube Short URL',
    steps: [
      '1. Copy YouTube short URL: https://youtu.be/dQw4w9WgXcQ',
      '2. Paste into editor',
    ],
    expected: 'YouTube video embedded as iframe',
  },
  {
    id: 'TC013',
    name: 'Embed Vimeo Video',
    steps: [
      '1. Copy Vimeo URL: https://vimeo.com/123456789',
      '2. Paste into editor',
    ],
    expected: 'Vimeo video embedded as iframe',
  },
  {
    id: 'TC014',
    name: 'Insert Link via Prompt',
    steps: [
      '1. Click "Link" button',
      '2. Enter URL: https://youtube.com/watch?v=xxx',
      '3. Click OK',
    ],
    expected: 'Video embedded if YouTube/Vimeo, else creates hyperlink',
  },
  {
    id: 'TC015',
    name: 'Navigate via Sidebar',
    steps: [
      '1. Create 3 blanks with different titles',
      '2. Click on first blank title in sidebar',
    ],
    expected: 'Page smoothly scrolls to first blank',
  },
  {
    id: 'TC016',
    name: 'Manual Save',
    steps: [
      '1. Create and edit some content',
      '2. Click "Lưu" button',
      '3. Open browser console (F12)',
    ],
    expected: 'Console shows "SAVE payload:" with JSON data',
  },
  {
    id: 'TC017',
    name: 'Auto Save',
    steps: [
      '1. Create and edit some content',
      '2. Stop typing',
      '3. Wait 5 seconds',
      '4. Check console',
    ],
    expected: 'Console shows "[AUTOSAVE]" with JSON data',
  },
  {
    id: 'TC018',
    name: 'Title Sync - Blank to Sidebar',
    steps: [
      '1. Click on blank title',
      '2. Change text to "New Title"',
      '3. Check sidebar',
    ],
    expected: 'Sidebar updates to show "New Title"',
  },
  {
    id: 'TC019',
    name: 'Dark Mode',
    steps: [
      '1. Open console (F12)',
      '2. Run: document.documentElement.classList.add("dark")',
      '3. Observe UI',
    ],
    expected: 'All components switch to dark theme',
  },
  {
    id: 'TC020',
    name: 'Responsive Mobile',
    steps: [
      '1. Open DevTools (F12)',
      '2. Toggle device toolbar (Ctrl+Shift+M)',
      '3. Select mobile device (e.g., iPhone 12)',
    ],
    expected: 'Layout switches to single column, sidebar on top',
  },
  {
    id: 'TC021',
    name: 'Multiple Blanks',
    steps: [
      '1. Click "+ Thêm blank" 5 times',
      '2. Verify sidebar shows 6 items (including default)',
      '3. Verify all blanks render correctly',
    ],
    expected: '6 blanks total, all functional',
  },
  {
    id: 'TC022',
    name: 'Complex Content',
    steps: [
      '1. In one blank, add:',
      '   - Bold text',
      '   - Italic text',
      '   - H2 heading',
      '   - Image',
      '   - YouTube video',
      '   - Colored text',
      '2. Click "Lưu"',
      '3. Check console payload',
    ],
    expected: 'All content preserved in HTML format',
  },
  {
    id: 'TC023',
    name: 'Focus Management',
    steps: [
      '1. Click in title',
      '2. Click "B" button',
      '3. Verify bold applied to title',
      '4. Click in editor',
      '5. Click "I" button',
      '6. Verify italic applied to editor',
    ],
    expected: 'Toolbar operates on currently focused element',
  },
  {
    id: 'TC024',
    name: 'Empty State',
    steps: [
      '1. Refresh page',
      '2. Verify default blank exists',
      '3. Verify it has title "Giới thiệu"',
      '4. Verify it has placeholder content',
    ],
    expected: 'One default blank with initial content',
  },
  {
    id: 'TC025',
    name: 'Payload Structure',
    steps: [
      '1. Create 2 blanks',
      '2. Edit titles and content',
      '3. Click "Lưu"',
      '4. Inspect console payload',
    ],
    expected:
      'Payload has version, createdAt, and blanks array with correct order',
  },
];

/**
 * Run all test cases programmatically (for automated testing)
 */
export function runTestSuite() {
  console.group('🧪 CreateCampaignPage Test Suite');

  testCases.forEach((test) => {
    console.group(`${test.id}: ${test.name}`);
    console.log('Steps:');
    test.steps.forEach((step) => console.log(`  ${step}`));
    console.log(`\n✅ Expected: ${test.expected}`);
    console.groupEnd();
  });

  console.groupEnd();
  console.log(`\n📊 Total Tests: ${testCases.length}`);
  console.log('💡 Run each test manually and verify expected results.');
}

/**
 * Quick smoke test helper
 */
export function smokeTest() {
  const criticalTests = testCases.filter((t) =>
    ['TC001', 'TC002', 'TC016', 'TC019'].includes(t.id)
  );

  console.group('🔥 Smoke Tests (Critical)');
  criticalTests.forEach((test) => {
    console.log(`${test.id}: ${test.name}`);
  });
  console.groupEnd();

  return criticalTests;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.CreateCampaignTests = {
    testCases,
    runTestSuite,
    smokeTest,
  };
  console.log('✅ Test utilities loaded!');
  console.log('Run: CreateCampaignTests.runTestSuite()');
}

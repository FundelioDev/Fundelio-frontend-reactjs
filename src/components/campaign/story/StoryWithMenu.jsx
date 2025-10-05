import React from 'react';
import BlankSection from './BlankSection';

/**
 * StoryWithMenu Component
 * Displays all blank sections (scroll spy handled by parent)
 */
const StoryWithMenu = ({ blanks = [] }) => {
  if (!blanks || blanks.length === 0) {
    return (
      <div className="py-16 text-center text-secondary">
        <p>No story content available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {blanks.map((blank) => (
        <BlankSection key={blank.id} blank={blank} />
      ))}
    </div>
  );
};

export default StoryWithMenu;

import React from 'react';
import PledgeItem from './PledgeItem';

export default function PledgeList({ pledges, onShowDetail }) {
    return (
        <ul className="space-y-4">
            {pledges?.map((pledge) => (
                <PledgeItem
                    key={pledge.pledgeId}
                    pledge={pledge}
                    onShowDetail={onShowDetail}
                />
            ))}
        </ul>
    );
}

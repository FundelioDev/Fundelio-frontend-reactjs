/**
 * Mock data for pledges table based on ERD schema
 */

export const mockPledges = [
  {
    pledge_id: 'pledge-001',
    backer_id: 'user-001',
    campaign_id: 'odin-3',
    reward_id: 'reward-001',
    amount: 199.00,
    status: 'completed',
    selected_add_ons: [
      { id: 'addon-001', quantity: 1 },
      { id: 'addon-002', quantity: 2 }
    ],
    created_at: '2025-10-20T10:30:00.000Z',
  },
  {
    pledge_id: 'pledge-002',
    backer_id: 'user-002',
    campaign_id: 'odin-3',
    reward_id: 'reward-002',
    amount: 349.00,
    status: 'completed',
    selected_add_ons: [],
    created_at: '2025-10-21T14:15:00.000Z',
  },
  {
    pledge_id: 'pledge-003',
    backer_id: 'user-003',
    campaign_id: 'odin-3',
    reward_id: null, // No reward pledge
    amount: 50.00,
    status: 'completed',
    selected_add_ons: null,
    created_at: '2025-10-22T09:45:00.000Z',
  },
  {
    pledge_id: 'pledge-004',
    backer_id: 'user-004',
    campaign_id: 'odin-3',
    reward_id: 'reward-001',
    amount: 199.00,
    status: 'pending',
    selected_add_ons: [],
    created_at: '2025-10-23T16:20:00.000Z',
  },
];

/**
 * Get pledges by campaign ID
 */
export function getPledgesByCampaign(campaignId) {
  return mockPledges.filter(pledge => pledge.campaign_id === campaignId);
}

/**
 * Get pledges by backer ID
 */
export function getPledgesByBacker(backerId) {
  return mockPledges.filter(pledge => pledge.backer_id === backerId);
}

/**
 * Get pledge statistics for a campaign
 */
export function getCampaignPledgeStats(campaignId) {
  const pledges = getPledgesByCampaign(campaignId);
  
  return {
    total_amount: pledges.reduce((sum, p) => sum + p.amount, 0),
    total_backers: new Set(pledges.map(p => p.backer_id)).size,
    completed_pledges: pledges.filter(p => p.status === 'completed').length,
    pending_pledges: pledges.filter(p => p.status === 'pending').length,
  };
}

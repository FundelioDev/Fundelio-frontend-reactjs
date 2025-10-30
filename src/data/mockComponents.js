/**
 * Mock data for components table based on ERD schema
 * Components are add-ons or items that can be included in rewards
 */

export const mockComponents = [
  {
    component_id: 'comp-001',
    name: 'Premium Carrying Case',
    description: 'Durable protective case with custom foam insert',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
    price: 29.99,
  },
  {
    component_id: 'comp-002',
    name: 'Extra USB-C Cable (2m)',
    description: 'High-speed USB 3.2 Gen 2 cable for data transfer',
    image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=400&auto=format&fit=crop',
    price: 15.99,
  },
  {
    component_id: 'comp-003',
    name: 'Screen Protector Pack (3pcs)',
    description: 'Tempered glass screen protectors',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=400&auto=format&fit=crop',
    price: 12.99,
  },
  {
    component_id: 'comp-004',
    name: 'Cleaning Kit',
    description: 'Microfiber cloth and cleaning solution',
    image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=400&auto=format&fit=crop',
    price: 8.99,
  },
  {
    component_id: 'comp-005',
    name: 'Wall Charger 65W',
    description: 'Fast charging wall adapter with GaN technology',
    image_url: 'https://images.unsplash.com/photo-1591290619762-c588f8ab4ce2?q=80&w=400&auto=format&fit=crop',
    price: 24.99,
  },
];

/**
 * Mock data for reward_components junction table
 * Links components to rewards with bundle quantity
 */
export const mockRewardComponents = [
  // Reward 001 includes multiple components
  {
    reward_id: 'reward-001',
    component_id: 'comp-001',
    component_type: 'included', // included | addon
    bundle_quantity: 1,
  },
  {
    reward_id: 'reward-001',
    component_id: 'comp-002',
    component_type: 'included',
    bundle_quantity: 1,
  },
  {
    reward_id: 'reward-001',
    component_id: 'comp-003',
    component_type: 'included',
    bundle_quantity: 1,
  },
  {
    reward_id: 'reward-001',
    component_id: 'comp-004',
    component_type: 'included',
    bundle_quantity: 1,
  },
  // Available as add-on
  {
    reward_id: 'reward-001',
    component_id: 'comp-005',
    component_type: 'addon',
    bundle_quantity: 1,
  },

  // Reward 002 includes more components
  {
    reward_id: 'reward-002',
    component_id: 'comp-001',
    component_type: 'included',
    bundle_quantity: 1,
  },
  {
    reward_id: 'reward-002',
    component_id: 'comp-002',
    component_type: 'included',
    bundle_quantity: 2, // 2x cables
  },
  {
    reward_id: 'reward-002',
    component_id: 'comp-003',
    component_type: 'included',
    bundle_quantity: 2, // 2x screen protector packs
  },
  {
    reward_id: 'reward-002',
    component_id: 'comp-004',
    component_type: 'included',
    bundle_quantity: 1,
  },
  {
    reward_id: 'reward-002',
    component_id: 'comp-005',
    component_type: 'included',
    bundle_quantity: 1,
  },
  // Available as add-ons
  {
    reward_id: 'reward-002',
    component_id: 'comp-001',
    component_type: 'addon',
    bundle_quantity: 1,
  },
  {
    reward_id: 'reward-002',
    component_id: 'comp-005',
    component_type: 'addon',
    bundle_quantity: 1,
  },
];

/**
 * Get components included in a reward
 */
export function getIncludedComponents(rewardId) {
  const rewardComps = mockRewardComponents.filter(
    rc => rc.reward_id === rewardId && rc.component_type === 'included'
  );
  
  return rewardComps.map(rc => ({
    ...mockComponents.find(c => c.component_id === rc.component_id),
    quantity: rc.bundle_quantity,
  }));
}

/**
 * Get available add-ons for a reward
 */
export function getRewardAddOns(rewardId) {
  const rewardComps = mockRewardComponents.filter(
    rc => rc.reward_id === rewardId && rc.component_type === 'addon'
  );
  
  return rewardComps.map(rc => ({
    ...mockComponents.find(c => c.component_id === rc.component_id),
    quantity: rc.bundle_quantity,
  }));
}

/**
 * Get component by ID
 */
export function getComponentById(componentId) {
  return mockComponents.find(c => c.component_id === componentId);
}

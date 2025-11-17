import React, { useCallback } from 'react';
import { useCampaignProgress, usePledgeEvents } from '@/websocket/hooks';
import { createPledge } from '@/websocket';
import { toast } from 'react-hot-toast';

/**
 * Example: Sử dụng WebSocket trong Campaign Detail Page
 */
const CampaignDetailExample = ({ campaignId }) => {
    // 1. Subscribe tới campaign progress
    const handleProgressUpdate = useCallback((data) => {
        console.log('📊 Campaign progress updated:', data);
        // Update UI với data mới
        // Ví dụ: setProgress(data)
    }, []);

    useCampaignProgress(campaignId, handleProgressUpdate);

    // 2. Subscribe tới pledge events
    const handlePledgeSuccess = useCallback((data) => {
        console.log('✅ Pledge successful:', data);
        toast.success('Pledge created successfully!');
        // Redirect hoặc update UI
    }, []);

    const handlePledgeError = useCallback((error) => {
        console.error('❌ Pledge error:', error);
        toast.error(error.message || 'Pledge failed');
    }, []);

    usePledgeEvents(handlePledgeSuccess, handlePledgeError);

    // 3. Tạo pledge
    const handleCreatePledge = async () => {
        try {
            await createPledge({
                campaignId: 'campaign-456',
                rewardId: 'reward-789',
                amount: 400000,
                bonusAmount: 100000,
                totalAmount: 500000,
                addOns: [
                    {
                        rewardItemId: 'item-001',
                        quantity: 2,
                    },
                ],
            });

            toast.success('Pledge request sent!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            <h1>Campaign Detail</h1>
            <button onClick={handleCreatePledge}>
                Create Pledge
            </button>
        </div>
    );
};

export default CampaignDetailExample;

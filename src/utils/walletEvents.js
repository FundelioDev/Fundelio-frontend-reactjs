/**
 * Wallet Events Utility
 * Provides custom events for wallet balance changes
 */

export const WALLET_BALANCE_CHANGED_EVENT = 'wallet:balance-changed';

/**
 * Dispatch event to notify that wallet balance has changed
 * This will trigger a refetch in Header component
 */
export const notifyWalletBalanceChanged = () => {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent(WALLET_BALANCE_CHANGED_EVENT, {
        detail: { timestamp: new Date().toISOString() }
    });

    window.dispatchEvent(event);
    console.log('💰 [WalletEvents] Balance changed event dispatched');
};

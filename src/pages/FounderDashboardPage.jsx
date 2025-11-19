import React from 'react';
import Header from '@/components/common/Header';
import { FounderDashboard } from '@/components/founder/dashboard';

/**
 * Founder Dashboard Page
 * Main dashboard for founders to view overview of all their campaigns
 */
export default function FounderDashboardPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
            <Header variant="light" />

            <main className="flex-1 pt-20">
                <FounderDashboard />
            </main>
        </div>
    );
}

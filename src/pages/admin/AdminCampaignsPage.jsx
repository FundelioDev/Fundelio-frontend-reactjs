import { useState } from 'react';
import { mockAdminCampaigns } from '@/data/mockAdminData';
import {
  CampaignsHeader,
  CampaignsStats,
  CampaignsFilters,
  CampaignCard,
  CampaignDetailDialog,
  RejectCampaignDialog,
} from '@/components/admin/campaigns';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockAdminCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailDialog(true);
  };

  const handleApprove = (campaign) => {
    setCampaigns(
      campaigns.map((c) =>
        c.id === campaign.id
          ? {
              ...c,
              status: 'approved',
              approvedAt: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );
    setShowDetailDialog(false);
  };

  const handleOpenRejectDialog = (campaign) => {
    setSelectedCampaign(campaign);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setCampaigns(
      campaigns.map((c) =>
        c.id === selectedCampaign.id
          ? {
              ...c,
              status: 'rejected',
              rejectedAt: new Date().toISOString().split('T')[0],
              rejectionReason,
            }
          : c
      )
    );
    setShowRejectDialog(false);
    setShowDetailDialog(false);
  };

  const getStatusCounts = () => {
    return {
      all: campaigns.length,
      pending: campaigns.filter((c) => c.status === 'pending').length,
      approved: campaigns.filter((c) => c.status === 'approved').length,
      rejected: campaigns.filter((c) => c.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className='space-y-6'>
      <CampaignsHeader />

      <CampaignsStats statusCounts={statusCounts} />

      <CampaignsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Campaigns Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>

      <CampaignDetailDialog
        campaign={selectedCampaign}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onApprove={handleApprove}
        onReject={handleOpenRejectDialog}
      />

      <RejectCampaignDialog
        campaign={selectedCampaign}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  );
}

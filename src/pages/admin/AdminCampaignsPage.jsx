import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { campaignApi } from '@/api/campaignApi';
import {
  CampaignsHeader,
  CampaignsStats,
  CampaignsFilters,
  CampaignCard,
  CampaignDetailDialog,
  RejectCampaignDialog,
} from '@/components/admin/campaigns';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
    totalElements: 0,
  });

  // Load campaigns from API
  useEffect(() => {
    loadCampaigns();
  }, [filterStatus, pagination.currentPage]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        sort: 'createdAt,desc',
      };

      // Add status filter if not 'all'
      if (filterStatus !== 'all') {
        params.filter = `campaignStatus:'${filterStatus.toUpperCase()}'`;
      }

      const response = await campaignApi.getAllCampaigns(params);

      if (response?.data?.data) {
        setCampaigns(response.data.data.content || []);
        setPagination({
          currentPage: response.data.data.meta.currentPage,
          pageSize: response.data.data.meta.pageSize,
          totalPages: response.data.data.meta.totalPages,
          totalElements: response.data.data.meta.totalElements,
        });
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Không thể tải danh sách chiến dịch');
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewDetail = async (campaign) => {
    try {
      // Load full campaign details
      const response = await campaignApi.getCampaignById(campaign.campaignId);
      if (response?.data?.data) {
        setSelectedCampaign(response.data.data);
        console.log('Selected Campaign: ', response.data.data);
        setShowDetailDialog(true);
      }
    } catch (error) {
      console.error('Error loading campaign details:', error);
      toast.error('Không thể tải chi tiết chiến dịch');
    }
  };

  const handleApprove = async (campaign) => {
    try {
      await campaignApi.updateCampaignStatus(campaign.campaignId, {
        campaignStatus: 'ACTIVE',
      });

      toast.success('Đã phê duyệt chiến dịch');
      setShowDetailDialog(false);
      loadCampaigns(); // Reload campaigns
    } catch (error) {
      console.error('Error approving campaign:', error);
      toast.error('Không thể phê duyệt chiến dịch');
    }
  };

  const handleOpenRejectDialog = (campaign) => {
    setSelectedCampaign(campaign);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await campaignApi.updateCampaignStatus(selectedCampaign.campaignId, {
        campaignStatus: 'REJECTED',
        rejectionReason: rejectionReason,
      });

      toast.success('Đã từ chối chiến dịch');
      setShowRejectDialog(false);
      setShowDetailDialog(false);
      loadCampaigns(); // Reload campaigns
    } catch (error) {
      console.error('Error rejecting campaign:', error);
      toast.error('Không thể từ chối chiến dịch');
    }
  };

  const getStatusCounts = () => {
    // Count from all campaigns regardless of current filter
    return {
      all: pagination.totalElements,
      draft: campaigns.filter((c) => c.campaignStatus === 'DRAFT').length,
      pending: campaigns.filter((c) => c.campaignStatus === 'PENDING').length,
      approved: campaigns.filter((c) => c.campaignStatus === 'APPROVED').length,
      rejected: campaigns.filter((c) => c.campaignStatus === 'REJECTED').length,
      active: campaigns.filter((c) => c.campaignStatus === 'ACTIVE').length,
      successful: campaigns.filter((c) => c.campaignStatus === 'SUCCESSFUL').length,
      failed: campaigns.filter((c) => c.campaignStatus === 'FAILED').length,
      ended: campaigns.filter((c) => c.campaignStatus === 'ENDED').length,
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

      {/* Loading State */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
            <p className='mt-4 text-muted-foreground'>Đang tải...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Campaigns Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.campaignId}
                  campaign={campaign}
                  onViewDetail={handleViewDetail}
                />
              ))
            ) : (
              <div className='col-span-full text-center py-12'>
                <p className='text-muted-foreground'>Không tìm thấy chiến dịch nào</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='flex justify-center gap-2 mt-6'>
              <button
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
                className='px-4 py-2 border rounded disabled:opacity-50'
              >
                Trước
              </button>
              <span className='px-4 py-2'>
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
                className='px-4 py-2 border rounded disabled:opacity-50'
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

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

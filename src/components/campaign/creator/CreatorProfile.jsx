import React, { useEffect, useState } from 'react';
import { Mail, UserPlus, Link as LinkIcon, MapPin } from 'lucide-react';
import ProjectCard from '../../home/ProjectCard';
import { useMemo } from 'react';
import { campaignApi } from '@/api/campaignApi';


const CreatorProfile = ({ creator = {}, otherProjects = [] }) => {
  const {
    name = 'Creator Name',
    username = 'username',
    avatar = null,
    bio = '',
    badges = [],
    stats = {
      createdProjects: 0,
      backedProjects: 0,
      lastLogin: '',
      accountCreated: ''
    },
    socials = {
      website: '',
      twitter: '',
      facebook: '',
      location: ''
    },
    isVerified = false
  } = creator;

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await campaignApi.getUserCampaigns(creator.userId, {
        page: 0,
        size: 1000,
      });

      if (response?.data?.data?.content) {
        setCampaigns(response.data.data.content);
      }
    };

    fetchCampaigns();
  }, []);

  const handleMessage = () => {
    console.log('Send message to creator');
  };

  const handleFollow = () => {
    console.log('Follow creator');
  };

  console.log("y creator:", campaigns)

  const avatarUrl = useMemo(() => {
    // Priority: avatarUrl > avatar > generated avatar
    if (creator?.avatarUrl) {
      return creator.avatarUrl;
    }
    if (creator?.avatar) {
      return creator.avatar;
    }
    const firstName = creator?.firstName || '';
    const lastName = creator?.lastName || '';
    const fullName =
      `${firstName} ${lastName}`.trim() || creator?.email || creator?.name || 'User';

    const encodedName = encodeURIComponent(fullName);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=random`;
  }, [creator]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Về người tạo
        </h2>

        <div className="flex items-center gap-6 mb-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full border-2 border-border bg-muted flex-shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image on error, show default
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-primary/10">
                      <span class="text-lg font-bold text-primary">${name.charAt(0).toUpperCase()}</span>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Creator Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {name}
            </h3>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="text-md font-bold text-foreground mb-1">
              {stats.lastLogin}
            </div>
            <div className="text-sm text-muted-foreground">
              đăng nhập gần nhất
            </div>
          </div>
          <div>
            <div className="text-md font-bold text-foreground mb-1">
              {stats.accountCreated}
            </div>
            <div className="text-sm text-muted-foreground">
              ngày tạo tài khoản
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleMessage}
            className="px-6 py-3 bg-background text-foreground font-semibold rounded-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            <span>Nhắn tin</span>
          </button>
          <button
            onClick={handleFollow}
            className="px-6 py-3 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            <span>Theo dõi</span>
          </button>
        </div>
      </div>

      {/* Other Projects Section */}
      {campaigns && campaigns.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Các dự án khác của người tạo này
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((project) => (
              <ProjectCard
                key={project.campaignId}
                project={project}
                asLink={`/campaigns/${project.campaignId}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;

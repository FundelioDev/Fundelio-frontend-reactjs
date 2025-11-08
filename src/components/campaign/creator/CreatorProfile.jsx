import React from 'react';
import { Mail, UserPlus, Link as LinkIcon, Twitter, Facebook, MapPin, CheckCircle } from 'lucide-react';
import ProjectCard from '../../home/ProjectCard';

/**
 * CreatorProfile Component
 * Displays creator information, badges, stats, bio, and other projects
 */
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

  const handleMessage = () => {
    console.log('Send message to creator');
  };

  const handleFollow = () => {
    console.log('Follow creator');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Về người tạo
        </h2>

        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full border-4 border-border bg-muted flex-shrink-0 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-4xl font-bold text-primary">
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

            {/* Badges & Username */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {isVerified && (
                <div className="flex items-center gap-1 text-foreground">
                  <CheckCircle size={18} className="text-primary" />
                  <span className="text-sm font-medium">{username}</span>
                </div>
              )}

              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.type === 'favorite'
                      ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                      : badge.type === 'repeat'
                        ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
                        : badge.type === 'super'
                          ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                          : 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-text-white'
                    }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stats.createdProjects}
            </div>
            <div className="text-sm text-muted-foreground">
              dự án đã tạo
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.backedProjects} dự án đã ủng hộ
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stats.lastLogin}
            </div>
            <div className="text-sm text-muted-foreground">
              đăng nhập gần nhất
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stats.accountCreated}
            </div>
            <div className="text-sm text-muted-foreground">
              ngày tạo tài khoản
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-base text-foreground leading-relaxed mb-6">
            {bio}
          </p>
        )}

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

        {/* Social Links */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {socials.website && (
            <a
              href={socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <LinkIcon size={18} />
              <span>{socials.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {socials.twitter && (
            <a
              href={`https://twitter.com/${socials.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Twitter size={18} />
              <span>@{socials.twitter}</span>
            </a>
          )}
          {socials.facebook && (
            <a
              href={`https://facebook.com/${socials.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Facebook size={18} />
              <span>/{socials.facebook}</span>
            </a>
          )}
          {socials.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={18} />
              <span>{socials.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Other Projects Section */}
      {otherProjects && otherProjects.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Các dự án khác của người tạo này
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;

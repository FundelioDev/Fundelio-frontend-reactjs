import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import toast, { Toaster } from 'react-hot-toast';
import { HeartHandshake } from 'lucide-react';
import { useCampaignProgress } from '@/websocket/hooks';
import { pledgeApi } from "@/api/pledgeApi";
gsap.registerPlugin(Flip);
import { IoMdTrophy } from "react-icons/io";

const WreathLaurel = ({ rank, className = "" }) => {
  const colors = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
  };

  const color = colors[rank] || "#FFD700";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 100 400 320"
      className={className}
      fill={color}
    >
      <path opacity="1.000000" stroke="none" d=" M121.652824,300.311584   C107.392113,283.584717 100.941574,264.523865 101.634613,242.950317   C101.811104,237.456192 101.587547,231.950241 101.694321,226.452591   C101.820923,219.933884 105.072563,216.899384 111.682388,216.654327   C118.737999,216.392746 125.564011,217.718643 132.591873,219.589264   C133.309280,216.033325 131.248856,213.276474 130.465424,210.377243   C124.219208,187.261490 128.684814,165.910965 140.503540,145.655243   C143.185562,141.058594 145.734070,136.370682 148.659225,131.932510   C152.482315,126.131966 156.126114,125.174538 162.253128,128.423523   C176.377472,135.913284 185.689880,147.748535 192.347458,162.794342   C195.069489,153.948883 198.016724,145.763367 202.954483,138.460083   C216.371338,118.615677 235.060440,108.078407 258.911469,106.703018   C263.395752,106.444427 267.913391,106.550690 272.406891,106.720665   C277.722229,106.921745 281.766479,110.445251 282.201782,115.613136   C284.249969,139.928009 278.371857,161.629883 260.012878,178.674210   C247.373779,190.408218 232.249588,197.431442 214.882874,197.030121   C207.170822,196.851913 204.153214,201.150558 200.964294,206.060852   C189.078110,224.363266 182.398224,244.539612 182.530457,266.334229   C182.714691,296.702881 192.690552,323.649628 213.169739,346.521667   C232.877594,368.532257 257.484283,381.246277 286.483978,385.403961   C295.169098,386.649109 304.052917,386.866089 312.904297,386.692047   C342.564026,386.108795 370.178772,393.759155 396.153687,407.792969   C401.619293,410.745972 403.567688,415.528717 401.407501,420.614838   C398.905273,426.506287 394.148132,428.780090 387.967712,426.341095   C379.469513,422.987396 371.467407,418.487732 362.733063,415.604584   C346.309998,410.183441 329.462677,407.549683 312.224396,407.394867   C293.917023,407.230408 275.597229,406.936523 257.572327,411.191376   C244.209091,414.345795 231.524353,419.192871 219.314545,425.434692   C211.884109,429.233185 205.693192,427.478241 202.829910,421.118103   C200.529221,416.007629 201.816086,411.413849 206.922638,408.259857   C216.175827,402.544830 226.220703,398.515137 236.484222,395.010620   C237.236969,394.753632 237.973434,394.448975 239.603806,393.829956   C233.699173,390.147949 228.478409,386.796692 223.151413,383.623810   C221.352539,382.552338 219.561798,383.855530 217.911377,384.494751   C190.395599,395.152802 164.704666,391.314178 140.732086,374.648468   C129.105148,366.565491 121.270676,355.194763 114.418816,343.063873   C112.699425,340.019806 110.944977,336.994781 109.162186,333.987366   C104.849876,326.712952 106.272926,321.594849 113.806915,317.507355   C118.071411,315.193695 122.637787,313.615082 127.214836,312.061340   C128.579117,311.598236 130.259689,311.714386 130.950012,310.365021   C127.884644,307.065369 124.878304,303.829285 121.652824,300.311584  M127.197121,240.460129   C125.768631,240.388885 124.396370,239.227905 122.916313,240.202866   C119.545967,268.690979 139.147446,296.230408 161.488632,301.948700   C161.705765,295.577728 161.626968,289.369049 160.895020,283.079407   C158.464767,262.196289 147.310623,248.294388 127.197121,240.460129  M141.229156,330.578705   C138.846268,331.575195 135.864853,330.826233 133.875061,332.993958   C145.012161,358.605225 171.601883,373.329987 196.909439,367.853760   C188.555725,345.880127 170.770309,328.721710 141.229156,330.578705  M156.103561,161.507980   C144.722351,183.679169 147.315903,210.997604 162.291077,226.682755   C181.008072,202.661819 181.691879,173.095932 161.049896,153.955795   C158.521576,155.580002 157.764374,158.415924 156.103561,161.507980  M260.683807,135.274597   C260.876740,132.873856 261.069641,130.473114 261.262817,128.069122   C232.322937,127.104988 211.551682,154.260956 213.214081,176.144547   C216.844421,176.027100 220.456543,175.846817 223.998642,174.850189   C243.943802,169.238297 255.824860,156.016846 260.683807,135.274597  z" />
      <path opacity="1.000000" stroke="none" d=" M383.748932,120.135040   C398.218750,130.939789 407.161224,144.978668 411.526398,163.317154   C415.688751,154.822144 419.600311,147.398880 425.537048,141.321060   C430.446259,136.295166 435.564453,131.531860 441.852173,128.277771   C447.200317,125.509941 451.857147,126.343475 454.925507,131.336594   C463.013092,144.497589 471.463135,157.447754 474.540100,173.095825   C477.409882,187.690308 476.641418,201.843063 471.919281,215.865555   C471.663788,216.624222 471.508453,217.416611 471.214630,218.546616   C475.328644,219.360092 478.896362,217.676224 482.530853,217.206985   C486.366425,216.711807 490.175293,216.558884 493.986694,216.770004   C498.665253,217.029160 502.134705,220.058548 502.193756,224.610046   C502.445831,244.038391 504.002930,263.629791 494.544128,281.842834   C488.950745,292.612915 482.107758,302.244720 471.997498,309.837128   C474.324921,312.059143 477.245544,312.228882 479.769470,313.101318   C484.206451,314.635101 488.429688,316.602631 492.415588,319.012512   C497.189087,321.898468 498.773987,325.876007 496.415833,330.421448   C487.509979,347.587921 478.495331,364.735504 461.704437,375.910461   C444.045319,387.663361 424.589508,392.554657 403.759277,388.827332   C395.599731,387.367249 388.093597,382.467316 380.155273,379.493225   C373.647003,377.054840 366.939270,375.148773 360.389404,373.029205   C360.440063,371.047272 361.833344,370.590027 362.907288,369.935974   C393.122009,351.535034 412.200470,325.015350 419.095337,290.405029   C425.554016,257.984406 419.285858,227.933197 399.441376,201.038361   C397.434937,198.319092 395.311523,197.241196 391.960876,197.291809   C360.080658,197.773483 330.609100,175.500061 323.137207,142.217773   C321.142517,133.332779 321.440430,124.334015 321.841797,115.368187   C322.062897,110.429764 326.402405,107.014839 331.849762,106.675163   C350.479706,105.513496 368.024475,108.604897 383.748932,120.135040  M442.350616,290.745239   C442.580078,294.481262 441.817810,298.289764 442.879517,302.024963   C470.071320,294.399445 485.066956,261.428650 480.533386,239.543762   C471.883118,241.079956 464.795258,245.581558 458.516968,251.369919   C447.327515,261.686279 443.004883,275.006805 442.350616,290.745239  M444.474701,223.780334   C459.714966,203.211365 457.665680,172.073441 443.080505,154.059433   C421.899536,174.348175 423.315491,202.597626 441.709503,226.727295   C443.014069,226.417908 443.238281,225.069092 444.474701,223.780334  M445.574829,361.059784   C456.865906,354.489532 464.652771,344.843689 470.375763,333.299347   C450.559875,321.868134 409.457367,344.900970 407.433044,368.385681   C420.699768,370.131195 433.268829,368.268982 445.574829,361.059784  M368.829773,170.673141   C375.703033,174.102020 382.874451,176.305496 390.633209,176.213272   C393.442505,152.288239 367.647003,126.274582 342.743500,128.108978   C343.423981,146.941742 352.352386,160.678360 368.829773,170.673141  z" />
    </svg>
  );
};

// Generate random color for avatar
const getRandomColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7B731", "#5F27CD", "#00B894", "#FF6348", "#786FA6"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate avatar initials from name
const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Leaderboard = ({ campaignId }) => {
  const [backers, setBackers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef(null);
  const flipStateRef = useRef(null);
  const backerColorsRef = useRef({});
  const lastToastKeyRef = useRef(null);

  // Fetch initial top backers
  useEffect(() => {
    const fetchInitialBackers = async () => {
      try {
        setIsLoading(true);
        const response = await pledgeApi.getTopBackersOfCampaign(campaignId);

        if (response.data.data && Array.isArray(response.data.data)) {
          const initialBackers = response.data.data.map(backer => {
            // Generate color for each backer
            if (!backerColorsRef.current[backer.backerId]) {
              backerColorsRef.current[backer.backerId] = getRandomColor();
            }

            return {
              ...backer,
              avatar: getInitials(backer.backerName),
              color: backerColorsRef.current[backer.backerId],
            };
          });

          setBackers(initialBackers.sort((a, b) => b.totalPledged - a.totalPledged));
        }
      } catch (error) {
        console.error('❌ Failed to fetch initial backers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchInitialBackers();
    }
  }, [campaignId]);

  const amountRefs = useRef({});

  // Subscribe to campaign progress updates
  const handleCampaignProgress = useCallback((progressData) => {
    const data = progressData.data || progressData;

    // Update backers from topBackers
    if (data.topBackers && Array.isArray(data.topBackers)) {
      // Capture state before update
      if (listRef.current) {
        flipStateRef.current = Flip.getState(
          listRef.current.querySelectorAll(".backer-row")
        );
      }

      setBackers(prev => {
        const newBackers = data.topBackers.map(backer => {
          // Preserve color if exists, otherwise generate new one
          if (!backerColorsRef.current[backer.backerId]) {
            backerColorsRef.current[backer.backerId] = getRandomColor();
          }

          return {
            ...backer,
            avatar: getInitials(backer.backerName),
            color: backerColorsRef.current[backer.backerId],
          };
        });

        // Sort by totalPledged descending (should already be sorted from backend)
        return newBackers.sort((a, b) => b.totalPledged - a.totalPledged);
      });
    }

    // Show toast for latest pledge
    if (data.latestPledge) {
      const pledge = data.latestPledge;
      const toastKey = `${pledge.pledgeId || pledge.id || pledge.backerId}-${pledge.totalPledged || pledge.amount || 0}-${pledge.createdAt || ''}`;

      if (lastToastKeyRef.current === toastKey) {
        return;
      }
      lastToastKeyRef.current = toastKey;

      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-xs w-full bg-white dark:bg-darker-2 shadow-lg rounded-sm pointer-events-auto flex items-center gap-1.5 p-2 border border-border-light dark:border-border`}
        >
          <div className="flex-shrink-0 bg-indigo-200 p-2 rounded-full">
            <HeartHandshake className="w-6 h-6 text-indigo-700" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-sm font-semibold text-text-primary dark:text-white">
              {pledge.backerName}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-md font-bold text-[#27e28b]">
                +{(pledge.totalAmount || pledge.amount || 0).toLocaleString('vi-VN')} VND
              </span>
            </div>
          </div>
        </div>
      ), {
        duration: 3000,
        position: 'top-right',
      });

      // Animate the amount for the backer who just pledged
      if (pledge.backerId && amountRefs.current[pledge.backerId]) {
        const amountElement = amountRefs.current[pledge.backerId];

        // Pulse effect
        gsap.fromTo(
          amountElement.parentElement,
          { scale: 1 },
          {
            scale: 1.15,
            duration: 0.3,
            ease: "back.out(2)",
            yoyo: true,
            repeat: 1
          }
        );

        // Highlight effect
        gsap.fromTo(
          amountElement.parentElement,
          { backgroundColor: 'rgba(30, 199, 148, 0.3)' },
          {
            backgroundColor: 'rgba(30, 199, 148, 0)',
            duration: 1,
            ease: "power2.out"
          }
        );
      }
    }
  }, []);

  useCampaignProgress(campaignId, handleCampaignProgress);

  // Animate khi "backers" thay đổi
  useLayoutEffect(() => {
    if (!flipStateRef.current) return;

    Flip.from(flipStateRef.current, {
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.02,
      zIndex: (i, target) => {
        // Tăng z-index cho item đang di chuyển
        return 10;
      },
      onEnter: (targets) => {
        // Fade in cho item mới
        return gsap.from(targets, {
          opacity: 0,
          scale: 0.8,
        });
      },
    });

    flipStateRef.current = null;
  }, [backers]);

  // Format số tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Lấy medal emoji theo rank
  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster
        position="top-right"
        containerStyle={{
          top: 80,
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-3">
          <IoMdTrophy className="text-3xl" />
          <h2 className="text-2xl font-bold text-text-primary dark:text-white">
            Người ủng hộ hàng đầu
          </h2>
        </div>
        <p className="text-muted-foreground">
          Những người ủng hộ hàng đầu cho dự án này
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white dark:bg-darker-2 rounded-xl border border-border-light dark:border-white/10 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Đang tải...
            </p>
          </div>
        ) : backers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Chưa có người ủng hộ nào
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Hãy là người đầu tiên ủng hộ chiến dịch này!
            </p>
          </div>
        ) : (
          <ul ref={listRef} className="divide-y divide-border-light dark:divide-white/10">
            {backers.map((backer, index) => {
              const rank = index + 1;
              const medal = getMedalEmoji(rank);
              const isTopThree = rank <= 3;

              return (
                <li
                  key={backer.backerId}
                  data-id={backer.backerId}
                  className={`
                  backer-row flex items-center gap-4 p-3 transition-colors duration-200
                  ${isTopThree
                      ? 'bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10'
                      : 'hover:bg-background-lighter dark:hover:bg-darker'
                    }
                `}
                >
                  {/* Rank Number */}
                  <div className="flex items-center justify-center w-11 h-11 relative flex-shrink-0">
                    {isTopThree ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Wreath Background */}
                        <WreathLaurel rank={rank} className="absolute inset-0 w-full h-full opacity-60 -mt-0.5" />
                        {/* Rank Number on top */}
                        <span className="relative z-10 text-md font-bold text-text-primary dark:text-white drop-shadow-lg">
                          #{rank}
                        </span>
                      </div>
                    ) : (
                      <span className="text-md font-bold tabular-nums text-text-secondary dark:text-white/60">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm overflow-hidden">
                    {backer.avatarUrl ? (
                      <img
                        src={backer.avatarUrl}
                        alt={backer.backerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: backer.color }}
                      >
                        {backer.avatar}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-text-primary dark:text-white truncate">
                      {backer.backerName}
                    </h3>
                    {isTopThree && (
                      <p className="text-xs text-primary font-medium">
                        Người đóng góp hàng đầu
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2 justify-end">
                      <span
                        ref={(el) => amountRefs.current[backer.backerId] = el}
                        className="text-xl font-bold text-[#3eca88] tabular-nums"
                      >
                        {formatCurrency(backer.totalPledged)}
                      </span>
                      <span className="text-sm font-semibold text-[#3eca88]">VND</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}; export default Leaderboard;

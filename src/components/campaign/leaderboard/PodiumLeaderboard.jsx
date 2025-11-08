import React, { useEffect, useRef, useState } from "react";
import animejs from "animejs";

const anime = animejs.default || animejs;

// Helper: Detect if item moved between podium and list
const detectTransition = (oldBackers, newBackers) => {
  const oldTop3Ids = oldBackers.slice(0, 3).map(b => b.id);
  const newTop3Ids = newBackers.slice(0, 3).map(b => b.id);
  
  // Find items moving UP to podium (from list to top 3)
  const movingUp = newTop3Ids.filter(id => !oldTop3Ids.includes(id));
  
  // Find items moving DOWN from podium (from top 3 to list)
  const movingDown = oldTop3Ids.filter(id => !newTop3Ids.includes(id));
  
  return { movingUp, movingDown };
};

// Dữ liệu ban đầu cho 10 backers
const initialBackers = [
  { id: 1, name: "Alice Johnson", avatar: "AJ", amount: 5000, color: "#FF6B6B" },
  { id: 2, name: "Bob Smith", avatar: "BS", amount: 4500, color: "#4ECDC4" },
  { id: 3, name: "Charlie Brown", avatar: "CB", amount: 3800, color: "#45B7D1" },
  { id: 4, name: "Diana Prince", avatar: "DP", amount: 3200, color: "#FFA07A" },
  { id: 5, name: "Evan Williams", avatar: "EW", amount: 2900, color: "#98D8C8" },
  { id: 6, name: "Fiona Green", avatar: "FG", amount: 2500, color: "#F7B731" },
  { id: 7, name: "George Miller", avatar: "GM", amount: 2100, color: "#5F27CD" },
  { id: 8, name: "Hannah Davis", avatar: "HD", amount: 1800, color: "#00B894" },
  { id: 9, name: "Ivan Petrov", avatar: "IP", amount: 1500, color: "#FF6348" },
  { id: 10, name: "Julia Anderson", avatar: "JA", amount: 1200, color: "#786FA6" },
];

/**
 * PodiumLeaderboard Component
 * Hiển thị top 3 theo kiểu podium và 4-10 dạng list
 */
const PodiumLeaderboard = () => {
  const [backers, setBackers] = useState(() =>
    [...initialBackers].sort((a, b) => b.amount - a.amount)
  );
  const [prevBackers, setPrevBackers] = useState([]);
  const podiumRef = useRef(null);
  const listRef = useRef(null);
  const animatingRef = useRef(false);

  // Animate transitions với Anime.js
  const animateTransition = (movingUp, movingDown) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const podiumCards = Array.from(podiumRef.current?.querySelectorAll(".podium-card") || []);
    const listItems = Array.from(listRef.current?.querySelectorAll(".list-item") || []);
    
    // Timeline for moving UP to podium
    movingUp.forEach(id => {
      const el = listItems.find(item => parseInt(item.dataset.id) === id);
      if (!el) return;

      anime.timeline({
        easing: 'easeInOutCubic',
        complete: () => {
          animatingRef.current = false;
        }
      })
      // Step 1: Lift with 3D rotation
      .add({
        targets: el,
        translateY: -50,
        scale: 1.2,
        rotateX: -15,
        rotateY: 20,
        filter: ['brightness(1)', 'brightness(1.3)'],
        boxShadow: ['0 10px 30px rgba(0,0,0,0.2)', '0 40px 80px rgba(0,0,0,0.5)'],
        duration: 500,
        begin: () => {
          el.style.zIndex = '100';
          el.style.position = 'relative';
        }
      })
      // Step 2: Compress to card with spin
      .add({
        targets: el,
        scale: 0.3,
        rotateY: 720,
        rotateX: 0,
        borderRadius: ['0.5rem', '50%'],
        duration: 700,
      });
    });

    // Timeline for moving DOWN from podium
    movingDown.forEach(id => {
      const el = podiumCards.find(item => parseInt(item.dataset.id) === id);
      if (!el) return;

      anime.timeline({
        easing: 'easeInOutCubic',
        complete: () => {
          animatingRef.current = false;
        }
      })
      // Step 1: Compress to card
      .add({
        targets: el,
        scale: 0.3,
        rotateY: -720,
        borderRadius: ['1rem', '50%'],
        duration: 700,
        begin: () => {
          el.style.zIndex = '100';
          el.style.position = 'relative';
        }
      })
      // Step 2: Drop down
      .add({
        targets: el,
        translateY: 100,
        opacity: [1, 0.5],
        duration: 400,
      });
    });

    // After animation, wait for React to re-render, then expand
    setTimeout(() => {
      movingUp.forEach(id => {
        const toEl = podiumCards.find(item => parseInt(item.dataset.id) === id);
        if (toEl) {
          toEl.style.opacity = '0';
          toEl.style.scale = '0.3';
          toEl.style.transform = 'rotateY(720deg)';
          
          anime({
            targets: toEl,
            opacity: [0, 1],
            scale: [0.3, 1],
            rotateY: [720, 0],
            borderRadius: ['50%', '1rem'],
            duration: 600,
            easing: 'easeOutElastic(1, .8)',
            complete: () => {
              toEl.style.zIndex = '';
              toEl.style.position = '';
            }
          });
        }
      });

      movingDown.forEach(id => {
        const toEl = listItems.find(item => parseInt(item.dataset.id) === id);
        if (toEl) {
          toEl.style.opacity = '0.5';
          toEl.style.scale = '0.3';
          toEl.style.transform = 'rotateY(-720deg) translateY(100px)';
          
          anime({
            targets: toEl,
            opacity: [0.5, 1],
            scale: [0.3, 1],
            rotateY: [-720, 0],
            translateY: [100, 0],
            borderRadius: ['50%', '0.5rem'],
            duration: 600,
            easing: 'easeOutElastic(1, .8)',
            complete: () => {
              toEl.style.zIndex = '';
              toEl.style.position = '';
            }
          });
        }
      });
    }, 1200);

    // Animate other items with stagger
    if (movingUp.length === 0 && movingDown.length === 0) {
      anime({
        targets: [...podiumCards, ...listItems],
        translateX: [
          { value: -20, duration: 200 },
          { value: 0, duration: 400 }
        ],
        opacity: [
          { value: 0.7, duration: 200 },
          { value: 1, duration: 400 }
        ],
        delay: anime.stagger(50),
        easing: 'easeOutCubic',
        complete: () => {
          animatingRef.current = false;
        }
      });
    }
  };

  // Watch for backer changes
  useEffect(() => {
    if (prevBackers.length === 0) {
      setPrevBackers(backers);
      return;
    }

    const { movingUp, movingDown } = detectTransition(prevBackers, backers);
    
    if (movingUp.length > 0 || movingDown.length > 0) {
      animateTransition(movingUp, movingDown);
    } else {
      animatingRef.current = false;
    }

    setPrevBackers(backers);
  }, [backers, prevBackers]);

  // Mô phỏng thay đổi số tiền theo thời gian thực
  useEffect(() => {
    const timer = setInterval(() => {
      if (animatingRef.current) return;

      setBackers((prev) => {
        const arr = [...prev];
        
        // Chọn ngẫu nhiên 1 item KHÔNG phải top 1 để cộng tiền
        const eligibleIndices = arr.map((_, idx) => idx).filter(idx => idx > 0);
        const randomIndex = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
        
        // Tính số tiền cần cộng để vượt qua item phía trên
        const currentAmount = arr[randomIndex].amount;
        const targetAmount = arr[randomIndex - 1].amount;
        const minDelta = targetAmount - currentAmount + 50000;
        const maxDelta = minDelta + 500000;
        const deltaAmount = Math.max(100000, minDelta + Math.floor(Math.random() * (maxDelta - minDelta)));
        
        arr[randomIndex] = { 
          ...arr[randomIndex], 
          amount: arr[randomIndex].amount + deltaAmount 
        };
        
        return arr.sort((a, b) => b.amount - a.amount).slice(0, 10);
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Format số tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Lấy top 3 và còn lại
  const top3 = backers.slice(0, 3);
  const rest = backers.slice(3);

  // Sắp xếp top 3 theo thứ tự hiển thị: 2-1-3
  const podiumOrder = [top3[1], top3[0], top3[2]]; // Silver, Gold, Bronze

  return (
    <div className="max-w-6xl mx-auto" style={{ perspective: "1500px" }}>
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="text-5xl">🏆</div>
          <h2 className="text-4xl font-bold text-text-primary dark:text-white">
            Top Backers
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Những người ủng hộ hàng đầu cho dự án này
        </p>
      </div>

      {/* Podium - Top 3 */}
      <div 
        ref={podiumRef}
        className="mb-16 flex items-end justify-center gap-4"
        style={{ transformStyle: "preserve-3d" }}
      >
        {podiumOrder.map((backer, idx) => {
          if (!backer) return null;
          
          const actualRank = backers.findIndex(b => b.id === backer.id) + 1;
          const isFirst = actualRank === 1;
          const isSecond = actualRank === 2;
          const isThird = actualRank === 3;
          
          // Height và styling dựa vào rank
          const cardHeight = isFirst ? 'h-80' : isSecond ? 'h-72' : 'h-64';
          const medalEmoji = isFirst ? '🥇' : isSecond ? '🥈' : '🥉';
          const rankColor = isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-400' : 'text-orange-400';

          return (
            <div
              key={backer.id}
              data-id={backer.id}
              className={`podium-card ${cardHeight} w-64 relative`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`
                h-full flex flex-col items-center justify-between
                bg-gradient-to-br from-white to-gray-50 dark:from-darker dark:to-darker-light
                rounded-2xl border-2 ${isFirst ? 'border-yellow-400' : isSecond ? 'border-gray-400' : 'border-orange-400'}
                shadow-2xl p-6 transition-all duration-300
                ${isFirst ? 'scale-105' : ''}
              `}>
                {/* Crown cho #1 */}
                {isFirst && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl animate-bounce">
                    👑
                  </div>
                )}

                {/* Rank Badge */}
                <div className={`
                  absolute -top-4 -right-4 w-12 h-12 rounded-full 
                  flex items-center justify-center text-2xl font-bold
                  bg-white dark:bg-darker-2 border-4 ${isFirst ? 'border-yellow-400' : isSecond ? 'border-gray-400' : 'border-orange-400'}
                  shadow-lg
                `}>
                  <span className={rankColor}>{actualRank}</span>
                </div>

                {/* Medal */}
                <div className="text-6xl mb-2">
                  {medalEmoji}
                </div>

                {/* Avatar */}
                <div 
                  className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    text-white font-bold text-2xl border-4 border-white dark:border-darker
                    shadow-xl mb-3
                  `}
                  style={{ backgroundColor: backer.color }}
                >
                  {backer.avatar}
                </div>

                {/* Name */}
                <h3 className="font-bold text-xl text-text-primary dark:text-white text-center mb-2">
                  {backer.name}
                </h3>

                {/* Amount */}
                <div className="text-center">
                  <div className={`text-3xl font-bold ${rankColor} tabular-nums`}>
                    {formatCurrency(backer.amount)}
                  </div>
                  <div className="text-xs text-text-secondary dark:text-white/60 mt-1">
                    pledged
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of the list (4-10) */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-6">
          Other Top Backers
        </h3>
        
        <div 
          className="bg-white dark:bg-darker-2 rounded-xl border border-border-light dark:border-white/10 shadow-lg"
          style={{ transformStyle: "preserve-3d" }}
        >
          <ul ref={listRef} className="divide-y divide-border-light dark:divide-white/10">
            {rest.map((backer) => {
              const rank = backers.findIndex(b => b.id === backer.id) + 1;

              return (
                <li
                  key={backer.id}
                  data-id={backer.id}
                  className="list-item flex items-center gap-4 p-4 hover:bg-background-lighter dark:hover:bg-darker-2-light transition-colors"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Rank */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary tabular-nums">
                      {rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: backer.color }}
                  >
                    {backer.avatar}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-text-primary dark:text-white">
                      {backer.name}
                    </h4>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-secondary tabular-nums">
                      {formatCurrency(backer.amount)} đ
                    </div>
                    <div className="text-xs text-text-secondary dark:text-white/60">
                      pledged
                    </div>
                  </div>

                  {/* Trend Arrow */}
                  <div className="text-2xl text-green-500">
                    ▲
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-primary font-semibold">💡 Anime.js Demo:</span> Bảng xếp hạng với hiệu ứng 3D morphing. 
          Item sẽ biến đổi từ row → card khi lên podium và ngược lại.
        </p>
      </div>
    </div>
  );
};

export default PodiumLeaderboard;

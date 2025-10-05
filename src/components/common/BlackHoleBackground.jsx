import React, { useEffect, useRef } from 'react';

// Reusable canvas-based grid + blackhole (gravity) background
// Props:
// - isDark: boolean → chọn màu lưới mặc định (trắng cho nền tối, đen cho nền sáng)
// - spacing, strength, radius, lineWidth: số → tinh chỉnh vật lý/độ chi tiết
// - gridColor: chuỗi rgba → ghi đè màu lưới nếu cần
// - lensOpacity: số (0..1) → độ tối của hiệu ứng lens ở tâm hố đen
// - className: chuỗi → class Tailwind bổ sung
const BlackHoleBackground = ({
  isDark = true,
  spacing = 90,
  strength = 1400,
  radius = 320,
  lineWidth = 1,
  gridColor,
  lensOpacity = 0.55,
  className = '',
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    const BLEED = 4; // tránh hở viền do rounding/transform

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.ceil((rect.width + BLEED) * dpr);
      canvas.height = Math.ceil((rect.height + BLEED) * dpr);
      canvas.style.width = `${rect.width + BLEED}px`;
      canvas.style.height = `${rect.height + BLEED}px`;
      canvas.style.left = `${-BLEED / 2}px`;
      canvas.style.top = `${-BLEED / 2}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // đặt vị trí mặc định ở tâm
    const rect0 = wrapper.getBoundingClientRect();
    mouseRef.current.x = rect0.width / 2;
    mouseRef.current.y = rect0.height / 2;
    mouseRef.current.targetX = mouseRef.current.x;
    mouseRef.current.targetY = mouseRef.current.y;

    // Lắng nghe event ở phần tử cha để không chặn tương tác (canvas có pointer-events: none)
    const container = wrapper.parentElement || wrapper;

    const handleMove = (clientX, clientY) => {
      const rect = wrapper.getBoundingClientRect();
      mouseRef.current.targetX = clientX - rect.left;
      mouseRef.current.targetY = clientY - rect.top;
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0])
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      const rect = wrapper.getBoundingClientRect();
      mouseRef.current.targetX = rect.width / 2;
      mouseRef.current.targetY = rect.height / 2;
    };

    const maxForce = isDark ? 0.45 : 0.35;
    const displacePoint = (x, y) => {
      const dx = x - mouseRef.current.x;
      const dy = y - mouseRef.current.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq) + 0.0001;
      if (dist > radius) return { x, y };
      const force = Math.min(strength / (distSq + 200), maxForce);
      return { x: x - dx * force, y: y - dy * force };
    };

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // ease con trỏ
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.14;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.14;

      ctx.clearRect(0, 0, w, h);

      // Tăng độ dày nhẹ và độ sáng lưới ở dark mode để nổi bật hơn
      const effectiveLineWidth = isDark ? lineWidth * 1.1 : lineWidth;
      ctx.lineWidth = effectiveLineWidth;
      const effectiveGridColor =
        gridColor || (isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)');
      ctx.strokeStyle = effectiveGridColor;

      // dọc
      for (let x = 0; x <= w + 0.5; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= h + 0.5; y += spacing) {
          const p = displacePoint(x, y);
          if (y === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      // ngang
      for (let y = 0; y <= h + 0.5; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= w + 0.5; x += spacing) {
          const p = displacePoint(x, y);
          if (x === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // lens tối ở tâm (mạnh hơn một chút ở dark mode)
      const m = mouseRef.current;
      const effectiveLensOpacity = Math.min(
        0.85,
        lensOpacity * (isDark ? 1.25 : 1)
      );
      const rg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, radius * 0.65);
      rg.addColorStop(0, `rgba(0,0,0,${effectiveLensOpacity})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.globalCompositeOperation = 'multiply';
      ctx.beginPath();
      ctx.arc(m.x, m.y, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Vòng halo sáng để nhấn biên lens trên nền tối (blend screen)
      const haloRingAlpha = isDark ? 0.18 : 0.08;
      const ringInner = radius * 0.35;
      const ringOuter = radius * 0.85;
      const ringGrad = ctx.createRadialGradient(
        m.x,
        m.y,
        ringInner,
        m.x,
        m.y,
        ringOuter
      );
      ringGrad.addColorStop(0, 'rgba(255,255,255,0)');
      ringGrad.addColorStop(0.6, `rgba(255,255,255,${haloRingAlpha * 0.5})`);
      ringGrad.addColorStop(0.85, `rgba(255,255,255,${haloRingAlpha})`);
      ringGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = ringGrad;
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(m.x, m.y, ringOuter, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    // Quan sát thay đổi kích thước phần tử cha để update canvas
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrapper);
    window.addEventListener('resize', resize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationRef.current || 0);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, [isDark, spacing, strength, radius, lineWidth, gridColor, lensOpacity]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className='absolute inset-0'
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default BlackHoleBackground;

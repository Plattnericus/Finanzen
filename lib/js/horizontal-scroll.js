document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.analyse-methoden-container');
  
  if (!container) return;

  const speedFactor = 3;
  let lastScrollTime = 0;
  let lastScrollPos = 0;
  let velocity = 0;
  let animationId = null;

  container.addEventListener('wheel', function(e) {
    e.preventDefault();
    const now = performance.now();
    const deltaTime = now - lastScrollTime;
    
    if (deltaTime > 0) {
      velocity = (container.scrollLeft - lastScrollPos) / deltaTime;
    }
    
    const baseSpeed = e.deltaY * speedFactor;
    const adjustedSpeed = baseSpeed * (1 - Math.min(Math.abs(velocity) * 0.01, 0.5));
    
    container.scrollLeft += adjustedSpeed;
    
    lastScrollPos = container.scrollLeft;
    lastScrollTime = now;

    if (animationId) cancelAnimationFrame(animationId);
    applyMomentum();
  }, { passive: false });

  function applyMomentum() {
    velocity *= 0.95; 
    
    if (Math.abs(velocity) > 0.5) {
      container.scrollLeft += velocity * 16;
      animationId = requestAnimationFrame(applyMomentum);
    } else {
      animationId = null;
    }
  }

  let touchStartX = 0;
  let touchStartScroll = 0;
  let lastTouchTime = 0.5;
  let lastTouchX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartScroll = container.scrollLeft;
    lastTouchTime = performance.now();
    lastTouchX = touchStartX;
    if (animationId) cancelAnimationFrame(animationId);
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const now = performance.now();
    
    if (now > lastTouchTime) {
      velocity = (touchX - lastTouchX) / (now - lastTouchTime);
      lastTouchTime = now;
      lastTouchX = touchX;
    }
    
    container.scrollLeft = touchStartScroll - (touchX - touchStartX);
  }, { passive: false });

  container.addEventListener('touchend', () => {
    applyMomentum(-velocity * 20);
  });
});
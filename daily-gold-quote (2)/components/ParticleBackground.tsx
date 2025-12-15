import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Reduced from 350 to 150 for a cleaner look
    const particleCount = 150;
    
    // Slightly more transparent colors for subtlety
    const colors = [
        'rgba(212, 175, 55, 0.6)',   // Gold
        'rgba(255, 255, 240, 0.5)',  // Ivory
        'rgba(255, 215, 0, 0.4)',    // Yellow Gold
        'rgba(205, 127, 50, 0.3)',   // Bronze
        'rgba(255, 255, 255, 0.3)'   // Sparkle
    ];

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      speedX: number;
      speedY: number;
      angle: number;
      spinSpeed: number;
      color: string;
      alpha: number;
      targetAlpha: number;
      z: number; 

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        
        // Depth: 0.2 (far) to 3.0 (near)
        this.z = Math.random() * 2.8 + 0.2; 
        
        // SIZE REDUCED 50%: Was (Math.random() * 3 + 1)
        this.size = (Math.random() * 1.5 + 0.5) * this.z;
        
        // SPEED REDUCED 50%: Was 0.6
        this.speedX = (Math.random() - 0.5) * 0.3 * this.z;
        this.speedY = (Math.random() - 0.5) * 0.3 * this.z;
        
        this.angle = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.01; // Slower rotation
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.1; // Lower max opacity
        this.targetAlpha = Math.random() * 0.6 + 0.1;
      }

      update(w: number, h: number) {
        this.angle += this.spinSpeed;
        
        // Gentle organic motion
        this.x += this.speedX + Math.cos(this.angle) * 0.2 * this.z;
        this.y += this.speedY + Math.sin(this.angle) * 0.2 * this.z;

        // Wrap around
        if (this.x < -50) this.x = w + 50;
        if (this.x > w + 50) this.x = -50;
        if (this.y < -50) this.y = h + 50;
        if (this.y > h + 50) this.y = -50;

        // Subtle twinkling
        if (Math.abs(this.targetAlpha - this.alpha) < 0.01) {
            this.targetAlpha = Math.random() * 0.6 + 0.1;
        }
        this.alpha += (this.targetAlpha - this.alpha) * 0.02;
      }

      draw(w: number, h: number, mouseX: number, mouseY: number) {
        if (!ctx) return;
        
        // Reduced Parallax effect
        const offsetX = (mouseX - w / 2) * 0.04 * this.z;
        const offsetY = (mouseY - h / 2) * 0.04 * this.z;

        const drawX = this.x - offsetX;
        const drawY = this.y - offsetY;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Reduced glow intensity
        if (this.z > 2.0) {
             ctx.shadowBlur = 10 * (this.z / 2); 
             ctx.shadowColor = this.color;
        }
        
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(w, h));
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
        {/* Base Atmospheric Layer */}
        <div 
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
                background: 'radial-gradient(circle at 50% 120%, #2a2420 0%, #151210 50%, #000000 100%)'
            }}
        ></div>
        
        {/* Particles Layer */}
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
        />
        
        {/* Texture Overlays (Reduced Opacity) */}
        <div 
            className="fixed inset-0 z-0 pointer-events-none opacity-20"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay'
            }}
        ></div>
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </>
  );
};

export default ParticleBackground;
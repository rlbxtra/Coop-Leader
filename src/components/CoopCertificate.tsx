/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Download, Share2, Sparkles, Check, Copy } from 'lucide-react';
import { CoopStyle, ResultDetails } from '../types';

interface CoopCertificateProps {
  userName: string;
  style: CoopStyle;
  details: ResultDetails;
}

export default function CoopCertificate({ userName, style, details }: CoopCertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-load the mascot image for canvas rendering
  useEffect(() => {
    const img = new Image();
    img.src = details.imagePath;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [details.imagePath]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDownloading(true);

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      // Base dimensions: 1200 x 800 (landscape ratio, perfect for certificate)
      canvas.width = 1200;
      canvas.height = 800;

      // Draw background: Antique Parchment Cream
      ctx.fillStyle = '#FCF9F5';
      ctx.fillRect(0, 0, 1200, 800);

      // Add a subtle paper texture (random tiny grain/spots)
      ctx.fillStyle = 'rgba(139, 115, 85, 0.03)';
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * 1200;
        const y = Math.random() * 800;
        const r = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Double borders: Outer dark wood brown, inner elegant gold
      // Outer border
      ctx.strokeStyle = '#3D405B';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 1160, 760);

      // Inner elegant accent border
      ctx.strokeStyle = '#F2CC8F';
      ctx.lineWidth = 3;
      ctx.strokeRect(38, 38, 1124, 724);

      // Draw decorative corner flourishes/rivets
      ctx.fillStyle = '#3D405B';
      const corners = [
        { x: 38, y: 38 },
        { x: 1162, y: 38 },
        { x: 38, y: 762 },
        { x: 1162, y: 762 }
      ];
      corners.forEach(corner => {
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F2CC8F';
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3D405B';
      });

      // --- HEADER SECTION ---
      // Decorative header ornament
      ctx.fillStyle = '#81B29A';
      ctx.beginPath();
      ctx.moveTo(400, 100);
      ctx.lineTo(800, 100);
      ctx.lineTo(770, 90);
      ctx.lineTo(800, 80);
      ctx.lineTo(400, 80);
      ctx.lineTo(430, 90);
      ctx.closePath();
      ctx.fill();

      // Top subtitle
      ctx.fillStyle = '#3D405B';
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('OFFICIAL DECREE OF THE ACADEMY OF CLUCKING SCIENCES', 600, 120);

      // Main Title
      ctx.fillStyle = '#3D405B';
      ctx.font = "italic bold 36px 'Playfair Display', serif";
      ctx.fillText('Coop Leadership Certificate', 600, 170);

      ctx.strokeStyle = '#E2DCD5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, 210);
      ctx.lineTo(950, 210);
      ctx.stroke();

      // Certify text
      ctx.fillStyle = '#3D405B';
      ctx.font = "italic 16px 'Playfair Display', serif";
      ctx.fillText('This certificate is proudly awarded to the elite backyard human:', 600, 240);

      // UserName (Grand handwritten style)
      ctx.fillStyle = '#E07A5F';
      ctx.font = "bold 44px 'Playfair Display', serif";
      ctx.fillText(userName || 'Anonymous Chicken Enthusiast', 600, 300);

      // Underline for name
      ctx.strokeStyle = '#E07A5F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(350, 325);
      ctx.lineTo(850, 325);
      ctx.stroke();

      // Declaration
      ctx.fillStyle = '#3D405B';
      ctx.font = "15px 'Inter', sans-serif";
      ctx.fillText('who, through meticulous analysis of comical lifetime habits, has been ordained as a certified:', 600, 360);

      // Rank Title (e.g. HEAD ROOSTER)
      const rankTitle = details.title.toUpperCase();
      let rankColor = '#E07A5F'; // Default warm tomato
      if (style === 'rooster') rankColor = '#E07A5F'; 
      if (style === 'hen') rankColor = '#81B29A'; 
      if (style === 'rebel') rankColor = '#F2CC8F'; 

      ctx.fillStyle = rankColor;
      ctx.font = "bold 46px 'Space Grotesk', sans-serif";
      ctx.fillText(rankTitle, 600, 420);

      // Mascot Tagline
      ctx.fillStyle = '#3D405B';
      ctx.font = "italic bold 18px 'Playfair Display', serif";
      ctx.fillText(`"${details.tagline}"`, 600, 465);

      // Draw Mascot Photo Box on the left, Stats on the right
      // Background / border for illustration
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(80, 480, 220, 220);
      ctx.strokeStyle = '#3D405B';
      ctx.lineWidth = 4;
      ctx.strokeRect(80, 480, 220, 220);

      const img = new Image();
      img.src = details.imagePath;
      img.onload = () => {
        try {
          ctx.drawImage(img, 84, 484, 212, 212);
        } catch (e) {
          console.error("Failed to render mascot thumbnail on canvas", e);
        }
        completeCanvasDraw(ctx, canvas, details, style);
      };

      // Fallback in case loading takes too long or fails - draw immediately too
      if (img.complete) {
        try {
          ctx.drawImage(img, 84, 484, 212, 212);
        } catch (e) {}
        completeCanvasDraw(ctx, canvas, details, style);
      } else {
        // Wait a small timeout and finalize if onload didn't fire
        setTimeout(() => {
          completeCanvasDraw(ctx, canvas, details, style);
        }, 300);
      }

    } catch (err) {
      console.error('Error rendering certificate on canvas:', err);
      setIsDownloading(false);
    }
  };

  const completeCanvasDraw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    details: ResultDetails,
    style: CoopStyle
  ) => {
    // Prevent duplicate triggers
    if (canvas.getAttribute('data-completed') === 'true') {
      triggerDownload(canvas);
      return;
    }
    canvas.setAttribute('data-completed', 'true');

    // Stats Box on the right side
    const statsX = 330;
    const statsY = 500;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#3D405B';
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillText('COOP DOMINANCE SPECTRUM', statsX, statsY);

    // Draw Stats Bars
    const stats = [
      { label: 'Roost Leadership & Volume', value: details.statPercentages.rooster, color: '#E07A5F' },
      { label: 'Feed & Clipboard Organization', value: details.statPercentages.hen, color: '#81B29A' },
      { label: 'Boundary Trespassing Index', value: details.statPercentages.rebel, color: '#F2CC8F' }
    ];

    stats.forEach((stat, idx) => {
      const barY = statsY + 30 + idx * 45;
      ctx.fillStyle = '#3D405B';
      ctx.font = "12px 'Inter', sans-serif";
      ctx.fillText(`${stat.label}: ${stat.value}%`, statsX, barY);

      // Track background
      ctx.fillStyle = '#E2DCD5';
      ctx.fillRect(statsX, barY + 8, 300, 10);

      // Fill progress ratio
      ctx.fillStyle = stat.color;
      ctx.fillRect(statsX, barY + 8, 300 * (stat.value / 100), 10);
    });

    // --- SEALS AND SIGNATURES AT THE BOTTOM ---
    const bottomY = 620;

    // Stamp Circle on the right
    const stampX = 1000;
    const stampY = 590;

    // Outer scalloped-like circle or plain thick circle
    ctx.strokeStyle = '#E07A5F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#E07A5F';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Text in stamp
    ctx.fillStyle = '#E07A5F';
    ctx.textAlign = 'center';
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillText('APPROVED', stampX, stampY - 14);
    ctx.font = "bold 14px 'Space Grotesk', sans-serif";
    ctx.fillText('COOP SEAL', stampX, stampY + 4);
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillText('100% ORGANIC', stampX, stampY + 20);

    // Signature line
    const sigLineX = 700;
    const sigLineY = 660;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#3D405B';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText('Awarded on this day in backyard history', sigLineX, sigLineY);

    // Signature scribble (comical drawing!)
    ctx.strokeStyle = '#3D405B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sigLineX - 90, sigLineY - 25);
    ctx.bezierCurveTo(sigLineX - 40, sigLineY - 45, sigLineX - 10, sigLineY - 5, sigLineX + 20, sigLineY - 35);
    ctx.bezierCurveTo(sigLineX + 40, sigLineY - 55, sigLineX + 60, sigLineY - 15, sigLineX + 100, sigLineY - 20);
    ctx.stroke();

    ctx.strokeStyle = '#3D405B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigLineX - 110, sigLineY - 5);
    ctx.lineTo(sigLineX + 110, sigLineY - 5);
    ctx.stroke();

    ctx.fillStyle = '#3D405B';
    ctx.font = "italic bold 11px 'Playfair Display', serif";
    ctx.fillText('The Cluckmaster General', sigLineX, sigLineY + 14);

    triggerDownload(canvas);
  };

  const triggerDownload = (canvas: HTMLCanvasElement) => {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${userName.replace(/\s+/g, '_')}_coop_certification.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to trigger automatic canvas download link', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareOutcome = () => {
    const textStr = `I just took the "What Kind of Coop Leader Are You?" quiz! I got officially certified as a "${details.title}" (${details.tagline})! Discover your inner chicken style! 🐔✨`;
    navigator.clipboard.writeText(textStr + `\n\nTake the quiz here: ${window.location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const textStr = encodeURIComponent(`I am officially certified as a "${details.title}" in the Backyard Chicken Coop! 🐔🏆 ${details.tagline}. Find your coop match:`);
    window.open(`https://twitter.com/intent/tweet?text=${textStr}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="relative mt-8">
      {/* Hidden canvas used exclusively for high-res PNG formulation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Visually stunning, responsive, interactive HTML Certificate mock for desktop and mobile preview */}
      <div 
        id="certificate-preview"
        className="w-full max-w-4xl mx-auto rounded-xl border-4 border-[#3D405B] bg-amber-50/20 p-4 sm:p-8 text-center shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] relative overflow-hidden select-none"
        style={{
          backgroundColor: '#FCF9F5',
          borderStyle: 'double',
          borderWidth: '8px',
          borderColor: '#3D405B',
        }}
      >
        {/* Subtle radial parchment shading */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#8b7355]/5 pointer-events-none" />

        {/* Outer elegant golden accent thin border */}
        <div className="absolute inset-2 border border-[#F2CC8F] pointer-events-none rounded-lg" />

        {/* Small corner decorative studs */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#3D405B] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F2CC8F]" />
        </div>
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#3D405B] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F2CC8F]" />
        </div>
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#3D405B] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F2CC8F]" />
        </div>
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#3D405B] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F2CC8F]" />
        </div>

        {/* Main Certificate Content */}
        <div className="relative z-10 space-y-4">
          
          {/* Header ribbon ornament */}
          <div className="flex justify-center items-center gap-2">
            <div className="h-0.5 w-16 sm:w-24 bg-[#F2CC8F]" />
            <span className="font-mono text-[10px] sm:text-xs tracking-widest text-[#3D405B] px-2 font-bold uppercase">
              Official Country Decree
            </span>
            <div className="h-0.5 w-16 sm:w-24 bg-[#F2CC8F]" />
          </div>

          <h3 className="font-serif italic text-2xl sm:text-4xl text-[#3D405B] font-bold tracking-tight">
            Coop Leadership Certificate
          </h3>

          <div className="w-2/3 h-px bg-stone-300 mx-auto" />

          <p className="font-serif italic text-sm sm:text-base text-[#3D405B]">
            This certificate is proudly awarded to the elite backyard human:
          </p>

          <div className="my-3 inline-block">
            <h4 className="font-serif text-3xl sm:text-5xl text-[#E07A5F] font-extrabold px-6 py-2 border-b-2 border-dashed border-[#E07A5F]/40 leading-tight">
              {userName || 'A Secret Farmer'}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-[#3D405B] max-w-xl mx-auto px-4 leading-relaxed mt-1">
            who, through meticulous analysis of comical lifestyle scenarios, has been cluckingly ordained with the prestigious rank of:
          </p>

          {/* Grand style crown display */}
          <div className="py-2">
            <div className={`text-3xl sm:text-5xl font-display font-extrabold tracking-wide uppercase ${
              style === 'rooster' ? 'text-[#E07A5F]' :
              style === 'hen' ? 'text-[#81B29A]' : 'text-[#F2CC8F]'
            }`}>
              {style === 'rooster' ? 'Head Rooster' : style === 'hen' ? 'Head Hen' : 'Free-Range Rebel'}
            </div>
            <div className="text-xs sm:text-sm italic font-serif text-stone-700 font-bold mt-1 max-w-lg mx-auto">
              "{details.tagline}"
            </div>
          </div>

          {/* Responsive Layout for illustration and stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-4 max-w-3xl mx-auto px-4 text-left">
            
            {/* Mascot portrait framed */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative p-1 bg-white border-2 border-[#3D405B] shadow-md rounded-lg max-w-[140px] aspect-square overflow-hidden hover:scale-105 transition-transform">
                <img 
                  src={details.imagePath} 
                  alt={details.title} 
                  className="w-full h-full object-cover rounded-md"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Stats list */}
            <div className="md:col-span-8 space-y-3">
              <h5 className="font-display text-xs font-extrabold text-[#3D405B] uppercase tracking-wider text-center md:text-left">
                Coop Dominance Spectrum
              </h5>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-stone-700">
                    <span>Roost Leadership & Volume</span>
                    <span className="font-semibold text-[#E07A5F]">{details.statPercentages.rooster}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-[#E07A5F] rounded-full" style={{ width: `${details.statPercentages.rooster}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-stone-700">
                    <span>Feed & Clipboard Organization</span>
                    <span className="font-semibold text-[#81B29A]">{details.statPercentages.hen}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-[#81B29A] rounded-full" style={{ width: `${details.statPercentages.hen}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-stone-700">
                    <span>Boundary Trespassing Index</span>
                    <span className="font-semibold text-[#F2CC8F]">{details.statPercentages.rebel}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-[#F2CC8F] rounded-full" style={{ width: `${details.statPercentages.rebel}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Signature line and Seal Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 px-4 gap-6 max-w-3xl mx-auto">
            
            {/* Signature section */}
            <div className="flex flex-col items-center">
              {/* Comical signature image fallback */}
              <div className="font-serif italic text-[#3D405B] text-lg select-none opacity-80 h-8 -mb-3 font-bold">
                {style === 'rooster' ? 'Roo_Strut_99' : style === 'hen' ? 'H_Clipboard_Org' : 'Buster_No_Fences_X'}
              </div>
              <div className="w-48 h-[1.5px] bg-[#3D405B]" />
              <span className="text-[10px] text-[#3D405B] mt-1 font-mono uppercase tracking-wider">
                The Cluckmaster General
              </span>
            </div>

            {/* Beautiful Badge Medal Stamp */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-full border-2 border-double border-[#E07A5F] bg-amber-50 flex flex-col items-center justify-center text-[#E07A5F] font-bold select-none p-1">
                <span className="text-[7px] tracking-tight uppercase font-mono">Approved</span>
                <span className="text-[9px] font-display uppercase tracking-tighter leading-none my-0.5">Coop Seal</span>
                <span className="text-[6px] tracking-tight text-[#81B29A] uppercase font-bold font-mono">100% Legit</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Action Controls */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
        
        {/* Download Button */}
        <button
          onClick={downloadCertificate}
          disabled={isDownloading}
          id="btn-download-cert"
          className="wood-button flex items-center gap-2 px-6 py-3 font-display rounded-lg font-bold text-sm cursor-pointer disabled:opacity-50 text-[#3D405B]"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-stone-800 border-t-transparent animate-spin" />
              Certifying Ink...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download High-Res Graphic (PNG)
            </>
          )}
        </button>

        {/* Copy Share Text */}
        <button
          onClick={shareOutcome}
          id="btn-copy-link"
          className="flex items-center gap-2 px-6 py-3 bg-[#81B29A] hover:bg-[#6da187] text-white border-2 border-[#3D405B] rounded-lg font-display font-semibold text-sm cursor-pointer transition-colors shadow-[2px_2px_0px_#3D405B]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-100" />
              Copied Invitation!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Shareable Link & Status
            </>
          )}
        </button>

        {/* Twitter */}
        <button
          onClick={shareTwitter}
          id="btn-share-twitter"
          className="flex items-center gap-2 px-4 py-3 bg-[#3D405B] text-white hover:bg-opacity-90 rounded-lg border-2 border-[#3D405B] font-display font-semibold text-sm cursor-pointer transition-colors shadow-[2px_2px_0px_#3D405B]"
        >
          <Share2 className="w-4 h-4" />
          Twitter
        </button>

      </div>

      <p className="text-center text-stone-500 font-mono text-[10px] mt-4">
        Downloaded graphic can be printed in high quality!
      </p>

    </div>
  );
}

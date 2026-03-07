'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { MemeStyle } from 'meme-engine';

interface Props {
  memeId: string;
  templateId: string;
  caption: string;
  style: MemeStyle;
  svgContent: string;
}

export function ExportButtons({
  memeId,
  templateId,
  caption,
  style,
  svgContent,
}: Props) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportSvg = useCallback(() => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rex-meme-${memeId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgContent, memeId]);

  const handleExportPng = useCallback(async () => {
    setExporting('png');
    try {
      const res = await fetch('/api/meme/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, caption, style, format: 'png' }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rex-meme-${memeId}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PNG export failed:', err);
    } finally {
      setExporting(null);
    }
  }, [templateId, caption, style, memeId]);

  const handleExportGif = useCallback(async () => {
    setExporting('gif');
    try {
      const res = await fetch('/api/meme/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, caption, style, format: 'gif' }),
      });
      const data = (await res.json()) as { stub?: boolean; error?: string };
      if (data.stub) {
        alert('GIF export is coming soon! 🎬');
      }
    } catch (err) {
      console.error('GIF export failed:', err);
    } finally {
      setExporting(null);
    }
  }, [templateId, caption, style]);

  const handleCopyShareLink = useCallback(() => {
    const url = `${window.location.origin}/meme/${memeId}`;
    navigator.clipboard.writeText(url).catch(console.error);
  }, [memeId]);

  const buttons = [
    { id: 'svg', label: 'SVG', icon: '🎨', onClick: handleExportSvg },
    { id: 'png', label: 'PNG', icon: '🖼️', onClick: handleExportPng },
    { id: 'gif', label: 'GIF', icon: '🎞️', onClick: handleExportGif },
    { id: 'share', label: 'Copy Link', icon: '🔗', onClick: handleCopyShareLink },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <motion.button
          key={btn.id}
          onClick={btn.onClick}
          disabled={exporting === btn.id}
          className="neo-button text-xs px-4 py-2 flex items-center gap-1.5"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
        >
          <span>{btn.icon}</span>
          {exporting === btn.id ? '...' : btn.label}
        </motion.button>
      ))}
    </div>
  );
}

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
  const [exportError, setExportError] = useState<string | null>(null);

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
    setExportError(null);
    try {
      const res = await fetch('/api/meme/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, caption, style, format: 'png' }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setExportError(errData.error ?? `PNG export failed (${res.status})`);
        return;
      }

      const contentType = res.headers.get('Content-Type') ?? '';
      if (!contentType.includes('image/png')) {
        setExportError('PNG export unavailable. Try SVG format instead.');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rex-meme-${memeId}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PNG export failed:', err);
      setExportError('PNG export failed. Try SVG instead.');
    } finally {
      setExporting(null);
    }
  }, [templateId, caption, style, memeId]);

  const handleExportGif = useCallback(async () => {
    setExporting('gif');
    setExportError(null);
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
    // Encode meme params in the URL so shared links can reconstruct the meme
    const url = new URL(`${window.location.origin}/meme/${memeId}`);
    url.searchParams.set('templateId', templateId);
    url.searchParams.set('caption', caption);
    url.searchParams.set('style', style);
    navigator.clipboard.writeText(url.toString()).catch(console.error);
  }, [memeId, templateId, caption, style]);

  const buttons = [
    { id: 'svg', label: 'SVG', icon: '🎨', onClick: handleExportSvg },
    { id: 'png', label: 'PNG', icon: '🖼️', onClick: handleExportPng },
    { id: 'gif', label: 'GIF', icon: '🎞️', onClick: handleExportGif },
    { id: 'share', label: 'Copy Link', icon: '🔗', onClick: handleCopyShareLink },
  ];

  return (
    <div className="space-y-2">
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
      {exportError && (
        <p className="text-xs font-mono text-red-400/80">{exportError}</p>
      )}
    </div>
  );
}

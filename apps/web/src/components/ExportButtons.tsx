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
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [metadataJson, setMetadataJson] = useState<string | null>(null);

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
      if (!res.ok) {
        setExportError(data?.error ?? 'GIF export failed. Please try again.');
        return;
      }
      if (data.stub) {
        setExportError('GIF export is coming soon! 🎬');
      }
    } catch (err) {
      console.error('GIF export failed:', err);
      setExportError('GIF export failed. Please try again.');
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

  const handlePingPlatforms = useCallback(async () => {
    setExporting('ping');
    setExportError(null);
    setPingResult(null);
    try {
      const res = await fetch('/api/marketing/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memeId, templateId, style }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        delivered?: number;
        total?: number;
        error?: string;
      };
      if (!res.ok || !data.success) {
        setExportError(data.error ?? 'Platform ping failed.');
        return;
      }
      setPingResult(`Pinged ${data.delivered ?? 0}/${data.total ?? 0} NFT platforms`);
    } catch (err) {
      console.error('Platform ping failed:', err);
      setExportError('Platform ping failed. Please try again.');
    } finally {
      setExporting(null);
    }
  }, [memeId, templateId, style]);

  const handleGenerateMetadata = useCallback(async () => {
    setExporting('metadata');
    setExportError(null);
    try {
      const res = await fetch('/api/nft/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memeId, templateId, caption, style }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setExportError(data.error ?? 'Metadata generation failed.');
        return;
      }
      setMetadataJson(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Metadata generation failed:', err);
      setExportError('Metadata generation failed. Please try again.');
    } finally {
      setExporting(null);
    }
  }, [memeId, templateId, caption, style]);

  const handleCopyMetadata = useCallback(() => {
    if (!metadataJson) return;
    navigator.clipboard.writeText(metadataJson).catch(console.error);
  }, [metadataJson]);

  const buttons = [
    { id: 'svg', label: 'SVG', icon: '🎨', onClick: handleExportSvg },
    { id: 'png', label: 'PNG', icon: '🖼️', onClick: handleExportPng },
    { id: 'gif', label: 'GIF', icon: '🎞️', onClick: handleExportGif },
    { id: 'metadata', label: 'NFT Metadata', icon: '🧬', onClick: handleGenerateMetadata },
    { id: 'share', label: 'Copy Link', icon: '🔗', onClick: handleCopyShareLink },
    { id: 'ping', label: 'Ping Platforms', icon: '📣', onClick: handlePingPlatforms },
    {
      id: 'copy-metadata',
      label: 'Copy Metadata',
      icon: '📋',
      onClick: handleCopyMetadata,
      requiresMetadata: true,
    },
  ];

  const isButtonDisabled = (buttonId: string): boolean =>
    exporting === buttonId ||
    (!!buttons.find((button) => button.id === buttonId)?.requiresMetadata && !metadataJson);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={btn.onClick}
            disabled={isButtonDisabled(btn.id)}
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
      {pingResult && <p className="text-xs font-mono text-neoLime/80">{pingResult}</p>}
      {metadataJson && (
        <p className="text-xs font-mono text-neoCyan/60">
          Unique metadata generated for on-chain minting.
        </p>
      )}
    </div>
  );
}

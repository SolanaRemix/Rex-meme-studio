import { createHash, randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const VALID_STYLES = new Set(['neoGlow', 'flash', 'glitch']);
const GENERATED_MEME_ID_LENGTH = 12;

function cleanText(input: string, max = 120): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      memeId?: string;
      templateId?: string;
      caption?: string;
      style?: string;
      creator?: string;
    };
    const creator = cleanText(body.creator ?? 'unknown', 64);
    const memeId = cleanText(
      body.memeId ?? randomUUID().replace(/-/g, '').slice(0, GENERATED_MEME_ID_LENGTH),
      64
    );
    const templateId = cleanText(body.templateId ?? '', 32).toLowerCase();
    const caption = cleanText(body.caption ?? '', 240);
    const style = cleanText(body.style ?? 'neoGlow', 16);

    if (!/^[a-zA-Z0-9]{6,64}$/.test(memeId)) {
      return NextResponse.json({ error: 'Invalid memeId' }, { status: 400 });
    }
    if (!/^[a-z0-9_-]{2,32}$/.test(templateId)) {
      return NextResponse.json({ error: 'Invalid templateId' }, { status: 400 });
    }
    if (!caption) {
      return NextResponse.json({ error: 'caption is required' }, { status: 400 });
    }
    if (!VALID_STYLES.has(style)) {
      return NextResponse.json({ error: 'Invalid style' }, { status: 400 });
    }

    // Nonce guarantees uniqueness even when payload fields are identical.
    // We return it so clients can reproduce/audit metadataId derivation.
    const nonce = randomUUID();
    const metadataId = createHash('sha256')
      .update(`${memeId}:${templateId}:${caption}:${style}:${nonce}`)
      .digest('hex');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
    const memeUrl = `${baseUrl}/meme/${encodeURIComponent(memeId)}?templateId=${encodeURIComponent(templateId)}&caption=${encodeURIComponent(caption)}&style=${encodeURIComponent(style)}`;

    return NextResponse.json({
      schema: 'rex-meme-studio-nft-metadata-v1',
      metadataId,
      // Compact deterministic identifier used by UI/indexing flows.
      // Keep 128 bits (32 hex chars) from the 256-bit metadataId hash.
      // This preserves strong uniqueness while staying shorter for UIs.
      tokenId: metadataId.slice(0, 32),
      name: `Rex Meme #${memeId}`,
      description: caption,
      image: `${baseUrl}/api/meme/render?id=${encodeURIComponent(memeId)}&templateId=${encodeURIComponent(templateId)}&caption=${encodeURIComponent(caption)}&style=${encodeURIComponent(style)}&format=png`,
      external_url: memeUrl,
      attributes: [
        { trait_type: 'Template', value: templateId.toUpperCase() },
        { trait_type: 'Style', value: style },
        { trait_type: 'Creator', value: creator },
        { trait_type: 'Engine', value: 'Rex Meme Studio AI' },
      ],
      integrations: {
        farcaster: `${baseUrl}/api/frame/meme/${encodeURIComponent(memeId)}`,
        blinks: `${baseUrl}/api/blink/meme/${encodeURIComponent(memeId)}`,
        x: `https://x.com/intent/tweet?text=${encodeURIComponent(`Rex Meme #${memeId}`)}&url=${encodeURIComponent(memeUrl)}`,
        zora: `https://zora.co/create`,
        lens: `https://lens.xyz`,
      },
      onchain: {
        // `target` describes the intended minting path for downstream integrators.
        // It is metadata only and does not execute minting in this endpoint.
        solana: { target: 'compressed-nft-or-metaplex', metadataHash: metadataId },
        base: { target: 'erc721-or-erc1155', metadataHash: metadataId },
      },
      generatedAt: new Date().toISOString(),
      nonce,
    });
  } catch (err) {
    console.error('[api/nft/metadata]', err);
    return NextResponse.json({ error: 'Failed to generate NFT metadata' }, { status: 500 });
  }
}

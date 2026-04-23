# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-23

### Added
- NeoGlow design-system component suite (`NeoButton`, `NeoCard`, `NeoToggle`, `NeoBadge`) with component barrel exports.
- Complete meme template registry for BONK, WIF, MEW, JUP, and PENGU with style-hint metadata.
- Demo reward claim services for Solana and Base (`claimSolanaReward`, `claimBaseReward`) with typed request/result contracts.
- Wallet provider barrel export and required app-router API entrypoints for AI, meme rendering, NFT metadata, Blinks, Frames, and marketing fan-out.
- Query-driven `/meme` gallery route with preview + share actions for Farcaster, Zora, Lens, Blinks, and X.
- Vitest unit tests for meme rendering, caption generation, and reward demo-mode flows.

### Changed
- Root test orchestration now runs workspace tests via Turborepo.
- NFT metadata endpoint supports optional creator metadata and auto-generated meme IDs when absent.
- Marketing ping endpoint now supports explicit platform queues while preserving existing response compatibility.

'use client';

import styled from 'styled-components';

// ───────────────────────────────────────────────
// Sidebar Wrapper (the sliding panel itself)
// ───────────────────────────────────────────────
export const SidebarWrapper = styled.div`
  background-color: var(--background);
  transition: transform 0.25s ease;
  height: 100%;
  position: fixed;
  transform: translateX(-100%);
  width: 16rem;               /* ≈ 256px – adjust to your design */
  flex-shrink: 0;
  z-index: 202;
  overflow-y: auto;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding-top: var(--space-10);
  padding-left: var(--space-6);
  padding-bottom: var(--space-10);
  padding-right: var(--space-6);

  /* Hide scrollbar in WebKit browsers */
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    /* Desktop: sidebar becomes static / always visible */
    margin-left: 0;
    display: flex;
    position: static;
    transform: translateX(0);
    height: 100vh;
  }
`;

// ───────────────────────────────────────────────
// Overlay (appears behind sidebar on mobile when open)
// ───────────────────────────────────────────────
export const Overlay = styled.div`
  background-color: rgba(15, 23, 42, 0.3); /* slate-950/30 or similar */
  position: fixed;
  inset: 0;
  z-index: 201;
  transition: opacity 0.35s ease;
  opacity: 0;
  pointer-events: none;

  @media (min-width: 768px) {
    display: none;
    z-index: auto;
    opacity: 1;
  }
`;

// ───────────────────────────────────────────────
// Header (usually contains logo + close button)
// ───────────────────────────────────────────────
export const Header = styled.div`
  display: flex;
  gap: var(--space-8);
  align-items: center;
  padding-left: var(--space-10);
`;

// ───────────────────────────────────────────────
// Body (main content area – nav links, etc.)
// ───────────────────────────────────────────────
export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  margin-top: var(--space-13);
  padding-left: var(--space-4);
  padding-right: var(--space-4);
`;

// ───────────────────────────────────────────────
// Footer (bottom section – user info, logout, theme switch…)
// ───────────────────────────────────────────────
export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  padding-top: var(--space-18);
  padding-bottom: var(--space-8);
  padding-left: var(--space-8);
  padding-right: var(--space-8);

  @media (min-width: 768px) {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

// ───────────────────────────────────────────────
// Collapsed variant styles (optional – if you support collapsed sidebar on desktop)
// ───────────────────────────────────────────────
export const Sidebar = {
  Wrapper: SidebarWrapper,
  Header,
  Body,
  Footer,
  Overlay,

  // Optional – collapsed modifier (desktop only usually)
  Collapsed: styled(SidebarWrapper)`
    width: 4.5rem;           /* or whatever your collapsed width is */
    padding-left: var(--space-3);
    padding-right: var(--space-3);

    ${Header}, ${Footer} {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
    }

    ${Body} {
      align-items: center;
      padding-left: 0;
      padding-right: 0;
    }

    @media (max-width: 767px) {
      /* Mobile never uses collapsed mode */
      width: 16rem !important;
      transform: translateX(-100%) !important;
    }
  `,
} as const;

// If you prefer a single default export (common pattern):
export default Sidebar;
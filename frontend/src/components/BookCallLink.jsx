import React from 'react';

function isExternalUrl(url) {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

function isHashLink(url) {
  return url?.trim().startsWith('#');
}

export default function BookCallLink({ settings, className, children, onNavigate }) {
  const url = settings?.bookCallUrl?.trim() || '#contact';
  const label = children || settings?.bookCallLabel || 'Book a Free Call';

  if (isExternalUrl(url)) {
    return (
      <a href={url} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  const hash = isHashLink(url) ? url.replace('#', '') : 'contact';

  return (
    <a
      href={`#${hash}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.(hash);
      }}
    >
      {label}
    </a>
  );
}

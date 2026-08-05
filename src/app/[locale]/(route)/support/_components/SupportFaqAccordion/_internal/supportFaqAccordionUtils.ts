export const getFaqAnchorId = (id: number) => `faq-${id}`;

export const getExpandedIdFromHash = (): number | null => {
  const match = window.location.hash.match(/^#faq-(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
};

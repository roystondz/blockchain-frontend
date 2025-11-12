export const getIPFSUrl = (hash) => {
  if (!hash) return null;
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

export const openIPFSInNewTab = (hash) => {
  const url = getIPFSUrl(hash);
  if (url) {
    window.open(url, '_blank');
  }
};

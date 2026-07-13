const arrAvatarPalette = [
  { bg: '#4F46E5', text: '#FFFFFF' },
  { bg: '#059669', text: '#FFFFFF' },
  { bg: '#D97706', text: '#FFFFFF' },
  { bg: '#0284C7', text: '#FFFFFF' },
  { bg: '#DB2777', text: '#FFFFFF' },
  { bg: '#7C3AED', text: '#FFFFFF' },
  { bg: '#DC2626', text: '#FFFFFF' },
  { bg: '#0D9488', text: '#FFFFFF' },
  { bg: '#CA8A04', text: '#FFFFFF' },
  { bg: '#2563EB', text: '#FFFFFF' },
  { bg: '#9333EA', text: '#FFFFFF' },
  { bg: '#EA580C', text: '#FFFFFF' },
];

const hashString = (strValue: string): number => {
  let intHash = 0;
  for (let intIndex = 0; intIndex < strValue.length; intIndex++) {
    intHash = strValue.charCodeAt(intIndex) + ((intHash << 5) - intHash);
  }
  return Math.abs(intHash);
};

export const getInitials = (strName: string): string => {
  const arrParts = strName.trim().split(/\s+/).filter(Boolean);
  if (arrParts.length === 0) return '?';
  if (arrParts.length === 1) return arrParts[0].slice(0, 2).toUpperCase();
  return (arrParts[0][0] + arrParts[arrParts.length - 1][0]).toUpperCase();
};

export const getAvatarColors = (strName: string): { bg: string; text: string } => {
  const strNormalized = strName.trim().toLowerCase() || 'unknown';
  const intIndex = hashString(strNormalized) % arrAvatarPalette.length;
  return arrAvatarPalette[intIndex];
};

export const formatDisplayName = (strName: string): string => {
  return strName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((strPart) => strPart.charAt(0).toUpperCase() + strPart.slice(1).toLowerCase())
    .join(' ');
};

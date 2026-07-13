import { ListingMediaItem, ListingMediaType } from '@/types/listing.types';

const arrVideoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.m4v', '.avi'];

export const detectMediaType = (strUrl: string): ListingMediaType => {
  const strLower = strUrl.trim().toLowerCase();

  if (strLower.startsWith('data:video/')) return 'video';
  if (strLower.startsWith('data:image/')) return 'image';

  const boolIsVideo = arrVideoExtensions.some((strExt) => strLower.includes(strExt));
  return boolIsVideo ? 'video' : 'image';
};

export const parseMediaUrls = (arrUrls: string[]): ListingMediaItem[] => {
  return arrUrls
    .filter((strUrl) => typeof strUrl === 'string' && strUrl.trim().length > 0)
    .map((strUrl) => ({
      url: strUrl,
      type: detectMediaType(strUrl),
    }));
};

export const getListingMedia = (
  arrMedia: ListingMediaItem[] | undefined,
  strFallbackUrl?: string,
): ListingMediaItem[] => {
  if (arrMedia && arrMedia.length > 0) return arrMedia;

  if (strFallbackUrl?.trim()) {
    return [{ url: strFallbackUrl, type: detectMediaType(strFallbackUrl) }];
  }

  return [];
};

export const hasListingMedia = (
  arrMedia: ListingMediaItem[] | undefined,
  strFallbackUrl?: string,
): boolean => getListingMedia(arrMedia, strFallbackUrl).length > 0;

'use client';

import Link from 'next/link';
import { DEFAULT_LISTING_ROUTE } from '@/constants/listing-routes';
import { useI18n } from '@/hooks/useI18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--feed-bg)] px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-800">{t('notFound.title')}</h1>
      <p className="max-w-sm text-sm text-slate-500">
        {t('notFound.hint')}
      </p>
      <Link
        href={DEFAULT_LISTING_ROUTE.path}
        className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        {t('notFound.goRooms')}
      </Link>
    </div>
  );
}

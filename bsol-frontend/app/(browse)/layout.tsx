import AppShell from '@/components/layout/AppShell';

export default function BrowseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}

import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
    'My Favorites | GOGO XGEORGIA',
    'Your curated list of verified escorts and companions in Georgia on GOGOXGEORGIA.GE. Save profiles to view later.',
    '/favorites',
    undefined,
    true // noIndex: true because content is client-side local storage based
);

export default function FavoritesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

export const metadata = {
  title: 'My Agent Follow',
  description: '役所調査支援システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

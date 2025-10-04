import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Agent Follow - 役所調査支援システム',
  description: '不動産調査チェックリスト自動生成システム',
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

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>My Agent Follow - 役所調査支援システム</h1>
      <p>不動産調査の効率化・標準化を支援するシステムです。</p>
      
      <h2>CSV エクスポート</h2>
      <div style={{ marginTop: '1rem' }}>
        <h3>Artifacts (資料)</h3>
        <ul>
          <li><a href="/api/export/csv?type=artifacts&encoding=utf8" download>UTF-8でダウンロード</a></li>
          <li><a href="/api/export/csv?type=artifacts&encoding=sjis" download>Shift_JISでダウンロード</a></li>
        </ul>
        
        <h3>Reports (報告)</h3>
        <ul>
          <li><a href="/api/export/csv?type=reports&encoding=utf8" download>UTF-8でダウンロード</a></li>
          <li><a href="/api/export/csv?type=reports&encoding=sjis" download>Shift_JISでダウンロード</a></li>
        </ul>
        
        <h3>Tasks (タスク)</h3>
        <ul>
          <li><a href="/api/export/csv?type=tasks&encoding=utf8" download>UTF-8でダウンロード</a></li>
          <li><a href="/api/export/csv?type=tasks&encoding=sjis" download>Shift_JISでダウンロード</a></li>
        </ul>
      </div>
      
      <h2>ドキュメント</h2>
      <ul>
        <li><a href="https://github.com/koki-187/My-Agent-Follow/blob/main/docs/notion.md" target="_blank">Notion連携ガイド</a></li>
      </ul>
    </main>
  )
}

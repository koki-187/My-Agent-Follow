import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">My Agent Follow</h1>
        <p className="text-xl text-gray-600 mb-8">役所調査支援システム</p>
        
        <div className="space-y-4">
          <p className="text-gray-600">チェックリストを表示するには物件IDが必要です</p>
          <Link 
            href="/dashboard/checklist?propertyId=test-property-1"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            テスト物件のチェックリストを表示
          </Link>
        </div>
      </div>
    </main>
  );
}

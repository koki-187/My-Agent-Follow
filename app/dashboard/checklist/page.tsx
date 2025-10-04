'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ChecklistItem {
  id: string;
  category: string;
  itemKey: string;
  itemLabel: string;
  description: string | null;
  lawReference: string | null;
  method: string | null;
  relatedCert: string | null;
  reportSection: string | null;
  isRequired: boolean;
  isDone: boolean;
}

interface GroupedItems {
  [category: string]: ChecklistItem[];
}

export default function ChecklistPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setError('Property ID is required');
      setLoading(false);
      return;
    }

    const fetchChecklist = async () => {
      try {
        const startTime = performance.now();
        
        const response = await fetch('/api/checklist/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId,
            profile: {}, // Can be passed from URL params if needed
          }),
        });

        const endTime = performance.now();
        console.log(`API response time: ${endTime - startTime}ms`);

        if (!response.ok) {
          throw new Error('Failed to fetch checklist');
        }

        const data = await response.json();
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [propertyId]);

  const toggleDone = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isDone: !item.isDone } : item
      )
    );
  };

  const groupedItems = items.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const getMethodBadgeColor = (method: string | null) => {
    switch (method) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'counter':
        return 'bg-green-100 text-green-800';
      case 'mail':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodLabel = (method: string | null) => {
    switch (method) {
      case 'online':
        return 'オンライン';
      case 'counter':
        return '窓口';
      case 'mail':
        return '郵送';
      default:
        return method || '未設定';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">エラー: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">調査チェックリスト</h1>
        
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{category}</h2>
            
            <div className="space-y-3">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow p-4 transition-all ${
                    item.isDone ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium">{item.itemLabel}</h3>
                        
                        {item.isRequired && (
                          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                            必須
                          </span>
                        )}
                        
                        {item.method && (
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getMethodBadgeColor(item.method)}`}>
                            {getMethodLabel(item.method)}
                          </span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      
                      <div className="flex gap-4 text-sm text-gray-500">
                        {item.lawReference && (
                          <span>📋 {item.lawReference}</span>
                        )}
                        {item.relatedCert && (
                          <span>📄 {item.relatedCert}</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleDone(item.id)}
                      className={`ml-4 px-4 py-2 rounded font-medium transition-colors ${
                        item.isDone
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {item.isDone ? '完了' : '未完了'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            該当する調査項目がありません
          </div>
        )}
      </div>
    </div>
  );
}

// app/ranking/layout.tsx
import { ReactNode } from 'react';

export default function RankingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {children}
    </div>
  );
}

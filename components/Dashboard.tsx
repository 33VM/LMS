import React from 'react';
import { Book, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Book as BookType, Transaction } from '../types';

interface DashboardProps {
  books: BookType[];
  transactions: Transaction[];
  studentsCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ books, transactions, studentsCount }) => {
  const totalBooks = books.length;
  const issuedBooks = books.filter(b => b.status === 'ISSUED').length;
  const availableBooks = books.filter(b => b.status === 'AVAILABLE').length;
  const overdueCount = transactions.filter(t => t.status === 'OVERDUE').length;

  const categoryData = React.useMemo(() => {
    const categories: Record<string, number> = {};
    books.forEach(book => {
      categories[book.category] = (categories[book.category] || 0) + 1;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      count: categories[cat]
    })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [books]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Library Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Books" 
          value={totalBooks} 
          icon={Book} 
          color="text-indigo-600" 
          bg="bg-indigo-50" 
        />
        <StatCard 
          title="Books Issued" 
          value={issuedBooks} 
          icon={CheckCircle} 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
        />
        <StatCard 
          title="Active Students" 
          value={studentsCount} 
          icon={Users} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Overdue Returns" 
          value={overdueCount} 
          icon={AlertCircle} 
          color="text-rose-600" 
          bg="bg-rose-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Books by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-slate-500 italic">No recent transactions.</p>
                ) : (
                    transactions.slice(0, 5).map(t => (
                        <div key={t.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                            <div className={`w-2 h-2 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-500' : t.status === 'OVERDUE' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                    {t.status === 'RETURNED' ? 'Returned' : 'Issued'}: Book ID #{t.bookId.slice(0,4)}
                                </p>
                                <p className="text-xs text-slate-500">{new Date(t.issueDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium
                                ${t.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                                  t.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' : 
                                  'bg-slate-100 text-slate-700'}`}>
                                {t.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

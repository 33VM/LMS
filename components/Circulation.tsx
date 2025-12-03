import React, { useState } from 'react';
import { Book, Student, Transaction } from '../types';
import { ArrowRightLeft, Check, AlertCircle } from 'lucide-react';

interface CirculationProps {
  books: Book[];
  students: Student[];
  transactions: Transaction[];
  onIssueBook: (bookId: string, studentId: string) => void;
  onReturnBook: (transactionId: string) => void;
}

export const Circulation: React.FC<CirculationProps> = ({ 
  books, students, transactions, onIssueBook, onReturnBook 
}) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const availableBooks = books.filter(b => b.status === 'AVAILABLE');
  const activeTransactions = transactions.filter(t => t.status !== 'RETURNED');

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedStudentId) {
        setMessage({type: 'error', text: 'Please select both a book and a student.'});
        return;
    }
    onIssueBook(selectedBookId, selectedStudentId);
    setMessage({type: 'success', text: 'Book issued successfully!'});
    setSelectedBookId('');
    setSelectedStudentId('');
    setTimeout(() => setMessage(null), 3000);
  };

  const getBookTitle = (id: string) => books.find(b => b.id === id)?.title || 'Unknown Book';
  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Unknown Student';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Circulation Desk</h2>
            <p className="text-slate-500 text-sm">Issue and Return management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Book Section */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ArrowRightLeft size={20} className="text-indigo-600"/>
                    Issue a Book
                </h3>
                
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                         {message.type === 'success' ? <Check size={16}/> : <AlertCircle size={16}/>}
                         {message.text}
                    </div>
                )}

                <form onSubmit={handleIssue} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Book</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500 bg-white"
                            value={selectedBookId}
                            onChange={(e) => setSelectedBookId(e.target.value)}
                        >
                            <option value="">-- Choose Available Book --</option>
                            {availableBooks.map(b => (
                                <option key={b.id} value={b.id}>{b.title} (ISBN: {b.isbn})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500 bg-white"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="">-- Choose Student --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        type="submit"
                        disabled={!selectedBookId || !selectedStudentId}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors font-medium mt-2"
                    >
                        Issue Book
                    </button>
                </form>
            </div>
        </div>

        {/* Active Issues List */}
        <div className="lg:col-span-2">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Active Issues</h3>
                </div>
                <div className="overflow-auto flex-1 p-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 sticky top-0">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Book</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeTransactions.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">{getBookTitle(t.bookId)}</td>
                                    <td className="p-4 text-slate-600">{getStudentName(t.studentId)}</td>
                                    <td className="p-4">
                                        <span className={`text-sm ${t.status === 'OVERDUE' ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                                            {new Date(t.dueDate).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => onReturnBook(t.id)}
                                            className="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1 rounded shadow-sm transition-colors"
                                        >
                                            Return
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {activeTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                                        No active book issues at the moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

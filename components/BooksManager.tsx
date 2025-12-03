import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, BookOpen } from 'lucide-react';
import { Book } from '../types';

interface BooksManagerProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id' | 'status' | 'addedDate'>) => void;
  onDeleteBook: (id: string) => void;
}

export const BooksManager: React.FC<BooksManagerProps> = ({ books, onAddBook, onDeleteBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Book State
  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', category: 'Fiction', description: ''
  });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBook(newBook);
    setIsModalOpen(false);
    setNewBook({ title: '', author: '', isbn: '', category: 'Fiction', description: '' });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Book Catalog</h2>
            <p className="text-slate-500 text-sm">Manage the library inventory</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by title, author, or ISBN..." 
          className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Book Details</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Category</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">ISBN</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 group">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-12 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-slate-900">{book.title}</div>
                            <div className="text-xs text-slate-500">{book.author}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {book.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-mono">{book.isbn}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${book.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 
                        book.status === 'ISSUED' ? 'bg-amber-100 text-amber-700' : 
                        'bg-rose-100 text-rose-700'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDeleteBook(book.id)}
                      className="p-2 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Book"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                        No books found. Try adding one!
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Add New Book</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                  value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                    value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                  <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                    value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                    value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})}>
                    <option>Fiction</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Technology</option>
                    <option>Arts</option>
                    <option>Biography</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BooksManager } from './components/BooksManager';
import { StudentManager } from './components/StudentManager';
import { Circulation } from './components/Circulation';
import { AILibrarian } from './components/AILibrarian';
import { Book, Student, Transaction, ViewState } from './types';

// Mock Initial Data
const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', status: 'AVAILABLE', addedDate: '2023-01-15' },
  { id: '2', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', category: 'Science', status: 'AVAILABLE', addedDate: '2023-02-10' },
  { id: '3', title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Technology', status: 'ISSUED', addedDate: '2023-03-01' },
  { id: '4', title: '1984', author: 'George Orwell', isbn: '9780451524935', category: 'Fiction', status: 'ISSUED', addedDate: '2023-01-20' },
  { id: '5', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', category: 'History', status: 'AVAILABLE', addedDate: '2023-04-05' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', grade: '10th', email: 'alice@school.edu' },
  { id: 's2', name: 'Bob Smith', grade: '11th', email: 'bob@school.edu' },
  { id: 's3', name: 'Charlie Brown', grade: '9th', email: 'charlie@school.edu' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', bookId: '3', studentId: 's1', issueDate: '2023-10-01', dueDate: '2023-10-15', status: 'ACTIVE' },
  { id: 't2', bookId: '4', studentId: 's2', issueDate: '2023-09-01', dueDate: '2023-09-15', status: 'OVERDUE' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  
  // State with LocalStorage Initialization
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('athena_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('athena_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('athena_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('athena_books', JSON.stringify(books)), [books]);
  useEffect(() => localStorage.setItem('athena_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('athena_transactions', JSON.stringify(transactions)), [transactions]);

  // Handlers
  const handleAddBook = (bookData: Omit<Book, 'id' | 'status' | 'addedDate'>) => {
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'AVAILABLE',
      addedDate: new Date().toISOString()
    };
    setBooks([...books, newBook]);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setStudents([...students, newStudent]);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleIssueBook = (bookId: string, studentId: string) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      studentId,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days due
      status: 'ACTIVE'
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update Book Status
    setBooks(books.map(b => b.id === bookId ? { ...b, status: 'ISSUED' } : b));
  };

  const handleReturnBook = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'RETURNED', returnDate: new Date().toISOString() } : t
    ));

    // Update Book Status
    setBooks(books.map(b => b.id === transaction.bookId ? { ...b, status: 'AVAILABLE' } : b));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
            <h2 className="text-xl font-semibold text-slate-800 capitalize">
                {view.replace('_', ' ').toLowerCase()}
            </h2>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">Librarian Admin</p>
                    <p className="text-xs text-slate-500">admin@library.edu</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
                    LA
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto h-full">
                {view === 'DASHBOARD' && (
                    <Dashboard books={books} transactions={transactions} studentsCount={students.length} />
                )}
                {view === 'BOOKS' && (
                    <BooksManager books={books} onAddBook={handleAddBook} onDeleteBook={handleDeleteBook} />
                )}
                {view === 'STUDENTS' && (
                    <StudentManager students={students} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent} />
                )}
                {view === 'CIRCULATION' && (
                    <Circulation 
                        books={books} 
                        students={students} 
                        transactions={transactions} 
                        onIssueBook={handleIssueBook} 
                        onReturnBook={handleReturnBook} 
                    />
                )}
                {view === 'AI_LIBRARIAN' && (
                    <AILibrarian books={books} students={students} transactions={transactions} />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
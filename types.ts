export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'AVAILABLE' | 'ISSUED' | 'LOST';
  addedDate: string;
  description?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  email: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export type ViewState = 'DASHBOARD' | 'BOOKS' | 'STUDENTS' | 'CIRCULATION' | 'AI_LIBRARIAN';

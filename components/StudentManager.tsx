import React, { useState } from 'react';
import { Search, Plus, Trash2, User } from 'lucide-react';
import { Student } from '../types';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({ students, onAddStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '', email: '' });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(newStudent);
    setIsModalOpen(false);
    setNewStudent({ name: '', grade: '', email: '' });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
            <p className="text-slate-500 text-sm">Manage library members</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Register Student</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search students..." 
          className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Name</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Grade/Class</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Email</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <span className="font-medium text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{student.grade}</td>
                  <td className="p-4 text-slate-600">{student.email}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDeleteStudent(student.id)}
                      className="p-2 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
               {filteredStudents.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                        No students found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">New Student Registration</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                  value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade / Class</label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                  value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-indigo-500"
                  value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

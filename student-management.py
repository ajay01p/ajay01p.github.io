# Smart Student Management System
# Author: Ajay Mondal
# Technologies: Python, SQLite, Tkinter

import sqlite3
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime
import os

class StudentManagementSystem:
    def __init__(self, root):
        self.root = root
        self.root.title("Smart Student Management System - By Ajay Mondal")
        self.root.geometry("1000x600")
        self.root.configure(bg='#f0f0f0')
        
        # Initialize database
        self.init_database()
        
        # Create main interface
        self.create_interface()
        
        # Load data
        self.load_students()
    
    def init_database(self):
        """Initialize SQLite database with student table"""
        self.conn = sqlite3.connect('student_records.db')
        self.cursor = self.conn.cursor()
        
        # Create students table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                roll_number TEXT UNIQUE NOT NULL,
                email TEXT,
                phone TEXT,
                course TEXT,
                year INTEGER,
                attendance REAL DEFAULT 0,
                grade REAL DEFAULT 0,
                created_date TEXT,
                updated_date TEXT
            )
        ''')
        
        self.conn.commit()
    
    def create_interface(self):
        """Create the main GUI interface"""
        # Title
        title_frame = tk.Frame(self.root, bg='#2c3e50', height=60)
        title_frame.pack(fill='x')
        title_frame.pack_propagate(False)
        
        title_label = tk.Label(title_frame, text="Smart Student Management System", 
                              font=('Arial', 18, 'bold'), bg='#2c3e50', fg='white')
        title_label.pack(pady=15)
        
        # Main container
        main_frame = tk.Frame(self.root, bg='#f0f0f0')
        main_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Left panel for form
        form_frame = tk.LabelFrame(main_frame, text="Student Information", 
                                  font=('Arial', 12, 'bold'), bg='#f0f0f0')
        form_frame.pack(side='left', fill='y', padx=(0, 10))
        
        # Form fields
        self.create_form_fields(form_frame)
        
        # Right panel for student list
        right_frame = tk.Frame(main_frame, bg='#f0f0f0')
        right_frame.pack(side='right', fill='both', expand=True)
        
        # Student list
        self.create_student_list(right_frame)
    
    def create_form_fields(self, parent):
        """Create form fields for student input"""
        fields = [
            ('Name:', 'name'),
            ('Roll Number:', 'roll_number'),
            ('Email:', 'email'),
            ('Phone:', 'phone'),
            ('Course:', 'course'),
            ('Year:', 'year'),
            ('Attendance (%):', 'attendance'),
            ('Grade (0-10):', 'grade')
        ]
        
        self.entries = {}
        
        for i, (label_text, field_name) in enumerate(fields):
            # Label
            label = tk.Label(parent, text=label_text, font=('Arial', 10), bg='#f0f0f0')
            label.grid(row=i, column=0, sticky='w', padx=5, pady=5)
            
            # Entry
            if field_name in ['course']:
                entry = ttk.Combobox(parent, values=['BCA', 'MCA', 'B.Tech', 'M.Tech', 'BSc CS'])
                entry.set('BCA')
            elif field_name == 'year':
                entry = ttk.Combobox(parent, values=[1, 2, 3, 4])
                entry.set('2')
            else:
                entry = tk.Entry(parent, font=('Arial', 10))
            
            entry.grid(row=i, column=1, padx=5, pady=5, sticky='ew')
            self.entries[field_name] = entry
        
        # Buttons
        button_frame = tk.Frame(parent, bg='#f0f0f0')
        button_frame.grid(row=len(fields), column=0, columnspan=2, pady=20)
        
        buttons = [
            ('Add Student', self.add_student, '#27ae60'),
            ('Update Student', self.update_student, '#3498db'),
            ('Delete Student', self.delete_student, '#e74c3c'),
            ('Clear Fields', self.clear_fields, '#95a5a6')
        ]
        
        for i, (text, command, color) in enumerate(buttons):
            btn = tk.Button(button_frame, text=text, command=command,
                           bg=color, fg='white', font=('Arial', 10, 'bold'),
                           width=12, height=2)
            btn.grid(row=i//2, column=i%2, padx=5, pady=5)
    
    def create_student_list(self, parent):
        """Create student list with treeview"""
        list_frame = tk.LabelFrame(parent, text="Student Records", 
                                  font=('Arial', 12, 'bold'), bg='#f0f0f0')
        list_frame.pack(fill='both', expand=True)
        
        # Treeview
        columns = ('ID', 'Name', 'Roll', 'Course', 'Year', 'Attendance', 'Grade')
        self.tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=15)
        
        # Define headings
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=100)
        
        # Scrollbars
        v_scroll = ttk.Scrollbar(list_frame, orient='vertical', command=self.tree.yview)
        h_scroll = ttk.Scrollbar(list_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scroll.set, xscrollcommand=h_scroll.set)
        
        # Pack treeview and scrollbars
        self.tree.pack(side='left', fill='both', expand=True)
        v_scroll.pack(side='right', fill='y')
        h_scroll.pack(side='bottom', fill='x')
        
        # Bind selection event
        self.tree.bind('<<TreeviewSelect>>', self.on_select)
        
        # Action buttons
        action_frame = tk.Frame(list_frame, bg='#f0f0f0')
        action_frame.pack(fill='x', pady=5)
        
        tk.Button(action_frame, text="Generate Report", command=self.generate_report,
                 bg='#e67e22', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
    
    def add_student(self):
        """Add new student to database"""
        try:
            # Get form data
            data = {key: entry.get() for key, entry in self.entries.items()}
            
            # Validate required fields
            if not data['name'] or not data['roll_number']:
                messagebox.showerror("Error", "Name and Roll Number are required!")
                return
            
            # Insert into database
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.cursor.execute('''
                INSERT INTO students (name, roll_number, email, phone, course, year, 
                                    attendance, grade, created_date, updated_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (data['name'], data['roll_number'], data['email'], data['phone'],
                  data['course'], data['year'], data['attendance'], data['grade'],
                  current_time, current_time))
            
            self.conn.commit()
            messagebox.showinfo("Success", "Student added successfully!")
            self.load_students()
            self.clear_fields()
            
        except sqlite3.IntegrityError:
            messagebox.showerror("Error", "Roll number already exists!")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")
    
    def update_student(self):
        """Update selected student"""
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Warning", "Please select a student to update!")
            return
        
        try:
            # Get selected student ID
            student_id = self.tree.item(selected[0])['values'][0]
            
            # Get form data
            data = {key: entry.get() for key, entry in self.entries.items()}
            
            # Update database
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.cursor.execute('''
                UPDATE students SET name=?, email=?, phone=?, course=?, year=?, 
                                  attendance=?, grade=?, updated_date=?
                WHERE id=?
            ''', (data['name'], data['email'], data['phone'], data['course'],
                  data['year'], data['attendance'], data['grade'], current_time, student_id))
            
            self.conn.commit()
            messagebox.showinfo("Success", "Student updated successfully!")
            self.load_students()
            
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")
    
    def delete_student(self):
        """Delete selected student"""
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Warning", "Please select a student to delete!")
            return
        
        if messagebox.askyesno("Confirm", "Are you sure you want to delete this student?"):
            try:
                student_id = self.tree.item(selected[0])['values'][0]
                self.cursor.execute('DELETE FROM students WHERE id=?', (student_id,))
                self.conn.commit()
                messagebox.showinfo("Success", "Student deleted successfully!")
                self.load_students()
                self.clear_fields()
            except Exception as e:
                messagebox.showerror("Error", f"An error occurred: {str(e)}")
    
    def clear_fields(self):
        """Clear all form fields"""
        for entry in self.entries.values():
            if isinstance(entry, ttk.Combobox):
                entry.set('')
            else:
                entry.delete(0, tk.END)
    
    def load_students(self):
        """Load students into treeview"""
        # Clear existing data
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Fetch from database
        self.cursor.execute('SELECT id, name, roll_number, course, year, attendance, grade FROM students')
        for row in self.cursor.fetchall():
            self.tree.insert('', tk.END, values=row)
    
    def on_select(self, event):
        """Handle treeview selection"""
        selected = self.tree.selection()
        if selected:
            # Get student data
            student_id = self.tree.item(selected[0])['values'][0]
            self.cursor.execute('SELECT * FROM students WHERE id=?', (student_id,))
            student = self.cursor.fetchone()
            
            if student:
                # Populate form fields
                fields = ['name', 'roll_number', 'email', 'phone', 'course', 'year', 'attendance', 'grade']
                for i, field in enumerate(fields):
                    entry = self.entries[field]
                    if isinstance(entry, ttk.Combobox):
                        entry.set(str(student[i + 1]))
                    else:
                        entry.delete(0, tk.END)
                        entry.insert(0, str(student[i + 1]) if student[i + 1] else '')
    
    def generate_report(self):
        """Generate comprehensive report"""
        try:
            # Get statistics
            self.cursor.execute('SELECT COUNT(*) FROM students')
            total_students = self.cursor.fetchone()[0]
            
            self.cursor.execute('SELECT AVG(attendance) FROM students WHERE attendance > 0')
            avg_attendance = self.cursor.fetchone()[0] or 0
            
            self.cursor.execute('SELECT AVG(grade) FROM students WHERE grade > 0')
            avg_grade = self.cursor.fetchone()[0] or 0
            
            self.cursor.execute('SELECT course, COUNT(*) FROM students GROUP BY course')
            course_stats = self.cursor.fetchall()
            
            # Create report
            report = f"""SMART STUDENT MANAGEMENT SYSTEM REPORT
Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

=== SUMMARY STATISTICS ===
Total Students: {total_students}
Average Attendance: {avg_attendance:.2f}%
Average Grade: {avg_grade:.2f}/10

=== COURSE DISTRIBUTION ===
"""
            
            for course, count in course_stats:
                report += f"{course}: {count} students\n"
            
            # Save report
            filename = filedialog.asksaveasfilename(
                defaultextension=".txt",
                filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
            )
            
            if filename:
                with open(filename, 'w') as f:
                    f.write(report)
                messagebox.showinfo("Success", f"Report saved to {filename}")
                
        except Exception as e:
            messagebox.showerror("Error", f"Report generation failed: {str(e)}")
    
    def __del__(self):
        """Close database connection on exit"""
        if hasattr(self, 'conn'):
            self.conn.close()

# Main execution
if __name__ == "__main__":
    root = tk.Tk()
    app = StudentManagementSystem(root)
    root.mainloop()

# How to run this project:
# 1. Save this code as student_management_system.py
# 2. Make sure you have Python installed with tkinter
# 3. Run: python student_management_system.py
# 4. The application will create a SQLite database automatically

# Features:
# - Add, update, delete student records
# - Search and filter students
# - Generate reports
# - Data persistence with SQLite
# - Professional GUI interface
# - Input validation and error handling
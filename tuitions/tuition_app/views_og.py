# tuition_app/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import StudentRegistration, Attendance
from django.shortcuts import get_object_or_404
from .forms import *
from datetime import datetime, timedelta, date
import calendar
from django.views.decorators.csrf import csrf_exempt
import json

from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO
import mimetypes


hsc_schools = set()


def display(request):
    students_db = StudentRegistration.objects.all()
    
    students = []
    
    for student in students_db:
        stud = {
            "name" : student.name,
            "phone" : student.phone,
            "father_name" : student.father_name,
            "father_phone" : student.father_phone,
            "father_occ" : student.father_occupation,
            "email" : student.email,
            "img" : student.img,
            "address" : student.address,
            "standard" : student.standard,
            "board" : student.board,
            "subject" : student.subject,
            "school" : student.school,
            "branch" : student.branch,
            "fees" : student.fees,
            "payment_mode" : student.payment_mode,
            "payment+proof" : student.payment_proof,
        }
        
        students.append(stud)
        
    return JsonResponse({
        "students" : students
    })
    
        
def registration_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            student = form.save(commit=False)
            school = request.POST.get('school')
            if school == 'Other':
                if hsc_school:
                    student.hsc_school = hsc_school
                    hsc_school.lower()
                    hsc_schools.add(hsc_school)
                    print(hsc_schools)
            student.save()
            form.save_m2m()  # Save MultiSelectField (subjects)
            
            
            
            
            context = {'student': student}
            html = render_to_string('tuition_app/receipt.html', context)
            
            # Create a PDF file from HTML
            pdf_file = BytesIO()
            pisa_status = pisa.CreatePDF(html, dest=pdf_file)
            
            if not pisa_status.err:
                pdf_file.seek(0)
                
                # Email the PDF
                email = EmailMessage(
                    'Your Receipt',
                    'Please find attached your receipt.',
                    'siddhiwadke.scoe.comp@gmail.com',   # sender
                    [student.email],       # recipient
                )
                email.attach('receipt.pdf', pdf_file.read(), 'application/pdf')
                file = student.payment_proof
                if file:
                    mime_type, _ = mimetypes.guess_type(file.name)
                    email.attach(file.name, file.read(), mime_type or 'application/octet-stream')
                email.send()
            
            return redirect('tuition_app:registration_success')
    else:
        form = RegistrationForm()
    
    return render(request, 'tuition_app/registration.html', {'form': form})

def success_view(request):
    return render(request, 'tuition_app/success.html')

@login_required
def filter_students(request):
    standard = request.GET.get('standard', '')
    board = request.GET.get('board', '')
    school = request.GET.get('school', '')
    branch = request.GET.get('branch', '')
    date = request.GET.get('date', '')
    search = request.GET.get('search')

    students = StudentRegistration.objects.all()

    if standard:
        students = students.filter(standard=standard)
    if board:
        students = students.filter(board=board)
    if school:
        students = students.filter(school=school)
    if branch:
        students = students.filter(branch=branch)
    # if date:
        
    if search:
        students = students.filter(name__icontains = search)

    total_students = students.count()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        students_list = list(students.values(
            'id',  # Added 'id' to use in the redirect URL
            'name', 'phone', 'address', 'branch', 'standard', 
            'board', 'subject', 'school','hsc_school', 'fees', 'payment_mode', 'payment_proof'
        ))
        for student in students_list:
            if student['payment_proof']:
                student['payment_proof'] = request.build_absolute_uri('/media/' + student['payment_proof'])
        return JsonResponse({'students': students_list})

    context = {
        'students': students,
        'total_students': total_students,
    }
    return render(request, 'tuition_app/filter_students.html', context)

@login_required
def student_detail(request, student_id):
    student = get_object_or_404(StudentRegistration, id=student_id)
    attendance_records = Attendance.objects.filter(student_id=student)

    # Prepare data for the heatmap
    attendance_data = []
    for record in attendance_records:
        if record.date:
            attendance_data.append({
                "date": f"{record.date.year}-{record.date.month}-{record.date.day}",  # format: 2025-4-26
                "value": 1 if record.status else 0
            })

    context = {
        'student': student,
        'attendance_data_json': json.dumps(attendance_data)
    }
    return render(request, 'tuition_app/student_detail.html', context)

@login_required
def delete_student(request, student_id):
    student = StudentRegistration.objects.get(id = student_id)
    student.delete()
    
    print(student_id)
    
    return redirect('/app/filter_students')

@login_required
def update_student(request, student_id):
    student = StudentRegistration.objects.get(id = student_id)
    
    if request.method == "POST":
        data = request.POST
    
        name = data.get('name')
        phone = data.get('phone')
        address = data.get('address')
        father_name = data.get('father_name')
        father_phone = data.get('father_phone')
        father_occupation = data.get('father_occupation')
        branch = data.get('branch')
        standard = data.get('standard')
        board = data.get('board')
        subject = data.get('subject')
        school = data.get('school')
        fees = data.get('fees')
        payment_mode = data.get('payment_mode')
        # payment_proof = request.FILES.get('payment_proof')
        # img = request.FILES.get('img')
        
        #check code for image and payment image 
    
        student.name = name
        student.phone = phone
        student.address = address
        student.father_name = father_name
        student.father_phone = father_phone
        student.father_occupation = father_occupation
        student.branch = branch
        student.standard = standard
        student.board = board
        student.subject = subject
        student.school = school
        student.fees = fees
        student.payment_mode = payment_mode
        
        # if payment_proof:
        #     student.payment_proof = payment_proof
            
        # if img:
        #     student.img = img
        
        student.save()
        
        url2 = "/app/student/" + str(student_id)
        
        return redirect(url2)
        
    
    context = {
        'student': student,
    }
    return render(request, 'tuition_app/student_detail.html', context)



# @csrf_exempt
# def update_attendance_status(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         student_id = data.get('student_id')
#         selected_date = data.get('date')
#         status = data.get('status')  # true or false

#         # Ensure date is in YYYY-MM-DD format
#         attendance_date = date.fromisoformat(selected_date)

#         # Get or create attendance record
#         attendance, created = Attendance.objects.get_or_create(
#             student_id_id=student_id,
#             date=attendance_date
#         )

#         attendance.status = status
#         attendance.save()

        
#     return render()


def update_attendance(request):
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        date_ = request.POST.get('date_')
        status = request.POST.get('status')  # Will be "true" or "false" as a string

        # Convert status to a Python boolean
        status = status.lower() == 'true'

        # Convert date string (e.g., "2025-04-27") to a date object
        try:
            date_obj = datetime.strptime(date_, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({'message': 'Invalid date format'}, status=400)

        # Fetch the student
        student = get_object_or_404(StudentRegistration, id=student_id)

        # Use the correct field name 'student_id' in get_or_create
        attendance, created = Attendance.objects.get_or_create(
            student_id=student,
            date=date_obj
        )

        # Update the status
        attendance.status = status
        attendance.save()

        return JsonResponse({'message': 'Attendance updated successfully'}, status=200)

    return JsonResponse({'message': 'Invalid request method'}, status=400)
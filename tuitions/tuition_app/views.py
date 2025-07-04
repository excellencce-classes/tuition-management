# tuition_app/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from .models import StudentRegistration, Attendance
from django.shortcuts import get_object_or_404
from .forms import *
from datetime import datetime, timedelta, date
import calendar
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Q

from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO
import mimetypes
from calendar import monthrange


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
    
        
# def registration_view(request):
#     if request.method == 'POST':
#         form = RegistrationForm(request.POST, request.FILES)
#         if form.is_valid():
#             student = form.save(commit=False)
#             student.save()
#             form.save_m2m()  # Save MultiSelectField (subjects)
            
            
            
            
#             context = {'student': student}
#             html = render_to_string('tuition_app/receipt.html', context)
            
#             # Create a PDF file from HTML
#             pdf_file = BytesIO()
#             pisa_status = pisa.CreatePDF(html, dest=pdf_file)
            
#             if not pisa_status.err:
#                 pdf_file.seek(0)
                
#                 # Email the PDF
#                 email = EmailMessage(
#                     'Your Receipt',
#                     'Please find attached your receipt.',
#                     'siddhiwadke.scoe.comp@gmail.com',   # sender
#                     [student.email],       # recipient
#                 )
#                 email.attach('receipt.pdf', pdf_file.read(), 'application/pdf')
#                 file = student.payment_proof
#                 if file:
#                     mime_type, _ = mimetypes.guess_type(file.name)
#                     email.attach(file.name, file.read(), mime_type or 'application/octet-stream')
#                 email.send()
            
#             return redirect('tuition_app:registration_success')
#     else:
#         form = RegistrationForm()
    
#     return render(request, 'tuition_app/registration.html', {'form': form})


def registration_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            student = form.save(commit=False)
            school_text = request.POST.get('school_text')
            if student.school == 'Other' and school_text:
                student.school_text = school_text.lower()
            elif student.school != 'Other':
                student.school_text = None  # Clear school_text if not 'Other'
            # Validate installment fields
            if student.installment_plan in ['yes', 'no']:
                if not student.amount1 or not student.payment_mode1:
                    form.add_error('amount1', 'Amount is required when installment plan is selected.')
                    form.add_error('payment_mode1', 'Payment mode is required when installment plan is selected.')
                    return render(request, 'tuition_app/registration.html', {'form': form})
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
                    'excellenceahmednagar@gmail.com',  # sender
                    [student.email],  # recipient
                )
                email.attach('receipt.pdf', pdf_file.read(), 'application/pdf')
                if student.payment_proof1:
                    mime_type, _ = mimetypes.guess_type(student.payment_proof1.name)
                    email.attach(student.payment_proof1.name, student.payment_proof1.read(), mime_type or 'application/octet-stream')
                if student.payment_proof2:
                    mime_type, _ = mimetypes.guess_type(student.payment_proof2.name)
                    email.attach(student.payment_proof2.name, student.payment_proof2.read(), mime_type or 'application/octet-stream')
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
    attendance_date = request.GET.get('attendanceDate', '')
    search = request.GET.get('search', '')

    try:
        students = StudentRegistration.objects.all()

        if standard:
            students = students.filter(standard=standard)
        if board:
            students = students.filter(board=board)
        if school:
            students = students.filter(school=school)
        if branch:
            students = students.filter(branch=branch)
        if search:
            students = students.filter(name__icontains=search)

        total_students = students.count()

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            students_list = list(students.values(
                'id', 'name', 'phone', 'address', 'branch', 'standard',
                'board', 'subject', 'school', 'school_text', 'fees',
                'payment_mode1', 'payment_proof1'
            ))
            for student in students_list:
                if student['payment_proof1']:
                    student['payment_proof1'] = request.build_absolute_uri('/media/' + student['payment_proof1'])
                else:
                    student['payment_proof1'] = ''
            return JsonResponse({'students': students_list, 'total_students': total_students})
    except Exception as e:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': f'Failed to fetch students: {str(e)}'}, status=500)
        raise  # Let Django handle non-AJAX errors for debugging

    context = {
        'students': students,
        'total_students': total_students,
        'search': search,
    }
    return render(request, 'tuition_app/filter_students.html', context)

@login_required
def student_detail(request, student_id):
    student = get_object_or_404(StudentRegistration, id=student_id)
    attendance_records = Attendance.objects.filter(student_id=student)
    
    dob = student.dob.strftime('%Y-%m-%d')

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
        'dob' : dob,
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
        email = data.get('email')
        address = data.get('address')
        father_name = data.get('father_name')
        father_phone = data.get('father_phone')
        father_occupation = data.get('father_occupation')
        mother_name = data.get('mother_name')
        mother_phone = data.get('mother_phone')
        mother_occupation = data.get('mother_occupation')
        dob = data.get('dob')
        branch = data.get('branch')
        standard = data.get('standard')
        board = data.get('board')
        subject = data.get('subject')
        school = data.get('school')
        school_text = data.get('school_text')
        fees = data.get('fees')
        fee_structure = data.get('fee_structure')
        installment_plan = data.get('installment_plan')
        discount = data.get('discount')
        amount1 = data.get('amount1')
        payment_mode1 = data.get('payment_mode1')
        
        amount2 = data.get('amount2')
        payment_mode2 = data.get('payment_mode2')
        
        payment_proof2 = request.FILES.get('payment_proof2')
        
        full_fee_paid = data.get('full_fee_paid')
        
        # payment_proof = request.FILES.get('payment_proof')
        # img = request.FILES.get('img')
        
        #check code for image and payment image 
    
        student.name = name
        student.email = email
        student.phone = phone
        student.address = address
        student.father_name = father_name
        student.father_phone = father_phone
        student.father_occupation = father_occupation
        student.mother_name = mother_name
        student.mother_phone = mother_phone
        student.mother_occupation = mother_occupation
        student.dob = dob
        student.branch = branch
        student.standard = standard
        student.board = board
        student.subject = subject
        student.school = school
        student.school_text = school_text
        student.fees = fees
        student.fee_structure = fee_structure
        student.installment_plan = installment_plan
        student.discount = discount
        student.amount1 = amount1
        student.payment_mode1 = payment_mode1
        student.amount2 = amount2
        student.payment_mode2 = payment_mode2
        student.full_fee_paid = full_fee_paid
        
        if payment_proof2:
            student.payment_proof2 = payment_proof2
            
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



# def class_attendance(request):
#     standard = request.GET.get('standard')
#     board = request.GET.get('board')
#     school = request.GET.get('school')
#     branch = request.GET.get('branch')
#     month = request.GET.get('month')  # Format: '2024-05'

#     students = StudentRegistration.objects.all()

#     if standard:
#         students = students.filter(standard=standard)
#     if board:
#         students = students.filter(board=board)
#     if school:
#         if school == "NA":
#             students = students.filter(school_text="NA")
#         else:
#             students = students.filter(school=school)
#     if branch:
#         students = students.filter(branch=branch)

#     # Filter attendance
#     attendance_data = {}
#     if month:
#         try:
#             year, month = map(int, month.split("-"))
#         except ValueError:
#             year, month = None, None

#         for student in students:
#             monthly_attendance = Attendance.objects.filter(
#                 student_id=student,
#                 date__year=year,
#                 date__month=month
#             ).order_by("date")
#             attendance_data[student.id] = monthly_attendance

#     context = {
#         'students': students,
#         'attendance_data': attendance_data,
#     }
#     return render(request, 'your_template_path/class_attendance.html', context)




def get_attendance_by_month(request, year, month):
    """
    Returns a dictionary of attendance records for each student
    from the 1st to the last day of the specified month.
    
    Format:
    {
        student_id: {
            "name": "Student Name",
            "attendance": [
                {"date": ..., "status": True/False/None}
            ]
        },
        ...
    }
    """

    # Calculate start and end dates of the month
    start_date = date(year, month, 1)
    last_day = monthrange(year, month)[1]  # Returns (weekday, num_days)
    end_date = date(year, month, last_day)

    # Fetch all attendance records in date range
    attendance_records = Attendance.objects.filter(date__range=(start_date, end_date)).select_related("student_id")

    # Organize by student
    attendance_data = {}
    for record in attendance_records:
        student = record.student_id
        if student.id not in attendance_data:
            attendance_data[student.id] = {
                "name": student.name,
                "standard": student.standard,
                "attendance": []
            }
        attendance_data[student.id]["attendance"].append({
            "date": record.date,
            "status": record.status
        })

    return JsonResponse(attendance_data)



def load_class_attendance(request):
    return render(request, "tuition_app/attendance_page.html")



def class_attendance(request):
    selected_standard = request.GET.get('standard', '')
    selected_board = request.GET.get('board', '')
    selected_school = request.GET.get('school', '')
    selected_branch = request.GET.get('branch', '')
    month_str = request.GET.get('month', '') # YYYY-MM
    search_query = request.GET.get('search', '')

    # Determine year and month
    if month_str:
        try:
            year, month = map(int, month_str.split('-'))
        except ValueError:
            # Handle invalid month format, default to current month
            today = date.today()  # Fixed: use date.today() instead of datetime.date.today()
            year, month = today.year, today.month
            month_str = today.strftime('%Y-%m')
    else:
        # Default to current month if no month is selected
        today = date.today()  # Fixed: use date.today() instead of datetime.date.today()
        year, month = today.year, today.month
        month_str = today.strftime('%Y-%m') # To pre-fill the month input

    # Get number of days in the selected month
    num_days = calendar.monthrange(year, month)[1]
    days_in_month_numbers = list(range(1, num_days + 1))

    # Base queryset
    students = StudentRegistration.objects.all()

    # Apply filters
    if selected_standard:
        students = students.filter(standard=selected_standard)
    if selected_board:
        students = students.filter(board=selected_board)
    if selected_school:
        # Assuming 'NA' in school dropdown means students where school is 'NA' or possibly null/empty
        if selected_school == "NA":
            students = students.filter(Q(school_text__iexact="NA") | Q(school__isnull=True) | Q(school=""))
        else:
            students = students.filter(school=selected_school)
    if selected_branch:
        students = students.filter(branch=selected_branch)
    
    if search_query:
        students = students.filter(name__icontains=search_query)

    students = students.order_by('name') # Order students by name

    students_data_list = []
    for student in students:
        # Fetch attendance for this student for the given month and year
        attendance_records = Attendance.objects.filter(
            student_id=student,
            date__year=year,
            date__month=month
        ).values('date__day', 'status') # Get day of month and status

        # Create a map of day -> status for quick lookup
        attendance_map = {record['date__day']: record['status'] for record in attendance_records}

        daily_statuses = []
        total_present = 0
        for day_num in days_in_month_numbers:
            status = attendance_map.get(day_num) # Get status for the day
            if status is True:
                daily_statuses.append('P') # Present
                total_present += 1
            elif status is False:
                daily_statuses.append('A') # Absent
            else:
                daily_statuses.append('-') # No record / Not Marked

        students_data_list.append({
            'student': student, # For server-side rendering to access student.id, student.name etc.
            'id': student.id,   # For AJAX, explicit id
            'name': student.name, # For AJAX, explicit name
            'attendance_statuses': daily_statuses,
            'total_present': total_present,
            'monthly_attendance': daily_statuses # For consistency with JS `displayStudents` if it expects this key
        })
    
    total_students_count = len(students_data_list)

    # For AJAX requests, return JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # Prepare data specifically for JSON response (matching what displayStudents expects)
        json_students_data = [
            {
                'id': s_data['id'],
                'name': s_data['name'],
                'monthly_attendance': s_data['attendance_statuses'], # Or s_data['monthly_attendance']
                'total_present': s_data['total_present']
            } for s_data in students_data_list
        ]
        return JsonResponse({
            'students': json_students_data,
            'days': days_in_month_numbers,
            'total_students': total_students_count
        })

    # For regular requests, render the template
    context = {
        'students_data': students_data_list, # List of dicts, each containing student object and their attendance
        'days_in_month': days_in_month_numbers,
        'total_students': total_students_count,
        'selected_standard': selected_standard,
        'selected_board': selected_board,
        'selected_school': selected_school,
        'selected_branch': selected_branch,
        'selected_month': month_str, # YYYY-MM format for month input
        'search': search_query,
        # You might want to pass choices for dropdowns if they are not hardcoded in HTML,
        # or if you want to set the 'selected' attribute in options dynamically.
        # e.g. 'standard_choices': StudentRegistration.STANDARD_CHOICES,
    }
    return render(request, 'tuition_app/attendance_page.html', context) # Update template path
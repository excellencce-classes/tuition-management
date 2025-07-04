# tuition_app/models.py
from django.db import models
import os
import time
from multiselectfield import MultiSelectField
import datetime 

class StudentRegistration(models.Model):
    
    def unique_filename(instance, filename):
        ext = filename.split('.')[-1]
        filename = f"{int(time.time())}.{ext}"
        return os.path.join('payment_proofs/', filename)
    
    
    PAYMENT_CHOICES = [
        ('online', 'Online'),
        ('cash', 'Cash'),
    ]
    
    
    STANDARD_CHOICES = [
        ('8', '8th'),
        ('9', '9th'),
        ('10', '10th'),
        ('12', '12th'),
    ]
    
    BOARD_CHOICES = [
        ('CBSE', 'CBSE'),
        ('SSC', 'SSC'),
        ('HSC', 'HSC'),
    ]
    
    SUBJECT_CHOICES = [
        ('English (Tuition + Test Series)', 'English (Tuition + Test Series)'),
        ('Social Studies (Tuition + Test Series)', 'Social Studies (Tuition + Test Series)'),
        ('Grammar (Tuition + Test Series)', 'Grammar (Tuition + Test Series)'),
        ('English (Test Series)', 'English (Test Series)'),
        ('Social Studies (Test Series)', 'Social Studies (Test Series)'),
    ]
    
    BRANCH_CHOICES = [
        ('Gulmohar', 'Gulmohar'),
        ('Market Yard', 'Market Yard'),
    ]
    
    SCHOOL_CHOICES = [
        ('Saint Michael School', 'Saint Michael School'),
        ('Orchid School', 'Orchid School'),
        ('Sai Angel School', 'Sai Angel School'),
        ('Icon Public School', 'Icon Public School'),
        ('Takshila School', 'Takshila School'),
        ('Podar School', 'Podar School'),
        ('Auxilium Convent School', 'Auxilium Convent School'),
        ('Sacred Heart Convent School', 'Sacred Heart Convent School'),
        ('Ashokbhau Firodia School', 'Ashokbhau Firodia School'),
        ('Athare Patil School', 'Athare Patil School'),
        ('Other', 'Other'),
    ]

    INSTALLMENT_PLAN_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    email = models.EmailField(max_length=254, null=True, blank=True)
    father_name = models.CharField(max_length=100)
    father_phone = models.CharField(max_length=10)
    father_occupation = models.CharField(max_length=50)
    mother_name = models.CharField(max_length=100)
    mother_phone = models.CharField(max_length=10)
    mother_occupation = models.CharField(max_length=50)
    address = models.TextField()
    dob = models.DateField(default=datetime.date.today)
    img = models.ImageField(upload_to='student_img/', default='student_img/fallback.png', blank=True)
    standard = models.CharField(max_length=2, choices=STANDARD_CHOICES)
    board = models.CharField(max_length=4, choices=BOARD_CHOICES)
    school = models.CharField(max_length=50, choices=SCHOOL_CHOICES, null=True, blank=True)
    school_text = models.CharField(max_length=100, blank=True, null=True, default = "NA")
    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES)
    subject = MultiSelectField(choices=SUBJECT_CHOICES, max_length=1000)
    
    
    
    fees = models.IntegerField()
    fee_structure = models.TextField()
    installment_plan = models.CharField(max_length=3, choices=INSTALLMENT_PLAN_CHOICES)
    discount = models.IntegerField(default=0, null=True, blank=True)
    amount1 = models.IntegerField(null=True, blank=True)
    amount2 = models.IntegerField(default = 0, null=True, blank=True)
    payment_mode1 = models.CharField(max_length=10, choices=PAYMENT_CHOICES)
    payment_mode2 = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default= None, null=True, blank=True)
    payment_proof1 = models.FileField(upload_to=unique_filename, null=True, blank=True)
    payment_proof2 = models.FileField(upload_to=unique_filename, null=True, blank=True, default=None)
    full_fee_paid = models.BooleanField(null = True, blank=True)


    def __str__(self):
        return f"{self.name} - {self.standard} - {self.board}"
    
class Attendance(models.Model):
    date = models.DateField(null=True, blank=True)
    status = models.BooleanField(null=True, blank=True)
    student_id = models.ForeignKey("StudentRegistration", on_delete=models.CASCADE)
    
    
    
    
# class Installment(models.Model):

    
#     amount = models.IntegerField()
#     ins_no = models.IntegerField()
#     student_id = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
#     total_fees = models.IntegerField()
#     payment_mode = models.CharField(max_length=10, choices=PAYMENT_CHOICES)
#     payment_proof = models.FileField(upload_to=unique_filename, null=True, blank=True)
#     full_fee_paid = models.BooleanField()
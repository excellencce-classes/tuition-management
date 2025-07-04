# tuition_app/urls.py
from django.urls import path
from . import views
from django.contrib.auth.views import LoginView, LogoutView

app_name = 'tuition_app'



urlpatterns = [
    path('', views.registration_view, name='register'),
    path('register/success/', views.success_view, name='registration_success'),
    path('login/', LoginView.as_view(template_name='tuition_app/adminlogin.html', redirect_authenticated_user=True), name='login'),
    path('logout/', LogoutView.as_view(next_page='/login/'), name='logout'),
    path('filter_students/', views.filter_students, name = "filter_students"),
    path('student/<int:student_id>/', views.student_detail, name="student_detail"),
    path('display/', views.display, name="display"),
    path('update_attendance/', views.update_attendance, name='update_attendance'),
    path('get_attendance_by_month/<int:year>/<int:month>', views.get_attendance_by_month, name = 'get_attendance_by_month'),
    #path('class_attendance/', views.load_class_attendance, name = "load_class_attendance"),
    path('monthly_attendance/', views.class_attendance, name='class_attendance'),

    
    
    path('delete_student/<int:student_id>/', views.delete_student, name="delete_student"),
    path('update_student/<int:student_id>', views.update_student, name="update_student")
]

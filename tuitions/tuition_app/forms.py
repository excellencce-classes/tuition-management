from django import forms
from .models import StudentRegistration

class RegistrationForm(forms.ModelForm):
    class Meta:
        model = StudentRegistration
        fields = [
            'name', 'dob', 'father_name', 'father_phone', 'father_occupation',
            'mother_name', 'mother_phone', 'mother_occupation', 'email', 'phone',
            'address', 'img', 'standard', 'board', 'school', 'school_text', 'branch',
            'subject', 'fees', 'fee_structure', 'installment_plan', 'discount',
            'amount1', 'amount2', 'payment_mode1', 'payment_mode2', 'payment_proof1',
            'payment_proof2', 'full_fee_paid'
        ]
        widgets = {
            'standard': forms.Select(attrs={'id': 'standard'}),
            'board': forms.Select(attrs={'id': 'board'}),
            'subject': forms.CheckboxSelectMultiple(attrs={'id': 'subject'}),
            'school': forms.Select(attrs={'id': 'school'}),
            'school_text': forms.TextInput(attrs={'id': 'school_text', 'placeholder': 'Enter school name'}),
            'branch': forms.Select(attrs={'id': 'branch'}),
            'fees': forms.TextInput(attrs={'id': 'fees', 'readonly': True}),
            'fee_structure': forms.Textarea(attrs={'id': 'fee_structure', 'readonly': True}),
            'installment_plan': forms.Select(attrs={'id': 'installment_plan'}),
            'discount': forms.TextInput(attrs={'id': 'discount'}),
            'amount1': forms.TextInput(attrs={'id': 'amount1'}),
            'amount2': forms.TextInput(attrs={'id': 'amount2'}),
            'payment_mode1': forms.Select(attrs={'id': 'payment_mode1'}),
            'payment_mode2': forms.Select(attrs={'id': 'payment_mode2'}),
            'payment_proof1': forms.FileInput(attrs={'id': 'payment_proof1'}),
            'payment_proof2': forms.FileInput(attrs={'id': 'payment_proof2'}),
            'full_fee_paid': forms.CheckboxInput(attrs={'id': 'full_fee_paid'}),
            'img': forms.FileInput(attrs={'id': 'img'}),
            'email': forms.EmailInput(attrs={'id': 'email'}),
            'dob': forms.TextInput(attrs={'id': 'dob', 'placeholder': 'YYYY-MM-DD', 'type': 'text'}),
            'mother_name': forms.TextInput(attrs={'id': 'mother_name'}),
            'mother_phone': forms.TextInput(attrs={'id': 'mother_phone'}),
            'mother_occupation': forms.TextInput(attrs={'id': 'mother_occupation'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set initial empty choices for dependent fields
        self.fields['board'].choices = [('', '-- Select Board --')] + list(self.fields['board'].choices)[1:]
        self.fields['school'].choices = [('', '-- Select School --')] + list(self.fields['school'].choices)[1:]
        self.fields['installment_plan'].choices = [('', 'Do you want to pay in installment?')] + list(self.fields['installment_plan'].choices)[1:]
        # Set all possible subject choices (filtered client-side)
        self.fields['subject'].choices = StudentRegistration.SUBJECT_CHOICES
        # Make school_text optional
        self.fields['school_text'].required = False
// tuition_app/static/tuition_app/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const standard = document.querySelector('[name="standard"]') || document.getElementById('id_standard');
    const board = document.querySelector('[name="board"]') || document.getElementById('id_board');
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    const school = document.querySelector('[name="school"]') || document.getElementById('id_school');
    const branch = document.querySelector('[name="branch"]') || document.getElementById('id_branch');
    const fees = document.querySelector('[name="fees"]') || document.getElementById('id_fees');
    const fee_structure = document.querySelector('[name="fee_structure"]') || document.getElementById('id_fee_structure');
    const emailField = document.querySelector('[name="email"]') || document.getElementById('id_email');
    const imgField = document.querySelector('[name="img"]') || document.getElementById('id_img');
    const darkModeToggle = document.getElementById('dark-mode');
    const nameField = document.querySelector('[name="name"]') || document.getElementById('id_name');
    const phoneField = document.querySelector('[name="phone"]') || document.getElementById('id_phone');
    const fathernameField = document.querySelector('[name="father_name"]') || document.getElementById('id_father_name');
    const fatherphoneField = document.querySelector('[name="father_phone"]') || document.getElementById('id_father_phone');
    const fatheroccupationField = document.querySelector('[name="father_occupation"]') || document.getElementById('id_father_occupation');
    const mothernameField = document.querySelector('[name="mother_name"]') || document.getElementById('id_mother_name');
    const motherphoneField = document.querySelector('[name="mother_phone"]') || document.getElementById('id_mother_phone');
    const motheroccupationField = document.querySelector('[name="mother_occupation"]') || document.getElementById('id_mother_occupation');
    const addressField = document.querySelector('[name="address"]') || document.getElementById('id_address');
    const paymentMode = document.querySelector('[name="payment_mode"]') || document.getElementById('id_payment_mode');
    const paymentProof = document.querySelector('[name="payment_proof"]') || document.getElementById('id_payment_proof');
    const installmentPlan = document.querySelector('[name="installment_plan"]') || document.getElementById('id_installment_plan');
    const installmentNumber = document.querySelector('[name="installment_number"]') || document.getElementById('id_installment_number');
    const totalAmount = document.querySelector('[name="total_amount"]') || document.getElementById('id_total_amount');
    const feesToBePaid = document.querySelector('[name="fees_to_be_paid"]') || document.getElementById('id_fees_to_be_paid');
    const schoolDropdownField = document.getElementById('school-dropdown-field');
    const schoolTextField = document.getElementById('school-text-field');
    const hscSchoolInput = document.getElementById('id_hsc_school');
    const submitButton = form.querySelector('button[type="submit"]');
    const installmentFields = document.getElementById('installment-fields');

    console.log('Form elements loaded:', { standard, board, subjectCheckboxes, school, branch, fees, installmentPlan });

    const feeStructure = {
        'Gulmohar': {
            'CBSE': {
                '8': { 'English (Tuition + Test Series)': 7500, 'Social Studies (Tuition + Test Series)': 7500 },
                '9': { 'English (Tuition + Test Series)': 8000, 'Social Studies (Tuition + Test Series)': 8000 },
                '10': { 'English (Tuition + Test Series)': 9000, 'Social Studies (Tuition + Test Series)': 9000 }
            },
            'SSC': {
                '8': { 'English (Tuition + Test Series)': 7500, 'Social Studies (Tuition + Test Series)': 7500 },
                '9': { 'English (Tuition + Test Series)': 4000, 'Social Studies (Tuition + Test Series)': 4000 },
                '10': { 'English (Tuition + Test Series)': 5000, 'Social Studies (Tuition + Test Series)': 5000 }
            },
            'HSC': {
                '12': { 'English (Tuition + Test Series)': 7000 }
            }
        },
        'Market Yard': {
            'CBSE': {
                '8': { 'English (Tuition + Test Series)': 7500, 'Social Studies (Tuition + Test Series)': 7500 },
                '9': { 'English (Tuition + Test Series)': 9000, 'Social Studies (Tuition + Test Series)': 9000 },
                '10': { 'English (Tuition + Test Series)': 10000, 'Social Studies (Tuition + Test Series)': 10000 }
            },
            'SSC': {
                '8': { 'English (Tuition + Test Series)': 7500, 'Social Studies (Tuition + Test Series)': 7500 },
                '9': { 'English (Tuition + Test Series)': 4000, 'Social Studies (Tuition + Test Series)': 4000 },
                '10': { 'English (Tuition + Test Series)': 5000, 'Social Studies (Tuition + Test Series)': 5000 }
            },
            'HSC': {
                '12': { 'English (Tuition + Test Series)': 7000 }
            }
        }
    };

    const additionalFees = {
        'Grammar (Tuition + Test Series)': 2000,
        'English (Test Series)': 1500,
        'Social Studies (Test Series)': 1500,
        'English + Social Studies (Test Series)': 3000
    };

    const subjectOptions = {
        '8': [
            'English (Tuition + Test Series)',
            'Social Studies (Tuition + Test Series)',
            'Grammar (Tuition + Test Series)'
        ],
        '9': [
            'English (Tuition + Test Series)',
            'Social Studies (Tuition + Test Series)',
            'Grammar (Tuition + Test Series)'
        ],
        '10': [
            'English (Tuition + Test Series)',
            'Social Studies (Tuition + Test Series)',
            'Grammar (Tuition + Test Series)',
            'English (Test Series)',
            'Social Studies (Test Series)',
            'English + Social Studies (Test Series)'
        ],
        '12': [
            'English (Tuition + Test Series)',
            'English (Test Series)'
        ]
    };

    function updateForm() {
        if (!standard || !board || !subjectCheckboxes.length || !school || !branch || !fees) {
            console.error('Missing form elements:', { standard, board, subjectCheckboxes, school, branch, fees });
            return;
        }

        const stdVal = standard.value;
        const boardVal = board.value;
        const branchVal = branch.value;
        const currentName = nameField ? nameField.value : '';
        const currentPhone = phoneField ? phoneField.value : '';
        const currentFatherName = fathernameField ? fathernameField.value : '';
        const currentFatherPhone = fatherphoneField ? fatherphoneField.value : '';
        const currentFatherOccupation = fatheroccupationField ? fatheroccupationField.value : '';
        const currentMotherName = mothernameField ? mothernameField.value : '';
        const currentMotherPhone = motherphoneField ? motherphoneField.value : '';
        const currentMotherOccupation = motheroccupationField ? motheroccupationField.value : '';
        const currentAddress = addressField ? addressField.value : '';

        console.log('Updating form with:', { stdVal, boardVal, branchVal });

        // Reset fields when standard changes
        if (stdVal !== form.dataset.lastStandard) {
            board.value = '';
            subjectCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.parentElement.style.display = 'none';
            });
            school.value = '';
            fees.value = '';
            form.dataset.lastStandard = stdVal;
            form.dataset.lastBoard = '';
            if (schoolDropdownField) schoolDropdownField.style.display = 'block';
            if (schoolTextField) schoolTextField.style.display = 'none';
            if (hscSchoolInput) hscSchoolInput.value = '';
        }

        // Update board options
        if (!boardVal || stdVal !== form.dataset.lastStandard) {
            board.innerHTML = '<option value="">-- Select Board --</option>';
            if (stdVal === '12') {
                addOption(board, 'HSC', 'HSC');
            } else {
                addOption(board, 'CBSE', 'CBSE');
                addOption(board, 'SSC', 'SSC');
            }
        }

        // Update subject checkboxes visibility
        if (stdVal) {
            const allowedSubjects = subjectOptions[stdVal] || [];
            console.log('Allowed subjects for standard', stdVal, ':', allowedSubjects);
            subjectCheckboxes.forEach(checkbox => {
                const isVisible = allowedSubjects.includes(checkbox.value);
                checkbox.parentElement.style.display = isVisible ? 'block' : 'none';
                if (!isVisible) {
                    checkbox.checked = false;
                }
            });
        } else {
            subjectCheckboxes.forEach(checkbox => {
                checkbox.parentElement.style.display = 'none';
                checkbox.checked = false;
            });
        }

        // Update school field
        if (stdVal && boardVal && (stdVal !== form.dataset.lastStandard || boardVal !== form.dataset.lastBoard)) {
            school.innerHTML = '<option value="">-- Select School --</option>';
            if (stdVal === '12' && boardVal === 'HSC') {
                addOption(school, 'NA', 'Not Applicable');
                school.value = 'NA';
                if (schoolDropdownField) schoolDropdownField.style.display = 'block';
                if (schoolTextField) schoolTextField.style.display = 'block';
            } else {
                if (schoolTextField) schoolTextField.style.display = 'none';
                if (hscSchoolInput) hscSchoolInput.value = '';
                if (stdVal === '12') {
                    addOption(school, 'NA', 'Not Applicable');
                } else if (boardVal === 'CBSE') {
                    ['Saint Michael School', 'Orchid School', 'Sai Angel School', 
                     'Icon Public School', 'Takshila School', 'Podar School']
                    .forEach(s => addOption(school, s, s));
                } else if (boardVal === 'SSC') {
                    ['Auxilium Convent School', 'Sacred Heart Convent School', 
                     'Ashokbhau Firodia School', 'Athare Patil School']
                    .forEach(s => addOption(school, s, s));
                }
                if (schoolDropdownField) schoolDropdownField.style.display = 'block';
            }
            form.dataset.lastBoard = boardVal;
        }

        if (stdVal !== '12' || boardVal !== 'HSC') {
            if (hscSchoolInput) hscSchoolInput.value = '';
        }

        // Restore form values
        if (nameField) nameField.value = currentName;
        if (phoneField) phoneField.value = currentPhone;
        if (fathernameField) fathernameField.value = currentFatherName;
        if (fatherphoneField) fatherphoneField.value = currentFatherPhone;
        if (fatheroccupationField) fatheroccupationField.value = currentFatherOccupation;
        if (mothernameField) mothernameField.value = currentMotherName;
        if (motherphoneField) motherphoneField.value = currentMotherPhone;
        if (motheroccupationField) motheroccupationField.value = currentMotherOccupation;
        if (addressField) addressField.value = currentAddress;

        // Update fees
        if (stdVal && boardVal && branchVal) {
            const selectedSubjects = Array.from(subjectCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            console.log('Calculating fees for:', { stdVal, boardVal, branchVal, selectedSubjects });
            let feeBreakup = [];
            let totalFee = 0;

            selectedSubjects.forEach(subj => {
                let fee = 0;
                if (['Grammar (Tuition + Test Series)', 'English (Test Series)', 'Social Studies (Test Series)', 'English + Social Studies (Test Series)'].includes(subj)) {
                    fee = additionalFees[subj] || 0;
                    console.log(`Fee for ${subj}: ₹${fee} (from additionalFees)`);
                } else {
                    fee = feeStructure[branchVal]?.[boardVal]?.[stdVal]?.[subj] || 0;
                    console.log(`Fee for ${subj}: ₹${fee} (from feeStructure)`);
                }
                if (fee > 0) {
                    totalFee += fee;
                    feeBreakup.push(`${subj}: ₹${fee}`);
                }
            });

            fees.value = feeBreakup.length > 0 
                ? `₹${totalFee} = ${feeBreakup.join(' + ')}`
                : '';
            console.log(`Fees set to: ${fees.value}`);

            // Update installment fields
            if (totalAmount && feesToBePaid) {
                totalAmount.value = `₹${totalFee}`;
                feesToBePaid.value = installmentPlan.value === 'yes' ? `₹${Math.floor(totalFee / 2)}` : '';
            }
        } else {
            fees.value = '';
            if (totalAmount) totalAmount.value = '';
            if (feesToBePaid) feesToBePaid.value = '';
            console.log('Fees cleared: missing stdVal, boardVal, or branchVal');
        }

        // Update installment fields visibility
        if (installmentPlan && installmentFields) {
            installmentFields.style.display = installmentPlan.value === 'yes' ? 'block' : 'none';
            if (installmentPlan.value !== 'yes') {
                if (installmentNumber) installmentNumber.value = '';
                if (totalAmount) totalAmount.value = '';
                if (feesToBePaid) feesToBePaid.value = '';
            }
        }

        // Update payment proof
        const paymentModeVal = paymentMode ? paymentMode.value : '';
        if (paymentModeVal === 'cash') {
            if (paymentProof) {
                paymentProof.disabled = true;
                paymentProof.value = '';
                paymentProof.required = false;
            }
        } else {
            if (paymentProof) {
                paymentProof.disabled = false;
                paymentProof.required = true;
            }
        }

        checkFormCompletion();
    }

    function checkFormCompletion() {
        const requiredFields = [
            nameField, phoneField, fathernameField, fatherphoneField, 
            fatheroccupationField, mothernameField, motherphoneField, 
            motheroccupationField, addressField, standard, board, 
            subjectCheckboxes[0], branch, school, fees, paymentMode, installmentPlan
        ].filter(field => field !== null && field !== undefined);

        const allFieldsFilled = requiredFields.every(field => {
            if (field === subjectCheckboxes[0]) {
                return Array.from(subjectCheckboxes).some(checkbox => checkbox.checked);
            }
            return field.value && field.value.trim() !== '';
        });

        const paymentValid = paymentMode && (paymentMode.value === 'cash' || 
                           (paymentMode.value === 'online' && paymentProof && paymentProof.files.length > 0));

        const installmentValid = installmentPlan && (installmentPlan.value === 'no' || 
                                (installmentPlan.value === 'yes' && installmentNumber && installmentNumber.value));

        // Only require email and img if they are filled
        const emailValid = emailField ? emailField.value.trim() !== '' : true;
        const imgValid = imgField ? imgField.files && imgField.files.length > 0 : true;

        submitButton.disabled = !(allFieldsFilled && paymentValid && installmentValid && emailValid && imgValid);
        console.log('Form completion check:', { 
            allFieldsFilled, 
            paymentValid, 
            installmentValid,
            emailValid,
            imgValid,
            selectedSubjects: Array.from(subjectCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
        });
    }

    function addOption(select, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        select.appendChild(option);
    }

    // Event listeners
    if (standard) standard.addEventListener('change', updateForm);
    if (board) board.addEventListener('change', updateForm);
    if (branch) branch.addEventListener('change', updateForm);
    if (paymentMode) paymentMode.addEventListener('change', updateForm);
    if (paymentProof) paymentProof.addEventListener('change', checkFormCompletion);
    if (installmentPlan) installmentPlan.addEventListener('change', updateForm);
    if (installmentNumber) installmentNumber.addEventListener('change', checkFormCompletion);
    if (hscSchoolInput) hscSchoolInput.addEventListener('input', updateForm);
    if (emailField) {
        emailField.addEventListener('input', checkFormCompletion);
        emailField.addEventListener('change', checkFormCompletion);
    }
    if (imgField) {
        imgField.addEventListener('change', checkFormCompletion);
    }
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateForm);
    });

    const allFields = form.querySelectorAll('input, select, textarea');
    allFields.forEach(field => {
        field.addEventListener('input', checkFormCompletion);
        field.addEventListener('change', checkFormCompletion);
    });

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }

    // Prevent form reset on submission
    form.addEventListener('submit', function(event) {
        console.log('Form submitted with subjects:', 
            Array.from(subjectCheckboxes).filter(cb => cb.checked).map(cb => cb.value));
    });

    console.log('Initial form update');
    updateForm();
});
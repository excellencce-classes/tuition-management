// tuition_app/static/tuition_app/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const standard = document.querySelector('[name="standard"]') || document.getElementById('id_standard');
    const board = document.querySelector('[name="board"]') || document.getElementById('id_board');
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    const school = document.querySelector('[name="school"]') || document.getElementById('id_school');
    const branch = document.querySelector('[name="branch"]') || document.getElementById('id_branch');
    const fees = document.querySelector('[name="fees"]') || document.getElementById('id_fees');
    const feeStructure = document.querySelector('[name="fee_structure"]') || document.getElementById('id_fee_structure');
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
    const paymentMode1 = document.querySelector('[name="payment_mode1"]') || document.getElementById('id_payment_mode1');
    const paymentProof1 = document.querySelector('[name="payment_proof1"]') || document.getElementById('id_payment_proof1');
    const amount1 = document.querySelector('[name="amount1"]') || document.getElementById('id_amount1');
    const installmentPlan = document.querySelector('[name="installment_plan"]') || document.getElementById('id_installment_plan');
    const installmentFields = document.getElementById('installment-fields');
    const schoolDropdownField = document.getElementById('school-dropdown-field');
    const schoolTextField = document.getElementById('school-text-field');
    const submitButton = form.querySelector('button[type="submit"]');

    console.log('Form elements loaded:', { standard, board, subjectCheckboxes, school, branch, fees, feeStructure, installmentPlan, amount1, paymentMode1, installmentFields });

    const feeStructureData = {
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
        if (!standard || !board || !subjectCheckboxes.length || !school || !branch || !fees || !feeStructure || !installmentPlan || !amount1 || !paymentMode1) {
            console.error('Missing form elements:', { standard, board, subjectCheckboxes, school, branch, fees, feeStructure, installmentPlan, amount1, paymentMode1 });
            return;
        }

        const stdVal = standard.value;
        const boardVal = board.value;
        const branchVal = branch.value;
        const schoolVal = school.value;
        const installmentPlanVal = installmentPlan.value;
        const paymentModeVal = paymentMode1.value;
        const currentName = nameField ? nameField.value : '';
        const currentPhone = phoneField ? phoneField.value : '';
        const currentFatherName = fathernameField ? fathernameField.value : '';
        const currentFatherPhone = fatherphoneField ? fatherphoneField.value : '';
        const currentFatherOccupation = fatheroccupationField ? fatheroccupationField.value : '';
        const currentMotherName = mothernameField ? mothernameField.value : '';
        const currentMotherPhone = motherphoneField ? motherphoneField.value : '';
        const currentMotherOccupation = motheroccupationField ? motheroccupationField.value : '';
        const currentAddress = addressField ? addressField.value : '';

        console.log('Updating form with:', { stdVal, boardVal, branchVal, installmentPlanVal, paymentModeVal });

        // Reset fields when standard changes
        if (stdVal !== form.dataset.lastStandard) {
            board.value = '';
            subjectCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.parentElement.style.display = 'none';
            });
            school.value = '';
            fees.value = '';
            feeStructure.value = '';
            installmentPlan.value = '';
            amount1.value = '';
            paymentMode1.value = '';
            paymentProof1.value = '';
            if (installmentFields) installmentFields.style.display = 'none';
            form.dataset.lastStandard = stdVal;
            form.dataset.lastBoard = '';
            if (schoolDropdownField) schoolDropdownField.style.display = 'block';
            if (schoolTextField) schoolTextField.style.display = 'none';
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
            const schools = boardVal === 'CBSE' ? 
                ['Saint Michael School', 'Orchid School', 'Sai Angel School', 'Icon Public School', 'Takshila School', 'Podar School', 'Other'] :
                boardVal === 'SSC' ? 
                ['Auxilium Convent School', 'Sacred Heart Convent School', 'Ashokbhau Firodia School', 'Athare Patil School', 'Other'] :
                ['Other']; // HSC
            schools.forEach(s => addOption(school, s, s));
            form.dataset.lastBoard = boardVal;
            console.log('School options updated:', schools);
        }

        // Show/hide school text field based on school selection
        if (schoolTextField && schoolDropdownField) {
            schoolTextField.style.display = schoolVal === 'Other' ? 'block' : 'none';
            const schoolTextInput = schoolTextField.querySelector('input');
            if (schoolVal !== 'Other' && schoolTextInput) {
                schoolTextInput.value = '';
            }
        }

        // Update fees and fee structure
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
                    fee = feeStructureData[branchVal]?.[boardVal]?.[stdVal]?.[subj] || 0;
                    console.log(`Fee for ${subj}: ₹${fee} (from feeStructureData)`);
                }
                if (fee > 0) {
                    totalFee += fee;
                    feeBreakup.push(`${subj}: ₹${fee}`);
                }
            });

            fees.value = totalFee > 0 ? totalFee : '';
            feeStructure.value = feeBreakup.length > 0 ? feeBreakup.join(' + ') : '';
            console.log(`Fees set to: ${fees.value}, Fee structure set to: ${feeStructure.value}`);
        } else {
            fees.value = '';
            feeStructure.value = '';
            console.log('Fees and fee structure cleared: missing stdVal, boardVal, or branchVal');
        }

        // Update installment fields
        if (installmentFields && fees.value) {
            if (installmentPlanVal === 'yes' || installmentPlanVal === 'no') {
                installmentFields.style.display = 'block';
                // Set payment_mode1 options only if not already set
                if (paymentMode1.options.length === 0) {
                    addOption(paymentMode1, '', '-- Select Payment Mode --');
                    addOption(paymentMode1, 'cash', 'Cash');
                    addOption(paymentMode1, 'online', 'Online');
                    console.log('Payment mode options initialized');
                }
                // Set amount1 based on installment plan
                const totalFee = parseInt(fees.value) || 0;
                amount1.value = installmentPlanVal === 'yes' ? Math.floor(totalFee / 2) : totalFee;
                amount1.readOnly = true;
                console.log(`Installment fields shown, amount1 set to: ${amount1.value}, paymentMode1: ${paymentMode1.value}`);
            } else {
                installmentFields.style.display = 'none';
                amount1.value = '';
                paymentMode1.value = '';
                paymentProof1.value = '';
                paymentMode1.innerHTML = ''; // Clear options when hidden
                console.log('Installment fields hidden');
            }
        }

        // Update payment proof
        if (paymentModeVal === 'cash') {
            if (paymentProof1) {
                paymentProof1.disabled = true;
                paymentProof1.value = '';
                paymentProof1.required = false;
            }
        } else if (paymentModeVal === 'online') {
            if (paymentProof1) {
                paymentProof1.disabled = false;
                paymentProof1.required = true;
            }
        } else {
            if (paymentProof1) {
                paymentProof1.disabled = false;
                paymentProof1.required = false;
            }
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

        checkFormCompletion();
    }

    function checkFormCompletion() {
        const requiredFields = [
            nameField, phoneField, fathernameField, fatherphoneField, 
            fatheroccupationField, mothernameField, motherphoneField, 
            motheroccupationField, addressField, standard, board, 
            subjectCheckboxes[0], branch, school, fees, installmentPlan
        ].filter(field => field !== null && field !== undefined);

        // Add amount1 and paymentMode1 to required fields if installment fields are visible
        if (installmentFields && installmentFields.style.display === 'block') {
            requiredFields.push(amount1, paymentMode1);
        }

        const allFieldsFilled = requiredFields.every(field => {
            if (field === subjectCheckboxes[0]) {
                return Array.from(subjectCheckboxes).some(checkbox => checkbox.checked);
            }
            return field.value && field.value.trim() !== '';
        });

        const paymentValid = paymentMode1 && installmentFields && installmentFields.style.display === 'block' ? 
            (paymentMode1.value === 'cash' || (paymentMode1.value === 'online' && paymentProof1 && paymentProof1.files.length > 0)) : 
            true;

        // Require school_text if school is 'Other'
        const schoolTextInput = schoolTextField ? schoolTextField.querySelector('input') : null;
        const schoolValid = school.value !== 'Other' || (school.value === 'Other' && schoolTextInput && schoolTextInput.value.trim() !== '');

        // Only require email and img if they are filled
        const emailValid = emailField ? emailField.value.trim() !== '' : true;
        const imgValid = imgField ? imgField.files && imgField.files.length > 0 : true;

        submitButton.disabled = !(allFieldsFilled && paymentValid && schoolValid && emailValid && imgValid);
        console.log('Form completion check:', { 
            allFieldsFilled, 
            paymentValid,
            schoolValid,
            emailValid,
            imgValid,
            selectedSubjects: Array.from(subjectCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
            paymentMode1: paymentMode1.value
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
    if (school) school.addEventListener('change', updateForm);
    if (paymentMode1) paymentMode1.addEventListener('change', function() {
        console.log('Payment mode selected:', paymentMode1.value);
        updateForm();
    });
    if (paymentProof1) paymentProof1.addEventListener('change', checkFormCompletion);
    if (installmentPlan) installmentPlan.addEventListener('change', updateForm);
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
            Array.from(subjectCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
            'payment_mode1:', paymentMode1.value);
    });

    console.log('Initial form update');
    updateForm();
});
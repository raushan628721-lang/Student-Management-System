document.addEventListener('DOMContentLoaded', () => {
    // Form & Input elements
    const studentForm = document.getElementById('studentForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const recordIdInput = document.getElementById('recordId');
    const studentIdInput = document.getElementById('student_id');
    const nameInput = document.getElementById('name');
    const departmentInput = document.getElementById('department');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const searchInput = document.getElementById('searchInput');
    const studentTableBody = document.getElementById('studentTableBody');

    // Stats elements
    const totalStudentsCount = document.getElementById('totalStudentsCount');
    const totalDeptsCount = document.getElementById('totalDeptsCount');
    const latestStudentId = document.getElementById('latestStudentId');
    const tableBadgeCount = document.getElementById('tableBadgeCount');

    let studentsData = [];

    // Avatar Color Palette
    const avatarGradients = [
        'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
        'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        'linear-gradient(135deg, #db2777 0%, #f43f5e 100%)',
        'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
    ];

    function getAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % avatarGradients.length;
        return avatarGradients[index];
    }

    function getInitials(name) {
        if (!name) return 'ST';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    function getDeptBadgeClass(dept) {
        if (!dept) return 'dept-default';
        const d = dept.toLowerCase();
        if (d.includes('computer') || d.includes('cs') || d.includes('software')) return 'dept-cs';
        if (d.includes('information') || d.includes('it')) return 'dept-it';
        if (d.includes('electronic') || d.includes('ec') || d.includes('ee')) return 'dept-ece';
        if (d.includes('mech')) return 'dept-mech';
        if (d.includes('civil')) return 'dept-civil';
        if (d.includes('business') || d.includes('mgmt') || d.includes('mba') || d.includes('bba')) return 'dept-business';
        return 'dept-default';
    }

    // --- Toast Notifications ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        } else {
            iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        }

        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 350);
        }, 3500);
    }

    // --- Client Validation ---
    function setError(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        const errorElem = document.getElementById(input.id + 'Error');
        if (errorElem) {
            errorElem.innerHTML = `⚠️ ${message}`;
            errorElem.style.display = 'flex';
        }
        return false;
    }

    function clearError(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        const errorElem = document.getElementById(input.id + 'Error');
        if (errorElem) {
            errorElem.textContent = '';
            errorElem.style.display = 'none';
        }
        return true;
    }

    function validateStudentId() {
        const val = studentIdInput.value.trim();
        if (!val) return setError(studentIdInput, 'Student ID is required (e.g. STU-101)');
        return clearError(studentIdInput);
    }

    function validateName() {
        const val = nameInput.value.trim();
        if (!val) return setError(nameInput, 'Full Name is required');
        if (val.length < 2) return setError(nameInput, 'Name must be at least 2 characters');
        return clearError(nameInput);
    }

    function validateDepartment() {
        const val = departmentInput.value.trim();
        if (!val) return setError(departmentInput, 'Department is required');
        return clearError(departmentInput);
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) return setError(emailInput, 'Email address is required');
        if (!emailRegex.test(val)) return setError(emailInput, 'Please enter a valid email address');
        return clearError(emailInput);
    }

    function validatePhone() {
        const val = phoneInput.value.trim();
        const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
        if (!val) return setError(phoneInput, 'Phone number is required');
        if (!phoneRegex.test(val)) return setError(phoneInput, 'Please enter a valid 7 to 15 digit phone number');
        return clearError(phoneInput);
    }

    studentIdInput.addEventListener('input', validateStudentId);
    nameInput.addEventListener('input', validateName);
    departmentInput.addEventListener('input', validateDepartment);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);

    function validateEntireForm() {
        const v1 = validateStudentId();
        const v2 = validateName();
        const v3 = validateDepartment();
        const v4 = validateEmail();
        const v5 = validatePhone();
        return v1 && v2 && v3 && v4 && v5;
    }

    function resetForm() {
        studentForm.reset();
        recordIdInput.value = '';
        formTitle.innerHTML = `
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Register New Student
        `;
        submitBtn.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Register Student
        `;
        cancelBtn.style.display = 'none';

        [studentIdInput, nameInput, departmentInput, emailInput, phoneInput].forEach(inp => {
            inp.classList.remove('is-valid', 'is-invalid');
            const err = document.getElementById(inp.id + 'Error');
            if (err) err.style.display = 'none';
        });
    }

    cancelBtn.addEventListener('click', resetForm);

    // --- Fetch Records from AJAX API ---
    function loadStudents() {
        fetch('api.php?action=fetch')
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    studentsData = res.data || [];
                    updateStats(studentsData);
                    renderTable(studentsData);
                } else {
                    showToast(res.message, 'error');
                }
            })
            .catch(err => {
                console.error('Error fetching records:', err);
                showToast('Unable to connect to database.', 'error');
            });
    }

    // --- Update Dynamic Stats ---
    function updateStats(data) {
        if (totalStudentsCount) totalStudentsCount.textContent = data.length;
        if (tableBadgeCount) tableBadgeCount.textContent = `${data.length} Enrolled`;

        if (totalDeptsCount) {
            const depts = new Set(data.map(s => s.department ? s.department.trim().toLowerCase() : ''));
            depts.delete('');
            totalDeptsCount.textContent = depts.size;
        }

        if (latestStudentId) {
            latestStudentId.textContent = data.length > 0 ? data[0].student_id : 'None';
        }
    }

    // --- Render Table ---
    function renderTable(data) {
        if (!data || data.length === 0) {
            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-placeholder">
                        <div class="empty-icon">📁</div>
                        <h4 style="font-size: 1.05rem; font-weight: 700; color: #334155; margin-bottom: 4px;">No student records found</h4>
                        <p style="font-size: 0.85rem; color: #94a3b8;">Use the form to register your first student.</p>
                    </td>
                </tr>
            `;
            return;
        }

        studentTableBody.innerHTML = data.map(item => {
            const avatarBg = getAvatarColor(item.name || 'Student');
            const initials = getInitials(item.name || 'ST');
            const deptBadgeClass = getDeptBadgeClass(item.department || '');

            return `
                <tr id="row-${item.id}">
                    <td>
                        <span class="id-pill">${escapeHtml(item.student_id)}</span>
                    </td>
                    <td>
                        <div class="student-profile">
                            <div class="student-avatar" style="background: ${avatarBg};">
                                ${initials}
                            </div>
                            <div class="student-name">${escapeHtml(item.name)}</div>
                        </div>
                    </td>
                    <td>
                        <span class="dept-badge ${deptBadgeClass}">
                            🎓 ${escapeHtml(item.department)}
                        </span>
                    </td>
                    <td class="contact-cell">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span>✉️</span> ${escapeHtml(item.email)}
                        </div>
                    </td>
                    <td class="contact-cell">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span>📞</span> ${escapeHtml(item.phone)}
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-action-edit" onclick="editStudent(${item.id})">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                Edit
                            </button>
                            <button class="btn-action btn-action-delete" onclick="deleteStudent(${item.id})">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.toString().replace(/[&<>"']/g, m => map[m]);
    }

    // --- Instant Filter / Search ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderTable(studentsData);
            return;
        }
        const filtered = studentsData.filter(s =>
            (s.student_id && s.student_id.toLowerCase().includes(query)) ||
            (s.name && s.name.toLowerCase().includes(query)) ||
            (s.department && s.department.toLowerCase().includes(query)) ||
            (s.email && s.email.toLowerCase().includes(query)) ||
            (s.phone && s.phone.toLowerCase().includes(query))
        );
        renderTable(filtered);
    });

    // --- Edit Student Handler ---
    window.editStudent = function(id) {
        fetch(`api.php?action=get&id=${id}`)
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    const s = res.data;
                    recordIdInput.value = s.id;
                    studentIdInput.value = s.student_id;
                    nameInput.value = s.name;
                    departmentInput.value = s.department;
                    emailInput.value = s.email;
                    phoneInput.value = s.phone;

                    formTitle.innerHTML = `
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Edit Student (${escapeHtml(s.student_id)})
                    `;
                    submitBtn.innerHTML = `
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Update Student Record
                    `;
                    cancelBtn.style.display = 'inline-flex';

                    studentForm.scrollIntoView({ behavior: 'smooth' });
                } else {
                    showToast(res.message, 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Failed to load student details.', 'error');
            });
    };

    // --- Delete Student Handler ---
    window.deleteStudent = function(id) {
        if (!confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
            return;
        }

        const formData = new FormData();
        formData.append('id', id);

        fetch('api.php?action=delete', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, 'success');
                if (recordIdInput.value == id) {
                    resetForm();
                }
                loadStudents();
            } else {
                showToast(res.message, 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Error deleting student record.', 'error');
        });
    };

    // --- Form Submit (Insert & Update via AJAX) ---
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateEntireForm()) {
            showToast('Please fix all highlighted errors before submitting.', 'error');
            return;
        }

        const isEditing = recordIdInput.value !== '';
        const targetAction = isEditing ? 'update' : 'insert';
        const formData = new FormData(studentForm);

        fetch(`api.php?action=${targetAction}`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, 'success');
                resetForm();
                loadStudents();
            } else {
                showToast(res.message, 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('An unexpected server error occurred.', 'error');
        });
    });

    // Initial Load
    loadStudents();
});

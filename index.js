/**
 * CarePulse Hospital Management System (HMS) - Landing Page Interactive Logic
 * Fully vanilla JavaScript with zero external runtime dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. DOM Element Selectors
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const toastContainer = document.getElementById('toastContainer');

    // Modals
    const appointmentModal = document.getElementById('appointmentModal');
    const loginModal = document.getElementById('loginModal');
    const openLoginBtn = document.getElementById('openLoginBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeAppointmentModal = document.getElementById('closeAppointmentModal');
    const navBookAppointmentBtn = document.getElementById('navBookAppointmentBtn');
    const heroBookBtn = document.getElementById('heroBookBtn');
    const mobileBookBtn = document.getElementById('mobileBookBtn');
    const explorePortalBtn = document.getElementById('explorePortalBtn');
    const openBookingTriggers = document.querySelectorAll('.open-booking-trigger');

    // Forms
    const appointmentForm = document.getElementById('appointmentForm');
    const portalLoginForm = document.getElementById('portalLoginForm');
    const bmiForm = document.getElementById('bmiForm');
    const newsletterForm = document.getElementById('newsletterForm');

    // Date constraint (Disallow booking past dates)
    const appointDateInput = document.getElementById('appointDate');
    if (appointDateInput) {
        const today = new Date().toISOString().split('T')[0];
        appointDateInput.min = today;
        appointDateInput.value = today;
    }

    // -------------------------------------------------------------------------
    // 2. Toast Notification Helper
    // -------------------------------------------------------------------------
    function showToast(title, message, type = 'success', duration = 4500) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconClass = 'fa-solid fa-circle-check';
        if (type === 'danger') iconClass = 'fa-solid fa-triangle-exclamation';
        if (type === 'info') iconClass = 'fa-solid fa-circle-info';

        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-msg">${message}</div>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // -------------------------------------------------------------------------
    // 3. Theme Toggle (Light / Dark Mode with LocalStorage)
    // -------------------------------------------------------------------------
    const savedTheme = localStorage.getItem('carepulse_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            if (isDark) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('carepulse_theme', 'dark');
                showToast('Dark Mode Enabled', 'Comfortable viewing for low-light clinical environments.', 'info', 2500);
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('carepulse_theme', 'light');
                showToast('Light Mode Enabled', 'Standard daylight clinical view active.', 'info', 2500);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. Mobile Navigation Menu Toggle
    // -------------------------------------------------------------------------
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('active');
        });

        // Close menu upon navigation click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 5. Scroll Header Shadow & Back to Top Button
    // -------------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollY > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------------------
    // 6. Modal Handlers (Appointment & Portal Login)
    // -------------------------------------------------------------------------
    function openModal(modalElement) {
        if (!modalElement) return;
        modalElement.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalElement) {
        if (!modalElement) return;
        modalElement.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Appointment triggers
    const bookingTriggers = [navBookAppointmentBtn, heroBookBtn, mobileBookBtn];
    bookingTriggers.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(appointmentModal);
            });
        }
    });

    // Delegated triggers (from Department and Card buttons)
    openBookingTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const dept = trigger.getAttribute('data-dept');
            if (dept) {
                const deptSelect = document.getElementById('appointDept');
                if (deptSelect) deptSelect.value = dept;
            }
            openModal(appointmentModal);
        });
    });

    // Doctor profile "Book Now" buttons
    const bookDoctorBtns = document.querySelectorAll('.book-doctor-btn');
    bookDoctorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const docName = btn.getAttribute('data-doc-name');
            const dept = btn.getAttribute('data-dept');

            const deptSelect = document.getElementById('appointDept');
            const docSelect = document.getElementById('appointDoctor');

            if (deptSelect && dept) deptSelect.value = dept;
            if (docSelect && docName) {
                for (let option of docSelect.options) {
                    if (option.value.includes(docName)) {
                        docSelect.value = option.value;
                        break;
                    }
                }
            }
            openModal(appointmentModal);
        });
    });

    if (closeAppointmentModal) {
        closeAppointmentModal.addEventListener('click', () => closeModal(appointmentModal));
    }

    // Portal Login triggers
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => openModal(loginModal));
    }
    if (explorePortalBtn) {
        explorePortalBtn.addEventListener('click', () => openModal(loginModal));
    }
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    }

    // Close on backdrop click
    [appointmentModal, loginModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(appointmentModal);
            closeModal(loginModal);
        }
    });

    // -------------------------------------------------------------------------
    // 7. Role Switcher in Login Modal
    // -------------------------------------------------------------------------
    const roleTabs = document.querySelectorAll('.role-tab');
    let currentRole = 'patient';
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            roleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentRole = tab.getAttribute('data-role');

            const portalIdInput = document.getElementById('portalId');
            if (portalIdInput) {
                if (currentRole === 'patient') {
                    portalIdInput.placeholder = 'e.g. PAT-9821 or user@example.com';
                } else if (currentRole === 'doctor') {
                    portalIdInput.placeholder = 'e.g. DOC-501 or dr.mitchell@hospital.org';
                } else {
                    portalIdInput.placeholder = 'e.g. ADMIN-04 or staff@hospital.org';
                }
            }
        });
    });

    // -------------------------------------------------------------------------
    // 8. Appointment Form Submission
    // -------------------------------------------------------------------------
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patientName').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            const dept = document.getElementById('appointDept').value;
            const doctor = document.getElementById('appointDoctor').value;
            const date = document.getElementById('appointDate').value;
            const time = document.getElementById('appointTime').value;

            // Generate an instant simulated OPD Token
            const randomTokenNum = Math.floor(1000 + Math.random() * 9000);
            const tokenCode = `OPD-${dept ? dept.substring(0, 4).toUpperCase() : 'GEN'}-${randomTokenNum}`;

            closeModal(appointmentModal);
            appointmentForm.reset();

            // Display success notification
            showToast(
                `Appointment Confirmed: ${tokenCode}`,
                `Dear ${name}, your slot on ${date} at ${time} with ${doctor} is booked. An SMS pass has been sent to ${phone}.`,
                'success',
                7000
            );
        });
    }

    // -------------------------------------------------------------------------
    // 9. Portal Login Form Submission
    // -------------------------------------------------------------------------
    if (portalLoginForm) {
        portalLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('portalId').value.trim();

            closeModal(loginModal);
            portalLoginForm.reset();

            showToast(
                `Welcome to ${currentRole.toUpperCase()} Dashboard`,
                `Authenticated successfully as ${id}. Redirecting to secure HMS terminal...`,
                'info',
                5000
            );
        });
    }

    // -------------------------------------------------------------------------
    // 10. Department Filter Chips
    // -------------------------------------------------------------------------
    const filterChips = document.querySelectorAll('.filter-chip');
    const deptCards = document.querySelectorAll('.dept-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-filter');

            deptCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 11. Doctor Specialty Filters
    // -------------------------------------------------------------------------
    const docFilters = document.querySelectorAll('.doc-filter');
    const doctorCards = document.querySelectorAll('.doctor-card');

    docFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            docFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const targetSpec = filter.getAttribute('data-doc-filter');

            doctorCards.forEach(card => {
                const spec = card.getAttribute('data-specialty');
                if (targetSpec === 'all' || spec === targetSpec) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 12. Interactive BMI & Wellness Calculator
    // -------------------------------------------------------------------------
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const heightCm = parseFloat(document.getElementById('bmiHeight').value);
            const weightKg = parseFloat(document.getElementById('bmiWeight').value);

            if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
                showToast('Input Error', 'Please enter valid height and weight values.', 'danger');
                return;
            }

            const heightM = heightCm / 100;
            const bmi = (weightKg / (heightM * heightM)).toFixed(1);

            const scoreText = document.getElementById('bmiScoreText');
            const statusText = document.getElementById('bmiStatusText');
            const adviceText = document.getElementById('bmiAdviceText');
            const pointer = document.getElementById('bmiPointer');

            if (scoreText) scoreText.textContent = bmi;

            // Determine health status category and pointer position (0% - 100%)
            let status = '';
            let advice = '';
            let statusColor = '';
            let pointerPos = 50;

            if (bmi < 18.5) {
                status = 'Underweight';
                statusColor = '#38bdf8';
                advice = 'Your BMI indicates you may be underweight. We suggest consulting our clinical nutrition specialists for a personalized meal and weight gain plan.';
                pointerPos = Math.min(Math.max((bmi / 18.5) * 25, 5), 24);
            } else if (bmi >= 18.5 && bmi < 25) {
                status = 'Normal & Healthy Weight';
                statusColor = '#10b981';
                advice = 'Congratulations! Your BMI falls in the optimal healthy weight category. Continue your balanced diet and regular physical exercise.';
                pointerPos = 25 + ((bmi - 18.5) / 6.5) * 25;
            } else if (bmi >= 25 && bmi < 30) {
                status = 'Overweight';
                statusColor = '#f59e0b';
                advice = 'Your BMI falls into the overweight category. Incorporating 30 minutes of cardiovascular exercise daily and consulting a preventive physician is recommended.';
                pointerPos = 50 + ((bmi - 25) / 5) * 25;
            } else {
                status = 'Obese (High Health Risk)';
                statusColor = '#ef4444';
                advice = 'Your BMI indicates obesity, which increases risks of hypertension, cardiac stress, and diabetes. Our multidisciplinary lifestyle management clinic can help.';
                pointerPos = Math.min(75 + ((bmi - 30) / 10) * 25, 95);
            }

            if (statusText) {
                statusText.textContent = status;
                statusText.style.color = statusColor;
            }
            if (adviceText) {
                adviceText.textContent = advice;
            }
            if (pointer) {
                pointer.style.left = `${pointerPos}%`;
            }

            showToast('BMI Calculated', `Your BMI is ${bmi} (${status}). Check recommendation below.`, 'info');
        });
    }

    // -------------------------------------------------------------------------
    // 13. FAQ Accordion Interaction
    // -------------------------------------------------------------------------
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close other items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // -------------------------------------------------------------------------
    // 14. Newsletter Subscription Form
    // -------------------------------------------------------------------------
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim();

            if (email) {
                showToast(
                    'Subscribed to Health Bulletins',
                    `Thank you! Updates and health tips will be sent to ${email}.`,
                    'success'
                );
                newsletterForm.reset();
            }
        });
    }

    // -------------------------------------------------------------------------
    // 15. Animated Number Counters (Scroll-Triggered)
    // -------------------------------------------------------------------------
    const counterElements = document.querySelectorAll('.counter-num');
    let hasAnimated = false;

    function runCounters() {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const steps = 50;
            const stepValue = Math.ceil(target / steps);
            let current = 0;

            const timer = setInterval(() => {
                current += stepValue;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = current.toLocaleString();
                }
            }, duration / steps);
        });
    }

    if (counterElements.length > 0 && 'IntersectionObserver' in window) {
        const counterSection = document.querySelector('.about-counter-grid');
        if (counterSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        runCounters();
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(counterSection);
        }
    } else {
        // Fallback
        runCounters();
    }

    // -------------------------------------------------------------------------
    // 16. Live Telemetry Real-time Clock Simulation
    // -------------------------------------------------------------------------
    const liveClock = document.getElementById('liveClock');
    if (liveClock) {
        function updateLiveClock() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            liveClock.textContent = `Sync: ${timeStr}`;
        }
        updateLiveClock();
        setInterval(updateLiveClock, 1000);
    }

    // -------------------------------------------------------------------------
    // 17. Active Nav Link on Scroll
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNavOnScroll);
});

// DOM elements
        const signupButton = document.getElementById('signupButton');
        const signupError = document.getElementById('signupError');

        // Error handling
        function showError(message) {
            signupError.textContent = message;
            signupError.style.display = 'block';
        }

        function hideError() {
            signupError.style.display = 'none';
        }

        // Clear error when user starts typing
        const inputFields = ['fullName', 'email', 'signupUsername', 'signupPassword', 'confirmPassword'];
        inputFields.forEach(id => {
            document.getElementById(id).addEventListener('input', hideError);
        });
        document.getElementById('acceptTerms').addEventListener('change', hideError);

        // Set loading state
        function setLoadingState(isLoading) {
            if (isLoading) {
                signupButton.textContent = 'CREATING ACCOUNT...';
                signupButton.disabled = true;
                signupButton.style.opacity = '0.6';
                signupButton.style.cursor = 'not-allowed';
            } else {
                signupButton.textContent = 'CREATE ACCOUNT';
                signupButton.disabled = false;
                signupButton.style.opacity = '1';
                signupButton.style.cursor = 'pointer';
            }
        }

        // Signup validation
        function validateSignupForm() {
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const acceptTerms = document.getElementById('acceptTerms').checked;

            if (!fullName) {
                showError('Full name is required');
                return false;
            }
            if (!email) {
                showError('Email is required');
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                showError('Please enter a valid email address');
                return false;
            }
            if (!username) {
                showError('Username is required');
                return false;
            }
            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return false;
            }
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return false;
            }
            if (!acceptTerms) {
                showError('You must accept the terms and conditions');
                return false;
            }
            return true;
        }

        // Signup handler
        async function handleSignup() {
            if (!validateSignupForm()) return;

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;

            setLoadingState(true);
            hideError();

            try {
                const response = await fetch('http://localhost:3000/registerUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        fullname: fullName,
                        username: username,
                        email: email,
                        password: password
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Success - show message and redirect to login
                    alert(data.message || 'Registration successful! Please log in.');
                    window.location.href = 'login.html';
                } else {
                    // Handle error response
                    showError(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showError('Network error. Please check your connection and try again.');
            } finally {
                setLoadingState(false);
            }
        }

        // Event listener for form submission
        signupButton.addEventListener('click', handleSignup);

        // Handle Enter key press
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSignup();
            }
        });
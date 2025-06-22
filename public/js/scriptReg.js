// Form validation and handling
document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("registrationForm");
	const submitButton = document.getElementById("signupButton");
	const buttonText = document.getElementById("buttonText");
	const errorMessage = document.getElementById("errorMessage");

	// Validation rules
	const validationRules = {
		fullName: {
			required: true,
			minLength: 2,
			pattern: /^[a-zA-Z\s'-]+$/,
			message:
				"Full name must contain only letters, spaces, hyphens, and apostrophes (minimum 2 characters)",
		},
		email: {
			required: true,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: "Please enter a valid email address",
		},
		username: {
			required: true,
			minLength: 3,
			maxLength: 20,
			pattern: /^[a-zA-Z0-9_]+$/,
			message:
				"Username must be 3-20 characters and contain only letters, numbers, and underscores",
		},
		password: {
			required: true,
			minLength: 5,
			message: "Password must be at least 5 characters",
		},
		confirmPassword: {
			required: true,
			match: "password",
			message: "Passwords do not match",
		},
	};

	// Validate individual field
	function validateField(fieldName, value) {
		const rules = validationRules[fieldName];
		if (!rules) return { isValid: true };

		// Required check
		if (rules.required && !value.trim()) {
			return {
				isValid: false,
				message: `${getFieldDisplayName(fieldName)} is required`,
			};
		}

		// Skip other validations if field is empty and not required
		if (!value.trim()) {
			return { isValid: true };
		}

		// Minimum length check
		if (rules.minLength && value.length < rules.minLength) {
			return { isValid: false, message: rules.message };
		}

		// Maximum length check
		if (rules.maxLength && value.length > rules.maxLength) {
			return { isValid: false, message: rules.message };
		}

		// Pattern check
		if (rules.pattern && !rules.pattern.test(value)) {
			return { isValid: false, message: rules.message };
		}

		// Password match check
		if (rules.match) {
			const matchField = document.getElementById(
				rules.match === "password" ? "signupPassword" : rules.match
			);
			if (matchField && value !== matchField.value) {
				return { isValid: false, message: rules.message };
			}
		}

		return { isValid: true, message: getSuccessMessage(fieldName) };
	}

	// Get display name for field
	function getFieldDisplayName(fieldName) {
		const displayNames = {
			fullName: "Full name",
			email: "Email",
			username: "Username",
			password: "Password",
			confirmPassword: "Password confirmation",
		};
		return displayNames[fieldName] || fieldName;
	}

	// Get success message for field
	function getSuccessMessage(fieldName) {
		const successMessages = {
			fullName: "Valid name",
			email: "Valid email address",
			username: "Username looks good",
			password: "Strong password",
			confirmPassword: "Passwords match",
		};
		return successMessages[fieldName] || "Valid";
	}

	// Update field UI based on validation
	function updateFieldUI(fieldId, validation) {
		const field = document.getElementById(fieldId);
		const icon = document.getElementById(fieldId + "Icon");
		const errorDiv = document.getElementById(fieldId + "Error");
		const successDiv = document.getElementById(fieldId + "Success");

		// Reset classes and visibility
		field.classList.remove("valid", "invalid");
		if (icon) {
			icon.classList.remove("success", "error");
			icon.style.display = "none";
		}
		if (errorDiv) {
			errorDiv.style.display = "none";
		}
		if (successDiv) {
			successDiv.style.display = "none";
		}

		if (field.value.trim()) {
			if (validation.isValid) {
				field.classList.add("valid");
				if (icon) {
					icon.classList.add("success");
					icon.innerHTML = "✓";
					icon.style.display = "block";
				}
				if (successDiv) {
					successDiv.textContent = validation.message;
					successDiv.style.display = "block";
				}
			} else {
				field.classList.add("invalid");
				if (icon) {
					icon.classList.add("error");
					icon.innerHTML = "✗";
					icon.style.display = "block";
				}
				if (errorDiv) {
					errorDiv.textContent = validation.message;
					errorDiv.style.display = "block";
				}

				// Add shake animation for error
				field.classList.add("shake");
				setTimeout(() => field.classList.remove("shake"), 500);
			}
		}
	}

	// Add real-time validation to all fields
	const fieldMappings = [
		{ id: "fullName", name: "fullName" },
		{ id: "email", name: "email" },
		{ id: "signupUsername", name: "username" },
		{ id: "signupPassword", name: "password" },
		{ id: "confirmPassword", name: "confirmPassword" },
	];

	fieldMappings.forEach(({ id, name }) => {
		const field = document.getElementById(id);
		if (!field) return;

		field.addEventListener("input", function () {
			const validation = validateField(name, this.value);
			updateFieldUI(id, validation);

			// Revalidate confirm password if password changes
			if (name === "password") {
				const confirmField = document.getElementById("confirmPassword");
				if (confirmField && confirmField.value) {
					const confirmValidation = validateField(
						"confirmPassword",
						confirmField.value
					);
					updateFieldUI("confirmPassword", confirmValidation);
				}
			}
		});

		field.addEventListener("blur", function () {
			if (!this.value.trim() && validationRules[name]?.required) {
				const validation = {
					isValid: false,
					message: `${getFieldDisplayName(name)} is required`,
				};
				updateFieldUI(id, validation);
			}
		});

		// Clear validation on focus
		field.addEventListener("focus", function () {
			if (this.classList.contains("invalid")) {
				this.classList.remove("invalid");
				const errorDiv = document.getElementById(id + "Error");
				if (errorDiv) errorDiv.style.display = "none";
			}
		});
	});

	// Form submission with enhanced validation
	form.addEventListener("submit", function (e) {
		// Hide previous messages
		if (errorMessage) errorMessage.style.display = "none";
		const serverError = document.getElementById("serverError");
		if (serverError) serverError.style.display = "none";

		// Validate all fields
		let isFormValid = true;
		const validationErrors = [];

		fieldMappings.forEach(({ id, name }) => {
			const field = document.getElementById(id);
			if (field) {
				const validation = validateField(name, field.value);
				updateFieldUI(id, validation);

				if (!validation.isValid) {
					isFormValid = false;
					validationErrors.push(validation.message);
				}
			}
		});

		// Check terms acceptance
		const termsCheckbox = document.getElementById("acceptTerms");
		if (termsCheckbox && !termsCheckbox.checked) {
			isFormValid = false;
			validationErrors.push("Please accept the Terms and Conditions");
		}

		if (!isFormValid) {
			e.preventDefault(); // Only prevent if validation fails
			showError(
				validationErrors[0] || "Please fill in all required fields correctly"
			);
			return false;
		}

		// Show loading state but allow form to submit
		if (submitButton && buttonText) {
			submitButton.disabled = true;
			buttonText.innerHTML =
				'<span class="loading-spinner"></span>Creating Account...';
		}

		// Let the form submit naturally - don't prevent default here
		return true;
	});

	// Utility functions
	function showError(message) {
		if (errorMessage) {
			errorMessage.textContent = message;
			errorMessage.style.display = "block";
			errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
		}
		resetButton();
	}

	function resetButton() {
		if (submitButton && buttonText) {
			submitButton.disabled = false;
			buttonText.innerHTML = "CREATE ACCOUNT";
		}
	}

	// Auto-hide server messages after 5 seconds
	const serverError = document.getElementById("serverError");
	const successMessage = document.getElementById("successMessage");

	if (serverError && serverError.style.display !== "none") {
		setTimeout(() => {
			serverError.style.display = "none";
		}, 5000);
	}

	if (successMessage && successMessage.style.display !== "none") {
		setTimeout(() => {
			window.location.href = "/loginUser";
		}, 2000);
	}

	// Prevent form resubmission on page refresh
	if (window.history.replaceState) {
		window.history.replaceState(null, null, window.location.href);
	}
});

// Password toggle functionality
document.addEventListener("DOMContentLoaded", function () {
	// Eye icons SVG markup
	const eyeOpenSVG = `
                <svg class="eye-open" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
            `;

	const eyeClosedSVG = `
                <svg class="eye-closed" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
            `;

	// Toggle for main password field
	const togglePassword = document.getElementById("togglePassword");
	const passwordField = document.getElementById("signupPassword");

	togglePassword.addEventListener("click", function () {
		const type =
			passwordField.getAttribute("type") === "password" ? "text" : "password";
		passwordField.setAttribute("type", type);

		// Change icon based on visibility
		this.innerHTML = type === "password" ? eyeOpenSVG : eyeClosedSVG;
	});

	// Toggle for confirm password field
	const toggleConfirmPassword = document.getElementById(
		"toggleConfirmPassword"
	);
	const confirmPasswordField = document.getElementById("confirmPassword");

	toggleConfirmPassword.addEventListener("click", function () {
		const type =
			confirmPasswordField.getAttribute("type") === "password"
				? "text"
				: "password";
		confirmPasswordField.setAttribute("type", type);

		// Change icon based on visibility
		this.innerHTML = type === "password" ? eyeOpenSVG : eyeClosedSVG;
	});
});

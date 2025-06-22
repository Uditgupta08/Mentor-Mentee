// // DOM elements
// const loginButton = document.getElementById("loginButton");
// const loginError = document.getElementById("loginError");

// // Error handling
// function showError(message) {
// 	loginError.textContent = message;
// 	loginError.style.display = "block";
// }

// function hideError() {
// 	loginError.style.display = "none";
// }

// // Clear error when user starts typing
// document.getElementById("loginUsername").addEventListener("input", hideError);
// document.getElementById("loginPassword").addEventListener("input", hideError);

// // Set loading state
// function setLoadingState(isLoading) {
// 	if (isLoading) {
// 		loginButton.textContent = "SIGNING IN...";
// 		loginButton.disabled = true;
// 		loginButton.style.opacity = "0.6";
// 		loginButton.style.cursor = "not-allowed";
// 	} else {
// 		loginButton.textContent = "SIGN IN";
// 		loginButton.disabled = false;
// 		loginButton.style.opacity = "1";
// 		loginButton.style.cursor = "pointer";
// 	}
// }

// // Login handler
// async function handleLogin() {
// 	const username = document.getElementById("loginUsername").value.trim();
// 	const password = document.getElementById("loginPassword").value;

// 	if (!username || !password) {
// 		showError("Please fill in all required fields");
// 		return;
// 	}

// 	setLoadingState(true);
// 	hideError();

// 	try {
// 		const response = await fetch("http://localhost:3000/loginUser", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				Accept: "application/json",
// 			},
// 			credentials: "include",
// 			body: JSON.stringify({
// 				username: username,
// 				password: password,
// 			}),
// 		});

// 		const data = await response.json();

// 		if (response.ok && data.success) {
// 			// Success - redirect to dashboard or success page
// 			setTimeout(() => {
// 				window.location.href = "/success";
// 			}, 100);
// 		} else {
// 			// Handle error response
// 			showError(data.message || "Login failed. Please try again.");
// 		}
// 	} catch (error) {
// 		console.error("Login error:", error);
// 		showError("Network error. Please check your connection and try again.");
// 	} finally {
// 		setLoadingState(false);
// 	}
// }

// // Event listener for form submission
// loginButton.addEventListener("click", handleLogin);

// // Handle Enter key press
// document.addEventListener("keypress", (e) => {
// 	if (e.key === "Enter") {
// 		handleLogin();
// 	}
// });

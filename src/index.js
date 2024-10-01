document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration');
    const loginForm = document.getElementById('login');
    const errorDisplay = document.getElementById('errorDisplay');

    // Registration form submission
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const username = this.username.value.trim();
        const email = this.email.value.trim().toLowerCase();
        const password = this.password.value;
        const passwordCheck = this.passwordCheck.value;
        const termsAccepted = this.terms.checked;

        let errors = [];
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Username validation
        if (!username) {
            errors.push("Username cannot be blank.");
        } else if (username.length < 4) {
            errors.push("Username must be at least four characters long.");
        } else if (username.length >= 4) {
            const uniqueChars = new Set(username);
            if (uniqueChars.size < 2) {
                errors.push("Username must contain at least two unique characters.");
            }
            if (/[^a-zA-Z0-9]/.test(username)) {
                errors.push("Username cannot contain special characters or whitespace.");
            }
            if (existingUsers.some(user => user.username === username.toLowerCase())) {
                errors.push("That username is already taken.");
            }
        }

        // Email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push("Email must be a valid email address.");
        } else if (email.endsWith("@example.com")) {
            errors.push("Email cannot be from the domain 'example.com'.");
        }

        // Password validation
        if (password.length < 12) {
            errors.push("Passwords must be at least 12 characters long.");
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
            errors.push("Passwords must have at least one uppercase and one lowercase letter.");
        }
        if (!/\d/.test(password)) {
            errors.push("Passwords must contain at least one number.");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Passwords must contain at least one special character.");
        }
        if (password.toLowerCase().includes("password")) {
            errors.push("Passwords cannot contain the word 'password'.");
        }
        if (password.toLowerCase().includes(username.toLowerCase())) {
            errors.push("Passwords cannot contain the username.");
        }
        if (password !== passwordCheck) {
            errors.push("Both passwords must match.");
        }

        // Terms and conditions validation
        if (!termsAccepted) {
            errors.push("You must accept the terms and conditions.");
        }

        // Display errors
        if (errors.length > 0) {
            errorDisplay.innerHTML = errors.join('<br />');
            errorDisplay.style.display = 'block';
            errorDisplay.style.color = 'red';
            this.username.focus(); // Set focus back to the username input
            return;
        }

        // If all validations pass
        const userData = {
            username: username.toLowerCase(),
            email: email,
            password: password
        };
        existingUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Clear the form fields and show success message
        this.reset();
        errorDisplay.innerHTML = "Registration successful!";
        errorDisplay.style.color = "green";
        errorDisplay.style.display = 'block';
    });

    // Login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const username = this.username.value.trim();
        const password = this.password.value;
        let errors = [];
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Username validation
        if (!username) {
            errors.push("Username cannot be blank.");
        } else if (!existingUsers.some(user => user.username === username.toLowerCase())) {
            errors.push("Username does not exist.");
        }

        // Password validation
        if (!password) {
            errors.push("Password cannot be blank.");
        } else {
            const user = existingUsers.find(user => user.username === username.toLowerCase());
            if (user && user.password !== password) {
                errors.push("Password is incorrect.");
            }
        }

        // Display errors
        if (errors.length > 0) {
            errorDisplay.innerHTML = errors.join('<br />');
            errorDisplay.style.display = 'block';
            errorDisplay.style.color = 'red';
            this.username.focus(); // Set focus back to the username input
            return;
        }

        // If all validations pass
        const keepLoggedIn = this.persist.checked;
        this.reset(); // Clear the form fields
        errorDisplay.innerHTML = keepLoggedIn 
            ? "Login successful! You will be kept logged in." 
            : "Login successful!";
        errorDisplay.style.color = "green";
        errorDisplay.style.display = 'block';
    });
});

// Still have some isssues using localStorage with encrypted passwords, probably need to fix this, or not using the CodeSandBox
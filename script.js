document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('strength-meter-fill');
    const strengthLabel = document.getElementById('strength-label');
    const suggestionsDiv = document.getElementById('suggestions');
    const suggestionsList = document.getElementById('suggestions-list');
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const resetBtn = document.getElementById('reset-btn');

    toggleBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = 'HIDE';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = 'SHOW';
        }
    });

    resetBtn.addEventListener('click', function() {
        passwordInput.value = '';
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '';
        strengthLabel.textContent = 'Password Strength';
        suggestionsDiv.style.display = 'none';
    });

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        evaluatePasswordStrength(password);
    });

    function evaluatePasswordStrength(password) {
        let score = 0;
        let suggestions = [];
        const username = document.getElementById('username')?.value;

        if (username && password.toLowerCase().includes(username.toLowerCase())) {
            strengthBar.style.width = '20%';
            strengthBar.style.backgroundColor = 'red';
            strengthLabel.textContent = 'Weak Password';
            suggestionsList.innerHTML = '<li>Your password should not include your username</li>';
            suggestionsDiv.style.display = 'block';
            return;
        }

        if (password.length === 0) {
            strengthBar.style.width = '0%';
            strengthLabel.textContent = 'Password Strength';
            suggestionsDiv.style.display = 'none';
            return;
        }

        if (password.length < 8) {
            suggestions.push("Password should be at least 8 characters long");
        } else if (password.length < 12) {
            score += 20;
            suggestions.push("Consider making your password 12+ characters for better security");
        } else {
            score += 40;
        }

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);

        if (hasLower) score += 5;
        if (hasUpper) score += 10;
        if (hasNumber) score += 5;
        if (hasSpecial) score += 10;

        if (!hasLower) suggestions.push("Add lowercase letters");
        if (!hasUpper) suggestions.push("Add uppercase letters");
        if (!hasNumber) suggestions.push("Add numbers");
        if (!hasSpecial) suggestions.push("Add special characters (!@#$%^&*)");

        const commonPasswords = [
            '123456', 'password', '12345678', 'qwerty', '12345',
            '123456789', '1234', '1234567', '111111', '123123'
        ];

        if (commonPasswords.includes(password.toLowerCase())) {
            score = 0;
            suggestions = ["This password is too common - choose something more unique"];
        }

        score = Math.min(100, Math.max(0, score));
        strengthBar.style.width = score + '%';

        if (score < 40) {
            strengthBar.style.backgroundColor = 'red';
            strengthLabel.textContent = 'Weak Password';
        } else if (score < 70) {
            strengthBar.style.backgroundColor = 'orange';
            strengthLabel.textContent = 'Moderate Password';
        } else {
            strengthBar.style.backgroundColor = 'green';
            strengthLabel.textContent = 'Strong Password!';
        }

        if (suggestions.length > 0) {
            suggestionsList.innerHTML = '';
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    }
});

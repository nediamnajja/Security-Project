import re
import math

class PasswordChecker:
    def __init__(self):
        try:
            with open('top-10000-passwords.txt', 'r') as f:
                self.common_passwords = set(line.strip() for line in f)
        except FileNotFoundError:
            self.common_passwords = {
                '123456', 'password', '12345678', 'qwerty', '12345',
                '123456789', '1234', '1234567', '111111', '123123'
            }

    def calculate_entropy(self, password):
        if not password:
            return 0
        pool_size = 0
        if re.search(r'[a-z]', password): pool_size += 26
        if re.search(r'[A-Z]', password): pool_size += 26
        if re.search(r'[0-9]', password): pool_size += 10
        if re.search(r'[^a-zA-Z0-9]', password): pool_size += 32
        if pool_size == 0: return 0
        return len(password) * math.log2(pool_size)

    def check_password(self, password, username=None):
        result = {
            'score': 0,
            'message': '',
            'suggestions': []
        }

        if not password:
            result['message'] = 'Enter a password'
            return result

        if len(password) < 8:
            result['message'] = 'Too short (min 8 chars)'
            result['suggestions'].append('Password should be at least 8 characters')
        elif len(password) < 12:
            result['score'] += 20
            result['suggestions'].append('Consider 12+ characters for better security')
        else:
            result['score'] += 40

        checks = {
            'lower': bool(re.search(r'[a-z]', password)),
            'upper': bool(re.search(r'[A-Z]', password)),
            'number': bool(re.search(r'[0-9]', password)),
            'special': bool(re.search(r'[^a-zA-Z0-9]', password))
        }

        if checks['lower']: result['score'] += 5
        if checks['upper']: result['score'] += 10
        if checks['number']: result['score'] += 5
        if checks['special']: result['score'] += 10

        for check, passed in checks.items():
            if not passed:
                result['suggestions'].append(f'Add {check} characters')

        if password.lower() in self.common_passwords:
            result['score'] = max(0, result['score'] - 30)
            result['suggestions'].append('This password is too common')

        if username and username.lower() in password.lower():
            result['score'] = max(0, result['score'] - 20)
            result['suggestions'].append("Don't use your username in your password")

        entropy = self.calculate_entropy(password)
        if entropy < 28:
            result['score'] = max(0, result['score'] - 10)
            result['suggestions'].append('Password is too predictable')
        elif entropy < 36:
            pass
        elif entropy < 60:
            result['score'] += 10
        else:
            result['score'] += 20

        result['score'] = min(100, max(0, result['score']))
        if result['score'] < 40:
            result['message'] = 'Weak password'
        elif result['score'] < 70:
            result['message'] = 'Moderate password'
        else:
            result['message'] = 'Strong password!'
        return result

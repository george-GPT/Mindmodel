import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

# Validation Constants
PASSWORD_VALIDATION = {
    "MIN_LENGTH": 8,
    "MAX_LENGTH": 128,
    "REQUIRE_NUMBERS": True,
    "REQUIRE_SPECIAL": True
}

USERNAME_VALIDATION = {
    "MIN_LENGTH": 3,
    "MAX_LENGTH": 30,
    "PATTERN": r"^[a-zA-Z0-9_-]*$"
}

EMAIL_VALIDATION = {
    "MAX_LENGTH": 255,
    "PATTERN": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
}

META_VALIDATION = {
    "theme": ["light", "dark"],
    "notifications": bool,
    "language": str,
    "custom": dict,
}

def validate_password_strength(password: str) -> None:
    """
    Validate password strength according to requirements.
    Raises ValidationError if password is invalid.
    """
    if len(password) < PASSWORD_VALIDATION["MIN_LENGTH"]:
        raise ValidationError(
            _("Password must be at least %(min_length)d characters long."),
            code='password_too_short',
            params={'min_length': PASSWORD_VALIDATION["MIN_LENGTH"]},
        )
    
    if len(password) > PASSWORD_VALIDATION["MAX_LENGTH"]:
        raise ValidationError(
            _("Password must not exceed %(max_length)d characters."),
            code='password_too_long',
            params={'max_length': PASSWORD_VALIDATION["MAX_LENGTH"]},
        )

    if PASSWORD_VALIDATION["REQUIRE_NUMBERS"] and not any(char.isdigit() for char in password):
        raise ValidationError(
            _("Password must include at least one number."),
            code='password_no_number',
        )

    if PASSWORD_VALIDATION["REQUIRE_SPECIAL"] and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError(
            _("Password must include at least one special character."),
            code='password_no_special',
        )

def validate_username(username: str) -> None:
    """
    Validate username according to requirements.
    Raises ValidationError if username is invalid.
    """
    if len(username) < USERNAME_VALIDATION["MIN_LENGTH"]:
        raise ValidationError(
            _("Username must be at least %(min_length)d characters long."),
            code='username_too_short',
            params={'min_length': USERNAME_VALIDATION["MIN_LENGTH"]},
        )

    if len(username) > USERNAME_VALIDATION["MAX_LENGTH"]:
        raise ValidationError(
            _("Username must not exceed %(max_length)d characters."),
            code='username_too_long',
            params={'max_length': USERNAME_VALIDATION["MAX_LENGTH"]},
        )

    if not re.match(USERNAME_VALIDATION["PATTERN"], username):
        raise ValidationError(
            _("Username may only contain letters, numbers, underscores, and hyphens."),
            code='invalid_username_format',
        )

def validate_email(email: str) -> None:
    """
    Validate email according to requirements.
    Raises ValidationError if email is invalid.
    """
    if len(email) > EMAIL_VALIDATION["MAX_LENGTH"]:
        raise ValidationError(
            _("Email must not exceed %(max_length)d characters."),
            code='email_too_long',
            params={'max_length': EMAIL_VALIDATION["MAX_LENGTH"]},
        )

    if not re.match(EMAIL_VALIDATION["PATTERN"], email):
        raise ValidationError(
            _("Please enter a valid email address."),
            code='invalid_email_format',
        )

def validate_meta(meta: dict) -> None:
    """
    Validate user meta data according to requirements.
    Raises ValidationError if meta data is invalid.
    """
    if 'theme' in meta and meta['theme'] not in META_VALIDATION["theme"]:
        raise ValidationError(
            _("Theme must be either 'light' or 'dark'."),
            code='invalid_theme',
        )

    if 'notifications' in meta and not isinstance(meta['notifications'], bool):
        raise ValidationError(
            _("Notifications must be a boolean value."),
            code='invalid_notifications',
        )

    if 'language' in meta and not isinstance(meta['language'], str):
        raise ValidationError(
            _("Language must be a valid language code."),
            code='invalid_language',
        )

    if 'custom' in meta and not isinstance(meta['custom'], dict):
        raise ValidationError(
            _("Custom settings must be a dictionary."),
            code='invalid_custom',
        )

def validate_password_history(user, password: str) -> None:
    """Validate password hasn't been used recently"""
    from .models import PasswordHistory
    
    if PasswordHistory.password_was_used(user, password):
        raise ValidationError(
            'This password has been used recently. Please choose a different one.'
        )
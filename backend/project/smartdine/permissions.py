from rest_framework.permissions import BasePermission

class IsStaffRole(BasePermission):
    """
    Allow access only to authenticated users with a specific role (or roles).
    Provide allowed roles list as view.allowed_roles = ['admin','kitchen'] or via init.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        allowed = getattr(view, "allowed_roles", None)
        if not allowed:
            # If allowed_roles not defined, default to authenticated staff (any role)
            return request.user.is_active and not request.user.is_superuser
        return getattr(request.user, "role", None) in allowed or request.user.is_superuser
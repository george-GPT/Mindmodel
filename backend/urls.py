from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

# Add root redirect function
def redirect_to_admin(request):
    return redirect('admin/')

# Update root URL conf
ROOT_URLCONF = 'mindmodel.core.urls'

urlpatterns = [
    # Root path redirects to admin
    path('', redirect_to_admin),
    
    # Existing paths
    path('admin/', admin.site.urls),
    path('api/users/auth/', include('apps.users.urls')),
    path('api/games/', include('apps.games.urls')),
    path('api/surveys/', include('apps.surveys.urls')),
    path('api/ai/', include('apps.ai.urls')),
    
    # OpenAPI 3 documentation with Swagger UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Add this for media files if needed
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
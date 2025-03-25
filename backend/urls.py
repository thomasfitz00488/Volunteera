from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import login_view, google_login_callback, register_volunteer, register_organization
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/charity-search/', views.charity_search, name='charity_search'),
    path('api/charity-details/<int:reg_number>/<int:suffix>/', views.charity_details, name='charity_details'),
    path('api/charity-details/<int:reg_number>/', views.charity_details, name='charity_details_no_suffix'),

    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    path('api/auth/login/', login_view),    # tested
    path('api/auth/google/callback/', google_login_callback), # testing done manually, cannot get working automated due to refresh token
    path('api/auth/volunteer/register/', register_volunteer), # testing done manually, cannot get working automated due to refresh token
    path('api/auth/organization/register/', register_organization), # testing done manually, cannot get working automated due to refresh token

    path('api/opportunities/', views.api_opportunity_list, name='api_opportunity_list'), # tested
    path('api/opportunities/<int:pk>/', views.api_opportunity_detail, name='api_opportunity_detail'), # tested
    path('api/opportunities/create/', views.api_create_opportunity, name='api_create_opportunity'), # tested
    path('api/opportunities/<int:id>/apply/', views.api_apply_opportunity, name='api_apply_opportunity'),
    path('api/opportunities/<int:id>/discussions/', views.api_discussions, name='api_discussions'), # tested
    

    
    
    path('api/categories/', views.api_list_categories), # tested
    path('api/interests/', views.api_list_interests), # tested

    path('api/message/<int:id>/remove/', views.api_remove_message),

    path('api/organization/stats/', views.api_organization_stats, name='api_organization_stats'), # tested
    path('api/organization/profile/', views.api_organization_profile, name='api_organization_profile'),

    path('api/volunteer/list/', views.api_volunteer_list, name='api_volunteer_list'), # tested 
    path('api/volunteers/pending/<int:id>/', views.api_volunteer_pending, name='api_volunteer_pending'), # tested
    path('api/volunteers/requested/<int:id>/', views.api_volunteer_requested, name='api_volunteer_requested'), # tested
    path('api/volunteer/<int:id>/', views.api_volunteer_detail, name='api_volunteer_detail'), # tested

    path('api/application/update/<int:id>/<slug:mode>/', views.api_application_update, name='api_application_update'),

    path('api/friendship/delete/<int:friend_id>/<int:volunteer_id>/', views.delete_friendship), # tested
    path('api/friendship/create/<int:friend_id>/<int:volunteer_id>/', views.create_friendship), # tested
    path('api/friendship/accept/<int:friend_id>/<int:volunteer_id>/', views.accept_friendship), # tested
    path('api/friendship/list/pending/', views.list_pending_friendships), # tested
]
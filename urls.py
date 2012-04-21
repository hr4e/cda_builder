from django.conf.urls.defaults import patterns, include, url
from cda_builder import views
#from cda_builder.patient import views
from django.views.static import * 
from django.conf import settings
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

#Dude, in here...just specify which url patterns should call
# which save function...

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'hr4e.views.home', name='home'),
    # url(r'^hr4e/', include('hr4e.foo.urls')),
    ('^cda_builder/$',views.index),
    ('^cda_builder/index.html$',views.index),
    ################CDA###########################
    #('^cda_builder/(?P<document>\w)$',views.edit_cda),
    ################Clinics#######################
    ('^cda_builder/all_clinics.html$',views.all_clinics),
    ('^cda_builder/add_clinic.html$',views.add_clinic),
    ################Patients######################
    ('^cda_builder/patient_manager.html$',views.patient_manager),
    ('^cda_builder/admin_settings.html$',views.admin_settings),
    ('^cda_builder/theme_settings.html$',views.theme_settings),
    ('^cda_builder/fun.html$',views.fun),
    ('^cda_builder/non.html$',views.non),
    ('^cda_builder/patient_search.html$',views.patient_search),
    ('^cda_builder/themes/hr4e/index.html$',views.load_clinic),
    #(r'^$',index),
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    #(r'^hr4e/*/$',save_patient),
    #('^hr4e/$',save_patient),
    #intake related URL patterns
    
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)



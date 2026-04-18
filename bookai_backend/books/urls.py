 

from django.urls import path
import books.views as views   # avoid circular import

urlpatterns = [
    path('', views.books),
    path('<int:pk>/', views.get_book),
    path('<int:pk>/recommend/', views.recommend_books),
    path('ask/', views.ask_question),
    path('scrape/', views.scrape_books_api),
]
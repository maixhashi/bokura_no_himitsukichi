from django.views.generic import TemplateView

class MainEntryView(TemplateView):
    template_name = "pages/main.html"  # templates/pages/top_page.html を指定

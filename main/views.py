from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def indiaMap(request):
    return render(request,'main/indiaMap.html',{})
def lobby(request):
    return render(request, './lobby.html', {})
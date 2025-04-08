from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
User = get_user_model()
from django.views.decorators.csrf import csrf_exempt
import json
from django.middleware.csrf import get_token
from rest_framework.authtoken.models import Token
from django.http import JsonResponse

@csrf_exempt
def register_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            role = data.get("role", "client")  # Default role: Client

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already taken"}, status=400)

            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=role
            )

            return JsonResponse({"message": "User registered successfully", "user": username, "role": role})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    token, created = Token.objects.get_or_create(user=user)
                    return JsonResponse({
                        "message": "Login successful",
                        "user": username,
                        "role": user.role,
                        "token": token.key,
                        "csrf_token": get_token(request)
                    })
                else:
                    return JsonResponse({"error": "Account is inactive"}, status=403)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token_key = data.get("token")

            # Find and delete the token
            Token.objects.filter(key=token_key).delete()

            return JsonResponse({"message": "Logout successful"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

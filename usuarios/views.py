from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Patient, Doctor, Admin
from .serializers import UserSerializer, PatientSerializer, DoctorSerializer, AdminSerializer, LoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

# Aquí puedes mantener tus vistas de login y logout si son necesarias.


# Agrega más viewsets para otros tipos de usuarios si es necesario
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        # Usar el campo user_type para determinar el tipo de usuario
        user_type = user.user_type

        # Información del usuario a retornar
        user_data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'email': user.email,
            'type': user_type,  # Agregar el tipo de usuario aquí
        }

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_data': user_data
        })

@api_view(['POST'])
def logout_view(request):
    try:
        # Simplemente retorna una respuesta exitosa.
        # La lógica real de logout dependerá de cómo manejes las sesiones y la autenticación en el cliente.
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
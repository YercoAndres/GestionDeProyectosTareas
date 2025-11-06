# Configuracion de correo (Gmail)

Este backend usa **Nodemailer** para enviar correos de verificacion desde una cuenta de Gmail. Para que funcione en produccion o durante las pruebas necesitas habilitar un _app password_ en la cuenta de Google que servira como remitente.

## 1. Requisitos previos
- Acceso al panel de seguridad de la cuenta de Google que enviara los correos.
- Autenticacion en dos pasos (2FA) activada para esa cuenta (Google obliga a tenerla para generar app passwords).

## 2. Generar el app password
1. Inicia sesion en https://myaccount.google.com/ con la cuenta remitente.
2. Entra a **Seguridad** -> **Iniciar sesion en Google**.
3. Habilita **Verificacion en dos pasos** si aun no esta activa.
4. Regresa a **Seguridad** y abre **Contrasenas de aplicaciones**.
5. Elige **Correo** como aplicacion y **Otro** -> escribe un nombre descriptivo (por ejemplo: `ProjectTask Backend`).
6. Google generara una contrasena de 16 caracteres. Copiala tal cual (solo letras y numeros, sin espacios).

## 3. Variables de entorno
Modifica `Backend/.env` con los valores de la cuenta:

```
EMAIL_USER=cuenta@gmail.com
EMAIL_PASS=contrasena_generada_sin_espacios
EMAIL_ENABLED=true
```

> Nota: El backend elimina espacios en blanco al cargar las variables, pero es recomendable pegarlas sin separadores para evitar errores de copia.

## 4. Pausar el envio durante el desarrollo
- Si no tienes acceso al correo todavia, establece `EMAIL_ENABLED=false` en el `.env`.
- Con ese valor, el backend omite el envio de correos y marca las cuentas nuevas como verificadas automaticamente, para que puedas seguir desarrollando.
- Recuerda volver a `true` cuando el correo este listo y reiniciar el servidor.

## 5. Reiniciar el backend
- Reinicia el servidor (`npm run dev`, `node server.js`, etc.) para que el nuevo app password o el cambio de bandera se cargue.

## 6. Prueba rapida
1. Registra un usuario nuevo desde el frontend.
2. Verifica en la consola del backend que aparezca `Correo enviado:` sin errores `EAUTH`.
3. Revisa la bandeja de salida de la cuenta remitente o el log del backend para confirmar el envio.

## 7. Revocar o regenerar la contrasena
- Si Google detecta actividad sospechosa o revocas el app password, repite el proceso desde el punto 2.
- Cualquier cambio requiere actualizar `EMAIL_PASS` y reiniciar el backend.

# Cargar archivos directamente desde el navegador hacia S3

Este proyecto consiste en habilitar una página que permita subir 2 tipos de archivos, uno en cada file input. En el bucket de S3 se crea una carpeta por cada tipo de archivo y se guardan uno a la par del siguiente dentro de su carpeta.

Además, adjunta metadata al archivo subido, esta metadata es obtenida de Netlify Identity y la metadata del usuario.

Este proyecto está hecho en React para el frontend y una sola función lambda serverless para obtener el URL a utilizar para subir los archivos (URLs firmados temporales).

## Configuración de S3 en AWS

1. Habilitar S3
2. Crear un bucket
3. Habilitar CORS al bucket (POST y PUT)
4. Quitar acceso público al bucket
4. Crear una política IAM
5. En la política IAM, asignarle permisos de PUT a S3 al bucket creado
6. En la política IAM, asignarle permisos de PUT a S3 a todas las carpetas del bucket creado
7. Crear un usuario IAM (con programmatic access)
8. Adjuntar la política recién creada al usuario

Para que se permita 

## Deploy en Netlify

1. Conectar github con netlify y publicar
2. Habilitar dominio
3. Habilitar HTTPS
4. Agregar las variables de entorno de netlify (ver abajo)
5. Habilitar Netlify Identity y configuarlo como invite-only
6. Entrar a Netlify Identity e invitar a alguien
7. Cuando acepte el usuario la invitación, ingresar a Netlify > Identity y al entrar al usuario hay una sección que dice "User metadata", esa información se puede editar con el botón de "Edit settings". En el campo "Name" vamos a asignarle 3 cosas: el entity_id, un espacio en blanco y el token de Zauru del usuario (__Importante!!!__), si no se le coloca esta información no vamos a poder identificar quien subió el archivo y a que empresa. Si no se coloca bien, si va a dejar subir el archivo pero la siguiente fase no va a poder avisarle a Zauru de la existencia de este archivo (en Zauru se lleva el flujo de la información)

### Variables de entorno a configurar en Netlify
```
AWS_S3_ACCESS_KEY = "mega secreto"
AWS_S3_SECRET_KEY = "super secreto"
AWS_AZ_REGION = "us-east-1"
AWS_S3_BUCKET = "super-bucket"
```

Licencia MIT
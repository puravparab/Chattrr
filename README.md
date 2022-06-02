<p align="center">
    <img src="https://github.com/puravparab/Chattrr/blob/master/public/static/android-chrome-192x192.png?raw=true"/>
</p
<p align="center">
    <h1 align="center">
	    Chattrr
    </h1>
</p
<p align="center">
    A social media application where users can blurt out their thoughts and listen to the world's chattrr.
</p

## Installation
Clone the respository
```
$ git clone https://github.com/puravparab/Chattrr.git
```
Change the working directory to Chattrr
```
$ cd Chattrr
```
Install pipenv to your machine
```
$ pip install --user pipenv
```
Install dependencies from Pipfile
```
$ pipenv install
```
Run the virtual environment
```
$ pipenv shell
```
Create  a file called .env and copy contents from .envtemplate into it
Update the entries in the .env file
```
SECRET_KEY= <create a secret key>
DEBUG=True
DJANGO_SETTINGS_MODULE=Chattrr.settings.dev
ALLOWED_HOSTS=localhost 127.0.0.1

<Update below values if needed>
ACCESS_TOKEN_LIFETIME= 7200
REFRESH_TOKEN_LIFETIME= 86400

<Add your AWS keys>
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=

AWS_S3_FILE_OVERWRITE=False
```
Run the following commands
```
$ python manage.py migrate
$ python manage.py collectstatic
```
This completes the backend/server configuration.

For the next steps make sure node.js is and npm is installed
You should have at least the following versions if node and npm ae installed
```
$ node -v
v16.13.1

$ npm -v
v8.1.2
```
Install dependencies from package.json
```
$ npm install
```
Run the following command to create a production build
```
$ npm run build
```
This completes the frontend/client configuration.

Add a superuser to Django Admin
```
$ python manage.py createsuperuser
```
Run the server at http//127.0.0.1:8000/
```
$ python manage.py runserver
```
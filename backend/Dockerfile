# /backend/Dockerfile 

# 1. Use an official Python image 
FROM python:3.10-slim 

# 2. Set the working directory 
WORKDIR /app 

# 3. Copy dependencies file and install (this leverages Docker cache) 
COPY requirements.txt . 
RUN pip install -r requirements.txt 

# 4. Copy all backend code
COPY . . 

# 5. Expose Flask's default port 
EXPOSE 5000 

# 6. Set env for flask run
ENV FLASK_APP=app.py
ENV FLASK_RUN_PORT=5000
ENV FLASK_ENV=development

# 7. Start command (Key: --host=0.0.0.0 is needed to be accessible by other containers)
CMD ["flask", "run", "--host=0.0.0.0"]
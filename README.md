# This project is an exploration of the CFS Dataset

I'm using AWS RDS to host the dataset.  An EC2 server is provisioned to run the flask app.  
The Database connection is managed through SQLAlchemy.  
I have recipes that automate the process of extracting the data from its excel origin, converting the data to csv and then 
uploading that data to the RDS server via an EC2 server and directly through PANDAS and an SQLAlchemy connection.
The client app is composed of React components.  
The visualization is generated through D3.js.  


## Note this is a work in progress
## Here's a temp screen shot of how far i've gotten

![screenshot of app][screenshot1]

[screenshot1]: https://s3-us-west-1.amazonaws.com/sohailkhan.datascience/cfs_image.jpg "Screenshot"

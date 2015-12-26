ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'sudo apt-get update'
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'sudo apt-get install python-pip'
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'sudo pip install awscli'
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'sudo pip install s3cmd'
scp -i ~/Downloads/flask_dev.pem ~/.aws/credentials ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com:~/
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'mkdir ~/.aws && mv ~/credentials ~/.aws'
scp -i ~/Downloads/flask_dev.pem ~/.s3cfg ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com:~/
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 's3cmd get s3://sohailkhan.datascience/cfs_2012_pumf.csv'
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'sudo apt-get install postgresql postgresql-client postgresql-contrib postgresql-9.3 postgresql-common'
# dataset must first be loaded.  Use pandas to load first row and data
ssh -i psql -h cfsdb.cs4yyoqmq4gl.us-west-1.rds.amazonaws.com -p 5432 -U TestUser --password -d cfsdb -c '\COPY transactions from ''/home/ubuntu/cfs_2012_pumf.csv'' HEADER CSV'
ssh -t -i ~/Downloads/flask_dev.pem  ubuntu@ec2-52-53-254-23.us-west-1.compute.amazonaws.com 'sudo apt-get install gdal-bin'
 

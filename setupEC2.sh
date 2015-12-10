KEYPAIR_NAME='cfs-key'
# create key pair
aws-cli ec2 create-keypair $KEYPAIR_NAME

# Setup an EC2 Server that can get data
aws-cli ec2 run-instances ami-xxxxxxxx -t t1.micro -s subnet-xxxxxxxx -k my-key-pair -g sg-xxxxxxxx --associate-public-ip-address true

    # get response and read ip address

# Load CSV files into S3


# Create EC2 Instance

# Create A Key Pair

# Install AWS_CLI interfaces

aws ec2 terminate-instances i-c8b7e67a

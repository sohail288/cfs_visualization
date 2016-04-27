#!/bin/bash

# Program to automate deployment to ec2

KEY_PAIR_NAME="cfs-key"
SSH             = ssh -i $(KEY_PAIR_NAME).pem
USER            = "ubuntu"
DEPLOYMENT_KEY  = 


start_ec2_service() {
    if [ ! -e "$KEY_PAIR_NAME.pem" ]; then
        # create key pair
        echo "Creating $KEY_PAIR_NAME.pem"
    # create ec2 service 
    return
}

aws rds describe-db-instances --db-instance-identifier cfsdb|grep "Port"| awk -F ':' '{print $2}'| sed 's/[",]//g'

install_dependencies() {
    return
}


setup_virtualenv() {
    

}

# Check local repo status and catch any non-commited stuff

check_git_status() {
    

}



main() {
    check_git_status()
    start_ec2_service()
    

}

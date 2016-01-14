#!/bin/bash

# Program to automate deployment to ec2

KEY_PAIR_NAME="cfs-key"


start_ec2_service() {
    if [ ! -e "$KEY_PAIR_NAME.pem" ]; then
        # create key pair
        echo "Creating $KEY_PAIR_NAME.pem"
    # create ec2 service 
    return
}


install_dependencies() {
    aws rds describe-db-instances --db-instance-identifier cfsdb|grep "Port"| awk -F ':' '{print $2}'| sed 's/[",]//g'
    return
}


setup_virtualenv() {

}



main() {
    start_ec2_service()

}

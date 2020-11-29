#!/bin/bash
#
# Description:
#   This script performs a blue-green deployment into prod 
#   environment using ansible.
#
# Source: None
# Author: Walker Price

ans="/home/wprice/ansible"

ansible-playbook -i $ans/prod $ans/lindeploy.yml

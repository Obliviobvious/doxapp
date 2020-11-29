#!/bin/bash
#
# Description:
#   This script performs a blue-green deployment into prod
#   environment using ansible.
#
# Source: None
# Author: Walker Price

ans="/home/wprice/ansible"
inactive=""
bg=("blue" "green")

sshpass -p "Tfsadmin13" ssh -o StrictHostKeyChecking=no wprice@192.168.0.115 test -f /home/wprice/green/active 
inactive=${bg[$?]}
ansible-playbook -i $ans/prod-$inactive $ans/deploy.yml

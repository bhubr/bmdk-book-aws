#!/bin/bash
MODE=$1
docker-compose -f docker-compose-$MODE.yml up --build
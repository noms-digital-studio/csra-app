#!/usr/bin/env bash
set -e
for i in {1..100}
do
 echo ${i}
 yarn test:rest
done

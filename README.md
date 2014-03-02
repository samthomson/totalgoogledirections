totalgoogledirections
=====================

angular js app to add up distances of google directions

Background
- Using google directions for long journeys across borders doesn't always work (China), however creating two journeys: one up to the border, and one from the border onwards each work.
- getting direcitons which pass over sea include the distance over water in the total

This project allows you to make one combined google directions total from individual segments which you can work around the above short comings


It is based on Angular JS and makes use of the google maps api 3 js service (note: not the wep api, but the js service library)


A usage scenario:

Getting directions from Copenhagen to Berlin. Using google directions the distance over the sea will be included, with this project you can get the total of two directions requests, one from copenhagen to gedser, and then rostock to berlin.

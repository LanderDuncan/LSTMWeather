# LSTM Weather System Design Document
## Overview
This document outlines the design of this application and features select notes on important technical decisions that were made in its creation.

## Table of Contents
* [Deployment](#deployment)
    * [Design Diagram](#design-diagram)
    * [CI/CD](#cicd)
* [Language](#language)
    * [Typescript](#typescript)
* [Frontend](#frontend)
    * [React](#react)
    * [Frontend Design Overview](#frontend-design-overview)
    * [Reactive Design](#reactive-design)
* [Backend](#backend)
    * [NodeJS](#nodejs)
    * [ExpressJS](#expressjs)
    * [MongoDB](#mongodb)
    * [Caching Layer Overview](#caching-layer-overview)
* [Machine Learning](#machine-learninh)
    * [Goals](#goals)
    * [Model Architecture](#model-architecture)
    * [Data](#data)

## Deployment

### Design Diagram

![A System Diagram](System_Diagram.png "System Diagram")

### CI/CD

The CI/CD pipeline for this project was made using Github actions. Every time a pull request was merged into the main branch it would trigger an upload to Google Cloud App Engine. The code would be built and then all incoming server traffic would be routed to the newly created version. Details can be found in the [YAML file](link to that YAML file corresponding with the CI/CD)
Google App Engine: Technology choice overview
Despite deployment being done in Google Cloud Platform, the cloud architecture was designed using the AWS Well-Architected Framework. Deployment on Google App Engine was highly optimized for the pillars:

- Operational excellence - Google App Engine features an extensive management system that has led to extremely quick error diagnosis and general operations management.
- Security - Google has some of the best security practices in the industry and includes extensive documentation on how to implement highly secure systems using their technology.
- Reliability - Google App Engine has a 99.95% uptime and can withstand multiple data center failures. This level of reliability is more than enough for our program.
- Performance efficiency - Since Google App Engine is a Platform-As-A-Service the CI/CD flow was highly optimized compared to more advanced systems that would be overkill for our application. In addition, it is much simpler to use than AWS and Azure equivalents.
- Cost optimization - Google Cloud’s generous free tier allows us to run this app without incurring any costs.
- Sustainability - Google Cloud’s commitment to [sustainability](https://cloud.google.com/sustainability) along with our app having a relatively quick time-out speed allows us to have minimal environmental impact.

## Language

### TypeScript

After the decision to use NodeJS, we had to choose between writing the code in JavaScript or using TypeScript to add a layer of type safety. After analyzing the development of the TypeScript ecosystem since its initial launch and the well-documented integration of it with several of the other technologies we were considering using, we saw that the advantage of strict typing that it offered far outweighed the marginally more mature JavaScript ecosystem.

## Frontend

### React

We choose to use a React frontend for a few reasons. Primarily, that was the frontend framework that we had the most technical proficiency in. However, it also very easily compiles to static html and gives us the freedom to use a completely separate backend. It also permitted us to create a fast and responsive front end. Finally, the useState hook made it incredibly easy to give simple default and overridable values for the data until the API responds with the most recent prediction.

### Reactive Design
We took into account the many kinds of devices that may be viewing our website, so we wrote CSS that was visually appealing on all screen sizes, while also displaying the necessary information.

## Backend

### NodeJS

The decision to use NodeJS was not one taken lightly. While it is capable of handling a significant amount of concurrent requests, it struggles at CPU-intensive tasks such as calling the prediction function on the model. However, NodeJS became the obvious choice after a discussion of the [caching layer](#caching-layer-summary)
, which reduces the amount of times that we will need to do CPU-intensive tasks, and the large support surrounding the runtime environment. This support allowed an easy export/import of the model to the server that would only be possible in another Python-based web application. We did not end up using a Python-based server due to the advantages in concurrent requests that are available in NodeJS.

### ExpressJS

ExpressJS was our choice for building our Rest API for the backend due to its strong integration with NodeJS, its ability to do static file serving, and its strong community support. Since the TensorflowJS API requires us to host the model files in a web server, we needed static file serving to deliver the .bin and .json files.

### MongoDB

MongoDB is not traditionally used as a caching layer. However, the flexibility, cost, and simplicity made this an obvious choice. If we had used a database that enforces strict schema and wanted to add more labels to the model while preserving historical predictions, we would have to modify the entire database. Using this technology allows us to change the schema of the database incredibly easily. In addition, Typescript enforces an interface for the data that is going to be uploaded to the database, which reduces the weakness associated with the flexibility.
In terms of cost, most relational databases are associated with high running costs when compared with MongoDB's generous free tier.
The massive community associated with the MongoDB-NodeJS connection allowed for incredible online resources and a simple API which massively decreased development time.
Redis, which is the classic caching database, only allows key-value pairs which does not allow us to have an entire prediction set contained within one document. We could have, theoretically, enforced a naming schema by adding some index to the key (predicted_wind_1), but this increases the potential for errors and the number of database queries needed to accomplish the same task.

### Caching Layer Overview

While NodeJS is very good at handling high volumes of requests, it can struggle to cope with a combination of high request volume and computationally-intensive tasks. Since calculating predictions based on an RNN model can be somewhat demanding on the system, we opted to add a caching layer that will prevent multiple requests within the same reporting window (the weather station we are pulling data from reports data hourly) from triggering a prediction event. Every request to the server triggers a call to MongoDB to see if a prediction has been made within the last 60 minutes. If one has been made, it is sent to the user with no third-party API calls or model prediction calls. If a prediction has not been made, the server calls the model and the third-party API to send these values to the user. Then these values are pushed to the database as a document containing the actual and predicted weather values.

## Machine Learning

### Goals

While the model for this project certainly could have been much larger, the goal was to experiment with the accuracy of a simple RNN.

### Model Architecture

The simple RNN used for prediction in this project was defined using a single LSTM layer containing 32 units and a dense layer containing 3 units corresponding with the 3 labels, Wx, Wy, and Temperature:

```python
lstm_model = tf.keras.models.Sequential([
    tf.keras.layers.LSTM(32, return_sequences=True),
    tf.keras.layers.Dense(units=3)
])
```

### Data

The data for training was sourced from [NOAA](https://www.ncei.noaa.gov/access). The data displayed on the user interface is sourced from [aviationweather.gov](aviationweather.gov). While both sources pull data from the same ASOS weather station located at the Charles M. Schultz Airport, some values found in the NOAA database seem unrealistic for the weather patterns associated with the airport. This may have led to accuracy issues between the displayed weather data and the predicted weather data. It highlights the importance of data quality when building models such as these.

# Auction Service

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-blue?style=flat&logo=.net&logoColor=white" alt=".NET 8.0">
  <img src="https://img.shields.io/badge/Postgres-DB-blue?style=flat&logo=postgresql&logoColor=white" alt="Postgres DB">
  <img src="https://img.shields.io/badge/Entity_Framework-ORM-blue" alt="Entity Framework ORM">
  <br>
  <img src="https://img.shields.io/badge/Service_Bus-RabbitMQ-orange?style=flat&logo=rabbitmq&logoColor=white" alt="Service Bus - RabbitMQ">
<img src="https://img.shields.io/badge/AutoMapper-Extensions-yellow" alt="AutoMapper Extensions">
  <img src="https://img.shields.io/badge/JWT_Bearer-blue?style=flat&logo=JSON web tokens&logoColor=white" alt="JWT Bearer">
  <img src="https://img.shields.io/badge/EF_Design-blue" alt="EF Design">
  <img src="https://img.shields.io/badge/Npgsql-EF_Core_Provider-blue" alt="Npgsql EF Core">
  <img src="https://img.shields.io/badge/MassTransit-RabbitMQ-black" alt="MassTransit RabbitMQ">
</p>


The Auction Service is part of an auction system responsible for managing auctions. It provides functionality for creating, updating, and deleting auctions, as well as retrieving information about existing auctions. This service is a crucial component in the system, ensuring reliable and efficient management of auctions and their states.

## Key Functions of the Service:
- Creating auctions with options to specify reserve price, end time, and other attributes.
- Updating auction details such as reserve price, end date, and other parameters.
- Deleting auctions if they have no bids and haven't met the reserve price.
- Retrieving information about specific auctions based on their identifiers.
- Retrieving lists of all auctions or auctions updated after a specific date.

The service also interacts with other components through events such as auction creation, update, and deletion. It consumes events from other services, such as bid placements and auction end notifications, to keep auction statuses up to date.

### **More in [Specification](./auctionSvcSpec.pdf) file.**

## TODO:
- Seed (+ConfigsForEntities)/DBInitializer(InInfrastructure)
- Authorize attribute

## Additional Technologies:
- Use Clean Code Architecture(With Mediat+CQRS pattern)
- Use EndpointsAPI

## Auction Service Specification

### Technologies Used
| Technology                              | Description                                  |
| --------------------------------------- | -------------------------------------------- |
| .NET Web API                             | Framework for building APIs                  |
| Postgres DB                             | Database                                     |
| Entity Framework ORM                    | Object-relational mapping framework          |
| Service Bus - RabbitMQ                  | Messaging system                             |
| AutoMapper.Extensions.Microsoft.DependencyInjection | Object-object mapper                      |
| Microsoft.AspNetCore.Authentication.JwtBearer | JWT Bearer authentication                 |
| Microsoft.EntityFrameworkCore.Design    | Design tools for EF Core                     |
| Npgsql.EntityFrameworkCore.PostgreSQL   | EF Core provider for PostgreSQL              |
| MassTransit.RabbitMQ                    | Distributed application framework for RabbitMQ |

### API Endpoints
- **POST api/auctions** - Create Item Auth
- **PUT api/auctions/:id** - Update auction Auth
- **DELETE api/auctions/:id** - Delete auction Auth
- **GET api/auctions** - Get auctions Anon
- **GET api/auctions/:id** - Get auction by id Anon

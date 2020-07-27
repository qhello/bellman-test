# Recruitment exercise

Contact John for any question: john@bellman.immo

## Objectives

The objective of this exercise is to test you on developing a backend project.

You are evaluated on :

- Having a working project ! 🙂
- Code structure & quality 🤩
- Understanding of the problem 🤓

## Delivery instructions

Send us by email (john@bellman.immo) your project within 4 hours after checking out the exercise for the first time. Your project must be contained in a zip archive, cleaned of any working files.

## Guidelines

You have to use NodeJS, with any library or tool you need.
If your prefer Typescript, feel free to use it !

## What's expected

Your job is to create a REST API used to calculate charges for an apartment using statistics (extracted from public data).
We provide you a SQLite database with all needed data.

### Expected APIs

This API should be using GET, and expose two endpoints :

- Retrieve list of cities in a department
- Calculate charges (mean, min, max) of an apartment in a city
- Calculate charges (mean, min, max) of an apartment in a department

#### /department

output: list of available departments :

- dptCode: string

#### /department/{dptCode}

output: list of cities for department {dptCode} :

- city: string
- postalCode: string

#### /department/{dptCode}/city/{postalCode}/charges

input:

- condoSize: int
- heating: boolean
- employee: boolean
- elevator: boolean

output:

- mean: float
- min: float
- max: float

#### /department/{dptCode}/charges

input:

- condoSize: int
- heating: boolean
- employee: boolean
- elevator: boolean

output:

- mean: float
- min: float
- max: float

### Example of usage

We must be able to query the API using following command :

`curl http://localhost:8080/department`

`curl http://localhost:8080/department/75`

`curl http://localhost:8080/department/75/city/75015/charges?condoSize=61&heating=true&employee=true&elevator=false`

`curl http://localhost:8080/department/75/charges?condoSize=61&heating=true&employee=true&elevator=false`

### Error management

You must handle common errors with standard HTTP errors (ex: database error, invalid routes, invalid parameters...).

## Tips

### Structure of provided data

Database do not provide data of individual services included in the charges. For example, you may have mean charges for apartment with elevator and heater, or mean charges for apartment with elevator and heater and keeper (check database model section).
You should find a way to be able to evaluate charges using any combination of services (even if this combination is not provided).

### Missing data

Data are not available for some cities or some building size (ex: there is only few cities with data for buildings with >200 apartments). You can use HTTP error to handle these cases.

## Database model

### City

This table contains the list of all cities included in the statistics, with following attributes :

- name
- postal_code
- dpt_code : department code
- group_name (not needed for this exercise)

### BaseStats

This table contains all existing statistics on charges amount per apartment depending on criterias. Attributes are :

- cityId (id in table city)
- condo_size: number of apartment in the building (<10, 11-49, 50-200, >200)
- condo_count: number of building of this size in the city
- service\_\*: each of these attributes is the mean charges paid per apartment with this kind of service
- service\_\*\_std : for each service attribute, there is the standard deviation

#### Focus on service\_\*

Each column can either be one service, or the combination of multiple services.
Statistics can include 0 to 3 services in charges :

- Elevator
- Collective Heating (heating is provided by the building and not individualy in each apartment)
- Employee (keeper)

Depending on the size of the building, statistics are not provided the same way (service column with value `0` means no data) :

- <= 10 apartments or 11-49 apartments :
  - no service
  - elevator
  - heating
- 50-200 apartments or > 200 apartments :
  - elevator
  - elevator + heating + employee
  - elevator + heating

For each service\_\*, you are also provided with standard deviation. Example :

- service_elevator : mean charges for an apartment with elevator
- service_elevator_std : standard deviation of charges for an apartment with elevator
  Standard deviation may be used to estimate a number range for charges (min / max)

## Bonus

If you have enough time, add tests to you API !

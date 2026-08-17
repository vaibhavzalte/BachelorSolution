# Bachelor Solution Backend

Spring Boot REST API for **Bachelor Solution**, a platform where students and working bachelors can find rooms, mess services, food stalls, room vacancies, and study rooms in one place instead of searching across Telegram groups.

This README is written the way you would explain the project in a **Java / Spring Boot interview**.

---

## 1. What is this project?

Bachelor Solution is a listing platform focused on bachelor daily-life needs:

- **Room** – full rooms / flats for rent
- **RoomVacancy** – sharing vacancies inside an existing room
- **Mess** – monthly / per-meal food service
- **FoodStall** – nearby stalls and snacks
- **StudyRoom** – paid or campus study halls

The backend exposes one versioned REST API (`/uv-api/v1/listings`) that can create, read, update, filter, and soft-delete all of these types.

Frontend (Next.js) talks to this API using `http://localhost:8080/uv-api/v1`.

---

## 2. Problem it solves

Bachelors usually depend on scattered Telegram groups and unverified posts. That is slow, noisy, and hard to filter.

This project puts all listing types into **one organized system** with:

- a single API contract
- city / type / attribute filters
- image upload
- structured owner and pricing data

---

## 3. Tech stack

| Layer | Choice |
| --- | --- |
| Language | Java 17 |
| Framework | Spring Boot |
| API | Spring Web MVC REST |
| Persistence | Spring Data JPA + PostgreSQL |
| Mapping | Jackson |
| Docs | Springdoc OpenAPI / Swagger |
| Storage | Local disk or Google Cloud Storage |
| Build | Maven |

---

## 4. Architecture (interview explanation)

The backend follows a **layered architecture** plus **Factory + Strategy (Transformer)** so one controller/service can support many listing types.

```
Client (Next.js)
        │  HTTP / multipart
        ▼
ListingController          ← only HTTP in/out
        │
        ▼
DataTransformerFactory     ← picks the correct transformer from typeName
        │
        ▼
RoomTransformer / MessTransformer / FoodStallTransformer / ...
        │  request  → payload
        │  payload  → response
        ▼
ListingService             ← business logic, filters, images, transactions
        │
        ├── FileStorageService (local or GCP)
        │
        ▼
ListingsRepository / ListingAttributesRepository
        │
        ▼
PostgreSQL
  listings            → common columns + JSON payload
  listing_attributes  → filterable key/value pairs (EAV)
```

### Why this architecture?

In an interview I would say: I did not create five separate CRUD modules. I designed **one generic listing pipeline** and plugged each type into it.

| Component | Responsibility |
| --- | --- |
| **Controller** | Accepts `typeName`, JSON body, optional images. No business logic. |
| **Factory** | `ListingType.fromValue(typeName)` → `RoomTransformer`, `MessTransformer`, etc. |
| **Transformer** | Converts Request → Payload JSON and Payload + Entity → Response. Also exposes filter attributes. |
| **Service** | Create / update / get / filter / soft-delete. Stores images. Maps JSON payload. |
| **Entity** | `ListingEntity` holds common indexed fields. Type-specific data lives in `payload` TEXT/JSON. |
| **Attributes** | EAV table for filters like `roomType=1BHK` without changing the schema. |
| **Exception handler** | Centralized 400 / 404 / 409 / 500 responses. |

This is **Open/Closed**: add a new listing type by adding Request, Payload, Response, Transformer, and one factory `case`. Controller and service stay unchanged.

---

## 5. Data design

### `listings` table (common, indexed)

These columns are shared by every type and used for fast queries:

- `id`, `type`, `sub_type`, `primary_id`
- `city`, `latitude`, `longitude`
- `payload` (type-specific JSON)
- `status` (`ACTIVE` / `INACTIVE`)
- `create_time`, `update_time`

### `payload` JSON (type-specific)

Room stores rent, amenities, owner info, etc. Mess stores monthlyFee, foodType, etc. The database schema does **not** grow a new column for every new field.

### `listing_attributes` (EAV for filters)

Transformers return extra attributes, for example:

- Room: `roomType`, `availableFor`
- Mess: `foodType`, `mealType`, `homeDelivery`
- RoomVacancy: `roomType`, `preferredTenant`, `totalVacancies`
- FoodStall: `foodType`, `isOpen`
- StudyRoom: `isAvailable`, `hasWifi`, `hasAC`, `hasChargingPoints`

List APIs can then filter with query params such as:

```
GET /uv-api/v1/listings/Room?city=Pune&roomType=1BHK&availableFor=BOYS&freshness=24h
GET /uv-api/v1/listings/Mess?city=Pune&foodType=VEG&mealType=ALL
```

Unknown query params are applied as attribute `EXISTS` conditions, so filters stay flexible.

---

## 6. Request / response flow

### Create a Room (same flow for Mess, FoodStall, RoomVacancy, StudyRoom)

```
HTTP POST /uv-api/v1/listings/Room
multipart: listing = JSON string, images = files
        │
        ▼
ListingController
        │
        ▼
DataTransformerFactory.getTransformerFor(ROOM, json)
        │  Jackson maps JSON → RoomRequest
        ▼
RoomTransformer
        │  toPayload() → RoomPayload
        ▼
ListingService
        │  store images (local/GCP)
        │  serialize payload JSON
        │  save ListingEntity (status = ACTIVE)
        │  save ListingAttributesEntity rows
        ▼
PostgreSQL
        │
        ▼
RoomTransformer.toResponse(payload, entity)
        │
        ▼
HTTP 201 RoomResponse
```

### Retrieve

```
DATABASE ListingEntity
        │  payload JSON
        ▼
Jackson → RoomPayload / MessPayload / ...
        │  load image files → base64 data URLs
        ▼
Transformer.toResponse()
        │
        ▼
HTTP 200 typed response
```

### Update

Same as create, but loads the existing `ACTIVE` row by `id + type`, replaces payload/attributes, and optionally replaces images.

### Delete

Soft delete: `status` is set to `INACTIVE`. Get APIs only return `ACTIVE` rows, so history is kept and the row can be restored later.

---

## 7. REST API

Base path: `/uv-api/v1/listings`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/listings` | Health check |
| POST | `/listings/{typeName}` | Create (multipart) |
| GET | `/listings/{typeName}` | List + filters |
| GET | `/listings/{typeName}/{id}` | Get by id |
| PUT | `/listings/{typeName}/{id}` | Update (multipart) |
| DELETE | `/listings/{typeName}/{id}` | Soft delete |

`typeName`: `Room` | `Mess` | `RoomVacancy` | `FoodStall` | `StudyRoom`

### Frontend create / update contract

```javascript
const formData = new FormData();
formData.append("listing", JSON.stringify(listingObject));
imageFiles.forEach((file) => formData.append("images", file));

await fetch("http://localhost:8080/uv-api/v1/listings/Room", {
  method: "POST",
  body: formData
});
```

Do **not** set `Content-Type` manually. The browser sets the multipart boundary.

Sample JSON bodies are in:

- `src/main/resources/Room.json`
- `src/main/resources/Mess.json`
- `src/main/resources/RoomVacancy.json`
- `src/main/resources/FoodStall.json`
- `src/main/resources/StudyRoom.json`

---

## 8. Swagger / OpenAPI (for frontend)

The frontend can generate or type APIs from this spec.

| Resource | URL |
| --- | --- |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Generated OpenAPI | http://localhost:8080/v3/api-docs |
| Static Swagger JSON | http://localhost:8080/openapi.json |
| File in repo | `src/main/resources/static/openapi.json` |

Import `openapi.json` into Postman, Orval, openapi-typescript, or any OpenAPI client generator.

Live spec after the app starts:

```
GET http://localhost:8080/v3/api-docs
```

---

## 9. Why this design is scalable (important interview point)

Scalability here means **new features, more listing types, more traffic, and more data** without rewriting the core.

1. **One controller, many types**  
   Traffic always hits the same endpoint shape. The frontend does not need a new API family for each category.

2. **Factory + Transformer (Strategy)**  
   Adding `Gym` or `PG` later is a new transformer + DTOs + one factory branch. `ListingService` stays closed for modification.

3. **JSON payload + common columns**  
   Common filters (`city`, `type`, `status`, `create_time`) stay indexed relational columns. Rare/type-specific fields stay in JSON, so schema migrations stay small.

4. **EAV attributes for search**  
   Filters like `roomType` or `foodType` do not require new indexed columns for every type. New filter keys are just extra rows.

5. **Stateless service**  
   No session in the API. Multiple app instances can sit behind a load balancer. Images can move from local disk to GCP with `storage.type=gcp` without changing controllers.

6. **Soft delete**  
   Deletes are an update of `status`, which is cheaper and safer than hard deletes under load, and keeps audit data.

7. **Storage abstraction**  
   `FileStorageService` has local and GCP implementations. Local is for development; object storage is for production scale.

8. **Clear layer boundaries**  
   Controller, service, repository, and transformers can be tested and scaled independently. Heavy image work can later move to async jobs without changing the API contract.

What I would improve next for higher scale: JWT auth, pagination, Redis cache for city/type lists, full-text search (PostgreSQL `tsvector` or Elasticsearch), and CDN for images instead of returning base64 in the JSON body.

---

## 10. Project structure

```
controller/     ListingController
service/        ListingService, FileStorageService
transformer/    DataTransformerFactory + type transformers
dto/request     API input (RoomRequest, MessRequest, ...)
dto/payload     JSON stored in listings.payload
dto/response    API output
entity/         ListingEntity, ListingAttributesEntity
repository/     Spring Data JPA
exception/      GlobalExceptionHandler
config/         StorageConfig, OpenApiConfig
enums/          ListingType, ListingStatus
```

---

## 11. How to run

1. PostgreSQL database `pgsoldb` (see `application.properties`)
2. `mvn spring-boot:run`
3. Open Swagger UI: http://localhost:8080/swagger-ui.html
4. Health: `GET http://localhost:8080/uv-api/v1/listings`

Default storage is local (`./uploads`). Set `storage.type=gcp` for Cloud Storage.

---

## 12. Short interview answer

> Bachelor Solution backend is a Spring Boot listing platform for rooms, mess, food stalls, vacancies, and study rooms. I used a layered architecture: controller, service, repository. Because listing types have different fields, I did not create five schemas. I stored common fields in `listings` and type-specific data as JSON `payload`, with an EAV `listing_attributes` table for filters. A Factory picks a Transformer per type, so CRUD, image upload, and filtering stay in one service. That keeps the system extensible and scalable: a new listing type does not require a new controller or a database redesign.

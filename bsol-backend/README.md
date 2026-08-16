backend workflow
POST /listings/{typeName}
↓
ListingController
↓
DataTransformerFactory
↓
RoomTransformer / MessTransformer / ...
↓
ListingService
↓
ListingsEntity
├── common fields
└── payload = type-specific JSON
↓
Database



For creating a Room:
HTTP
│
▼
RoomRequest
│
▼
DataTransformerFactory
│
▼
RoomTransformer
│
▼
Room
│
▼
RoomPayload
│
▼
JSON serialization
│
▼
ListingsEntity
│
▼
DATABASE


For retrieving:
DATABASE
│
▼
ListingsEntity
│
│ payload JSON
▼
RoomPayload
│
▼
RoomTransformer
│
▼
RoomResponse
│
▼
HTTP RESPONSE

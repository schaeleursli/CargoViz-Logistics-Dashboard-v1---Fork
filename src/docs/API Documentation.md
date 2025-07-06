# API Documentation

## Overview

Based on the provided Postman collection.&#x20;
Base URL: `{{baseUrl}}`
Authentication: **Bearer Token** – store it as `authToken` in your active environment and set collection-level auth to “Bearer Token → `{{authToken}}`”.
Rate Limits: *TBD*

---

## /api/token

### POST `{{baseUrl}}/api/token`

**Request Body**

```json
{
  "email": "admin@cargoviz.com",
  "password": "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"
}
```

---

## Areas

### POST `{{baseUrl}}/api/Variant/Areas/AddArea`

**Request Body**

```json
{
  "orgId": 123,
  "name": "Block A",
  "description": "Open yard behind Gate 3",
  "content": "{}",
  "actionBy": 4711
}
```

**Response 200**

```json
{
  "result": true,
  "message": "Area created",
  "data": {
    "id": 123,
    "orgId": 123,
    "name": "Block A",
    "description": "Open yard behind Gate 3",
    "content": "{}",
    "dateAdded": "2025-07-05T23:15:07Z",
    "dateUpdated": "2025-07-05T23:15:07Z",
    "addedBy": 4711,
    "updatedBy": 4711,
    "active": true
  }
}
```

### POST `{{baseUrl}}/api/Variant/Areas/UpdateArea`

**Request Body**

```json
{
  "id": 123,
  "name": "Block A – updated",
  "description": "Now reserved for project X",
  "content": "{\"color\":\"#0D9488\"}",
  "actionBy": 4711
}
```

**Response 200**

```json
{ "result": true, "message": "Area updated" }
```

### GET `{{baseUrl}}/api/Variant/Areas/RemoveArea/123/4711`

Soft-deletes (sets `active = false`) the area.

**Response 200**

```json
{ "result": true, "message": "Area removed" }
```

### GET `{{baseUrl}}/api/Variant/Areas/GetArea/123`

Returns a single Area object.

### GET `{{baseUrl}}/api/Variant/Areas/GetAreas/99`

List all areas belonging to organisation `99`.

### GET `{{baseUrl}}/api/Variant/Areas/GetMyAreas/4711`

List areas created by user `4711`.

---

## CargoNotes

### POST `{{baseUrl}}/api/Variant/CargoNotes/AddNote`

```json
{
  "cargoId": "CARGO-8675309",
  "title": "Inspection – left corner dent",
  "description": "Small dent found on the left corner of crate.",
  "type": "Damage",
  "photos": "https://s3.example.com/damage123.jpg",
  "location": "-33.45672,-70.65428",
  "data": "{}",
  "actionBy": 4711
}
```

> *Other endpoints:* **UpdateNote**, **RemoveNote**, **GetNote**, **GetNotes** follow the same pattern.

---

## Convoys

### POST `{{baseUrl}}/api/Variant/Convoys/AddConvoy`

```json
{
  "spaceId": 88,
  "name": "Convoy CL-Route 5-North",
  "description": "Night-move of 4 OOG modules",
  "start": "2025-07-08T22:00:00Z",
  "end": "2025-07-09T04:00:00Z",
  "actionBy": 4711
}
```

**Key helper endpoints**

| Purpose                   | Method & Path                                                             |
| ------------------------- | ------------------------------------------------------------------------- |
| Update convoy meta        | `POST /api/Variant/Convoys/UpdateConvoy`                                  |
| Archive / Unarchive       | `GET /ArchiveConvoy/:id/:actionBy` & `GET /UnarchiveConvoy/:id/:actionBy` |
| Delete                    | `GET /DeleteConvoy/:id/:actionBy`                                         |
| Add point                 | `POST /AddPoint`                                                          |
| Get points                | `GET /GetPoints/:convoyId`                                                |
| Archive / Unarchive point | `GET /ArchivePoint/:id/:actionBy` & `GET /UnarchivePoint/:id/:actionBy`   |

---

## **Additional Modules**

The collection also contains endpoints for:

* **KMLs** – upload & list KML map layers
* **LocationTracking** – real-time GPS pings
* **MapFeatures** – custom map overlays
* **Organizations, Projects, ProjectDataGroups** – admin metadata
* **File Uploads** – one-off helpers such as `/UploadFile`, `/UploadActivityItemPhoto`, etc.

All follow the same CRUD schema you’ve seen above: **Add → Update → (Soft)Delete → GetOne → GetMany** with consistent response envelopes.

---

## Standard Error Object

```jsonc
{
  "result": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "is required" }
  ]
}
```

---

## Changelog

| Date       | Change                                               |
| ---------- | ---------------------------------------------------- |
| 2025-07-05 | Initial public release of Areas, CargoNotes, Convoys |
| —          | **TODO:** add entries as the API evolves             |

---

### Quick Compliance Checklist

* [ ] Success **and** error examples on every endpoint
* [ ] Query / body params typed & documented
* [ ] Auth flow tested in environment
* [ ] `DELETE` verbs preferred over “delete via `GET`” endpoints
* [ ] Changelog kept current

---

**Copy this doc into the collection’s root description**, hit **Publish**, and you’ll have live, runnable Postman documentation that stays in sync with your requests and examples.

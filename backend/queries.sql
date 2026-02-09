-- name: GetAllAthletes :many
SELECT id, name, grade, personal_record, events, created_at
FROM athletes
ORDER BY name;

-- name: GetAthleteByID :one
SELECT id, name, grade, personal_record, events, created_at
FROM athletes
WHERE id = ?;

-- name: GetAllMeets :many
SELECT id, name, meet_date, location, description, created_at
FROM meets
ORDER BY meet_date;

-- name: GetResultsForMeet :many
SELECT r.id, r.athlete_id, r.meet_id, r.time, r.place, r.created_at,
       a.name as athlete_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?);

-- name: CreateAthlete :execresult
INSERT INTO athletes (name, grade, personal_record, events)
VALUES (?, ?, ?, ?);

-- name: UpdateAthlete :exec
UPDATE athletes
SET name = ?, grade = ?, personal_record = ?, events = ?
WHERE id = ?;

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;

-- name: CreateMeet :execresult
INSERT INTO meets (name, meet_date, location, description)
VALUES (?, ?, ?, ?);

-- name: UpdateMeet :exec
UPDATE meets
SET name = ?, meet_date = ?, location = ?, description = ?
WHERE id = ?;

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;

-- name: GetMeetByID :one
SELECT id, name, meet_date, location, description, created_at
FROM meets
WHERE id = ?;

-- name: DeleteResult :exec
DELETE FROM results WHERE id = ?;

-- name: GetTopTimes :many
SELECT r.id, r.athlete_id, r.meet_id, r.time, r.place, r.created_at,
       a.name as athlete_name, m.name as meet_name, m.meet_date
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
ORDER BY r.time
LIMIT 10;

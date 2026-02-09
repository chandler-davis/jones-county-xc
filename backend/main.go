package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"jones-county-xc/backend/db"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var queries *db.Queries

type HealthResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// API response types (different from db models for JSON formatting)
type AthleteResponse struct {
	ID             int32  `json:"id"`
	Name           string `json:"name"`
	Grade          int8   `json:"grade"`
	PersonalRecord string `json:"personalRecord"`
	Events         string `json:"events"`
}

type MeetResponse struct {
	ID          int32  `json:"id"`
	Name        string `json:"name"`
	Date        string `json:"date"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

type ResultResponse struct {
	ID          int32  `json:"id"`
	AthleteID   int32  `json:"athleteId"`
	MeetID      int32  `json:"meetId"`
	Time        string `json:"time"`
	Place       int32  `json:"place"`
	AthleteName string `json:"athleteName,omitempty"`
}

type TopTimeResponse struct {
	ID          int32  `json:"id"`
	AthleteID   int32  `json:"athleteId"`
	MeetID      int32  `json:"meetId"`
	Time        string `json:"time"`
	Place       int32  `json:"place"`
	AthleteName string `json:"athleteName"`
	MeetName    string `json:"meetName"`
	MeetDate    string `json:"meetDate"`
}

func main() {
	// Build database connection string from environment variables
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbUser := getEnv("DB_USER", "root")
	dbPass := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "jones_county_xc")

	var dsn string
	if dbPass != "" {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?parseTime=true", dbUser, dbPass, dbHost, dbName)
	} else {
		dsn = fmt.Sprintf("%s@tcp(%s:3306)/%s?parseTime=true", dbUser, dbHost, dbName)
	}

	// Connect to MySQL
	conn, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer conn.Close()

	// Verify connection
	if err := conn.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Connected to MySQL database")

	queries = db.New(conn)

	r := gin.Default()

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, HealthResponse{
			Status:  "ok",
			Message: "Jones County XC API is running",
		})
	})

	// API root
	r.GET("/api", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"name":    "Jones County XC API",
			"version": "1.0.0",
		})
	})

	// Get all athletes
	r.GET("/api/athletes", func(c *gin.Context) {
		athletes, err := queries.GetAllAthletes(context.Background())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		response := make([]AthleteResponse, len(athletes))
		for i, a := range athletes {
			response[i] = AthleteResponse{
				ID:             a.ID,
				Name:           a.Name,
				Grade:          a.Grade,
				PersonalRecord: a.PersonalRecord.String,
				Events:         a.Events.String,
			}
		}
		c.JSON(200, response)
	})

	// Get single athlete by ID
	r.GET("/api/athletes/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid athlete ID"})
			return
		}

		athlete, err := queries.GetAthleteByID(context.Background(), int32(id))
		if err != nil {
			c.JSON(404, gin.H{"error": "Athlete not found"})
			return
		}

		c.JSON(200, AthleteResponse{
			ID:             athlete.ID,
			Name:           athlete.Name,
			Grade:          athlete.Grade,
			PersonalRecord: athlete.PersonalRecord.String,
			Events:         athlete.Events.String,
		})
	})

	// Get all meets
	r.GET("/api/meets", func(c *gin.Context) {
		meets, err := queries.GetAllMeets(context.Background())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		response := make([]MeetResponse, len(meets))
		for i, m := range meets {
			response[i] = MeetResponse{
				ID:          m.ID,
				Name:        m.Name,
				Date:        m.MeetDate.Format("2006-01-02"),
				Location:    m.Location,
				Description: m.Description.String,
			}
		}
		c.JSON(200, response)
	})

	// Get results for a specific meet
	r.GET("/api/meets/:id/results", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid meet ID"})
			return
		}

		results, err := queries.GetResultsForMeet(context.Background(), int32(id))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		response := make([]ResultResponse, len(results))
		for i, r := range results {
			var place int32
			if r.Place.Valid {
				place = r.Place.Int32
			}
			response[i] = ResultResponse{
				ID:          r.ID,
				AthleteID:   r.AthleteID,
				MeetID:      r.MeetID,
				Time:        r.Time,
				Place:       place,
				AthleteName: r.AthleteName,
			}
		}
		c.JSON(200, response)
	})

	// Get top 10 fastest times across all meets
	r.GET("/api/top-times", func(c *gin.Context) {
		times, err := queries.GetTopTimes(context.Background())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		response := make([]TopTimeResponse, len(times))
		for i, t := range times {
			var place int32
			if t.Place.Valid {
				place = t.Place.Int32
			}
			response[i] = TopTimeResponse{
				ID:          t.ID,
				AthleteID:   t.AthleteID,
				MeetID:      t.MeetID,
				Time:        t.Time,
				Place:       place,
				AthleteName: t.AthleteName,
				MeetName:    t.MeetName,
				MeetDate:    t.MeetDate.Format("2006-01-02"),
			}
		}
		c.JSON(200, response)
	})

	// Create a new result
	r.POST("/api/results", func(c *gin.Context) {
		var req struct {
			AthleteID int32  `json:"athleteId" binding:"required"`
			MeetID    int32  `json:"meetId" binding:"required"`
			Time      string `json:"time" binding:"required"`
			Place     int32  `json:"place"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		result, err := queries.CreateResult(context.Background(), db.CreateResultParams{
			AthleteID: req.AthleteID,
			MeetID:    req.MeetID,
			Time:      req.Time,
			Place:     sql.NullInt32{Int32: req.Place, Valid: req.Place > 0},
		})
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		id, _ := result.LastInsertId()
		c.JSON(201, gin.H{"id": id, "message": "Result created"})
	})

	// Delete a result
	r.DELETE("/api/results/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid result ID"})
			return
		}

		err = queries.DeleteResult(context.Background(), int32(id))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Result deleted"})
	})

	// Create a new athlete
	r.POST("/api/athletes", func(c *gin.Context) {
		var req struct {
			Name           string `json:"name" binding:"required"`
			Grade          int8   `json:"grade" binding:"required"`
			PersonalRecord string `json:"personalRecord"`
			Events         string `json:"events"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		result, err := queries.CreateAthlete(context.Background(), db.CreateAthleteParams{
			Name:           req.Name,
			Grade:          req.Grade,
			PersonalRecord: sql.NullString{String: req.PersonalRecord, Valid: req.PersonalRecord != ""},
			Events:         sql.NullString{String: req.Events, Valid: req.Events != ""},
		})
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		id, _ := result.LastInsertId()
		c.JSON(201, gin.H{"id": id, "message": "Athlete created"})
	})

	// Update an athlete
	r.PUT("/api/athletes/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid athlete ID"})
			return
		}

		var req struct {
			Name           string `json:"name" binding:"required"`
			Grade          int8   `json:"grade" binding:"required"`
			PersonalRecord string `json:"personalRecord"`
			Events         string `json:"events"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		err = queries.UpdateAthlete(context.Background(), db.UpdateAthleteParams{
			ID:             int32(id),
			Name:           req.Name,
			Grade:          req.Grade,
			PersonalRecord: sql.NullString{String: req.PersonalRecord, Valid: req.PersonalRecord != ""},
			Events:         sql.NullString{String: req.Events, Valid: req.Events != ""},
		})
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Athlete updated"})
	})

	// Delete an athlete
	r.DELETE("/api/athletes/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid athlete ID"})
			return
		}

		err = queries.DeleteAthlete(context.Background(), int32(id))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Athlete deleted"})
	})

	// Create a new meet
	r.POST("/api/meets", func(c *gin.Context) {
		var req struct {
			Name        string `json:"name" binding:"required"`
			Date        string `json:"date" binding:"required"`
			Location    string `json:"location" binding:"required"`
			Description string `json:"description"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		meetDate, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
			return
		}

		result, err := queries.CreateMeet(context.Background(), db.CreateMeetParams{
			Name:        req.Name,
			MeetDate:    meetDate,
			Location:    req.Location,
			Description: sql.NullString{String: req.Description, Valid: req.Description != ""},
		})
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		id, _ := result.LastInsertId()
		c.JSON(201, gin.H{"id": id, "message": "Meet created"})
	})

	// Get single meet by ID
	r.GET("/api/meets/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid meet ID"})
			return
		}

		meet, err := queries.GetMeetByID(context.Background(), int32(id))
		if err != nil {
			c.JSON(404, gin.H{"error": "Meet not found"})
			return
		}

		c.JSON(200, MeetResponse{
			ID:          meet.ID,
			Name:        meet.Name,
			Date:        meet.MeetDate.Format("2006-01-02"),
			Location:    meet.Location,
			Description: meet.Description.String,
		})
	})

	// Update a meet
	r.PUT("/api/meets/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid meet ID"})
			return
		}

		var req struct {
			Name        string `json:"name" binding:"required"`
			Date        string `json:"date" binding:"required"`
			Location    string `json:"location" binding:"required"`
			Description string `json:"description"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		meetDate, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
			return
		}

		err = queries.UpdateMeet(context.Background(), db.UpdateMeetParams{
			ID:          int32(id),
			Name:        req.Name,
			MeetDate:    meetDate,
			Location:    req.Location,
			Description: sql.NullString{String: req.Description, Valid: req.Description != ""},
		})
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Meet updated"})
	})

	// Delete a meet
	r.DELETE("/api/meets/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid meet ID"})
			return
		}

		err = queries.DeleteMeet(context.Background(), int32(id))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Meet deleted"})
	})

	log.Println("Starting server on :8080")
	r.Run(":8080")
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

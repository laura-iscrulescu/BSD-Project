package mainDB

import (
	"context"
	"errors"
	"os"
	"services/authenticator/log"
	"services/authenticator/mainDB/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const (
	user     string = "root"
	password string = "root"
)

type MainDB interface {
	Add(username, name string, age float64) error
	Get(username string) (*models.UsersJson, error)
	Remove(username string) error
}

type mainDBStruct struct {
	ctx    context.Context
	client *mongo.Collection
	log    log.Log
}

func Initialize(ctx context.Context, log log.Log) (MainDB, error) {
	log.Info("Initialize and connect to the MainDB...")

	database, ok := os.LookupEnv("MONGO_DATABASE")
	if !ok {
		return nil, errors.New("Mongo database not provided in environment")
	}

	collection, ok := os.LookupEnv("MONGO_COLLECTION")
	if !ok {
		return nil, errors.New("Mongo collection not provided in environment")
	}

	mongoURI := "mongodb+srv://" + user + ":" + password + "@cluster0.dd7vb.mongodb.net/database?retryWrites=true&w=majority"

	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, err
	}

	log.Info("Connection to MainDB established")

	return &mainDBStruct{
		ctx:    ctx,
		client: client.Database(database).Collection(collection),
		log:    log,
	}, nil
}

func (m *mainDBStruct) Add(username, name string, age float64) error {
	_, err := m.client.InsertOne(m.ctx, models.UsersJson{
		Username: &username,
		Age:      &age,
		Name:     &name,
	})
	if err != nil {
		return err
	}

	return nil
}

func (m *mainDBStruct) Get(username string) (*models.UsersJson, error) {
	resp := &models.UsersJson{}
	err := m.client.FindOne(m.ctx, bson.D{{"username", username}}).Decode(resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (m *mainDBStruct) Remove(username string) error {
	_, err := m.client.DeleteOne(m.ctx, bson.D{{"username", username}})
	if err != nil {
		return err
	}

	return nil
}

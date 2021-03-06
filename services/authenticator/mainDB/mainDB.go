package mainDB

import (
	"context"
	"errors"
	"os"
	"services/authenticator/log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MainDB interface {
	Get(email string) (*UserModel, error)
}

type mainDBStruct struct {
	ctx    context.Context
	client *mongo.Collection
	log    log.Log
}

type UserModel struct {
	Id         primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name       string             `json:"name"`
	Email      string             `json:"email"`
	Password   string             `json:"password"`
	Categories []string           `json:"categories"`
	Goal       int                `json:"goal"`
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

	user, ok := os.LookupEnv("MONGO_USER")
	if !ok {
		return nil, errors.New("Mongo user not provided in environment")
	}

	password, ok := os.LookupEnv("MONGO_PASSWORD")
	if !ok {
		return nil, errors.New("Mongo password not provided in environment")
	}

	mongoURI := "mongodb+srv://" + user + ":" + password + "@cluster0.dd7vb.mongodb.net/" + database + "?retryWrites=true&w=majority"

	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}

	newCtx, _ := context.WithTimeout(ctx, 12*time.Hour)
	err = client.Connect(newCtx)
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

func (m *mainDBStruct) Get(email string) (*UserModel, error) {
	resp := &UserModel{}
	err := m.client.FindOne(m.ctx, bson.D{{"email", email}}).Decode(resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

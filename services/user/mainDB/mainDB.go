package mainDB

import (
	"context"
	"errors"
	"os"
	"services/user/log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MainDB interface {
	Add(email, password, name string) error
	Get(email string) (*UserWithoutPasswordModel, error)
	GetWithPassword(email string) (*UserModel, error)
	Update(user *UserWithoutPasswordModel) error
	UpdateWithPassword(user *UserModel) error
	Remove(username string) error
}

type mainDBStruct struct {
	ctx    context.Context
	client *mongo.Collection
	log    log.Log
}

type UserModel struct {
	Name       string   `json:"name"`
	Email      string   `json:"email"`
	Password   string   `json:"password"`
	Categories []string `json:"categories"`
	Goal       int      `json:"goal"`
}

type UserWithoutPasswordModel struct {
	Name       string   `json:"name"`
	Email      string   `json:"email"`
	Categories []string `json:"categories"`
	Goal       int      `json:"goal"`
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

func (m *mainDBStruct) Add(email, password, name string) error {
	_, err := m.client.InsertOne(m.ctx, UserModel{
		Email:      email,
		Password:   password,
		Name:       name,
		Categories: []string{"default-category1", "default-category2"},
		Goal:       0,
	})
	if err != nil {
		return err
	}

	return nil
}

func (m *mainDBStruct) Get(email string) (*UserWithoutPasswordModel, error) {
	resp := &UserWithoutPasswordModel{}
	err := m.client.FindOne(m.ctx, bson.D{{"email", email}}, options.FindOne().SetProjection(bson.M{"password": 0})).Decode(resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (m *mainDBStruct) GetWithPassword(email string) (*UserModel, error) {
	resp := &UserModel{}
	err := m.client.FindOne(m.ctx, bson.D{{"email", email}}).Decode(resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (m *mainDBStruct) Update(user *UserWithoutPasswordModel) error {
	_, err := m.client.DeleteOne(m.ctx, bson.D{{"email", user.Email}})
	if err != nil {
		return err
	}

	_, err = m.client.InsertOne(m.ctx, *user)
	if err != nil {
		return err
	}

	return nil
}

func (m *mainDBStruct) UpdateWithPassword(user *UserModel) error {
	_, err := m.client.DeleteOne(m.ctx, bson.D{{"email", user.Email}})
	if err != nil {
		return err
	}

	_, err = m.client.InsertOne(m.ctx, *user)
	if err != nil {
		return err
	}

	return nil
}

func (m *mainDBStruct) Remove(email string) error {
	_, err := m.client.DeleteOne(m.ctx, bson.D{{"email", email}})
	if err != nil {
		return err
	}

	return nil
}

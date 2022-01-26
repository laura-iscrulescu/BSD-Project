package identityDB

import (
	"context"
	"errors"
	"os"
	"services/user/log"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis"
)

type IdentityDB interface {
	GetKey(value string) (string, error)
}

type identityDBStruct struct {
	ctx        context.Context
	client     *redis.Client
	expiration time.Duration
	log        log.Log
}

func Initialize(ctx context.Context, log log.Log) (IdentityDB, error) {
	log.Info("Initialize and connect to the IdentityDB...")

	addr, ok := os.LookupEnv("REDIS_ADDR")
	if !ok {
		return nil, errors.New("Redis server address not provided in environment")
	}

	port, ok := os.LookupEnv("REDIS_PORT")
	if !ok {
		return nil, errors.New("Redis server port not provided in environment")
	}

	expirationString, ok := os.LookupEnv("REDIS_ENTRY_EXPIRATION")
	if !ok {
		log.Info("Using default expiration value: 12 hours")
		expirationString = "12"
	}
	expiration, err := strconv.Atoi(expirationString)
	if err != nil {
		return nil, err
	}

	client := redis.NewClient(&redis.Options{
		Addr: addr + ":" + port,
		DB:   0,
	})

	_, err = client.Ping().Result()
	if err != nil {
		return nil, err
	}

	log.Info("Connection to IdentityDB established")

	return &identityDBStruct{
		ctx:        ctx,
		client:     client,
		expiration: time.Hour * time.Duration(expiration),
		log:        log,
	}, nil
}

func (i *identityDBStruct) GetKey(value string) (string, error) {
	keys, _, err := i.client.Scan(0, "*", 0).Result()
	if err != nil {
		return "", err
	}

	for _, keyWithCounter := range keys {
		valueInIDB, err := i.client.Get(keyWithCounter).Result()
		if err != nil {
			return "", err
		}

		if valueInIDB == value {
			keyList := strings.Split(keyWithCounter, ".")
			return strings.Join(keyList[:len(keyList)-1], "."), nil
		}
	}

	return "", errors.New("Email not found for given token")
}

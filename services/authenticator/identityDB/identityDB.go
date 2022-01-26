package identityDB

import (
	"context"
	"errors"
	"os"
	"services/authenticator/log"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis"
)

type IdentityDB interface {
	Add(key, value string) error
	Get(key string) ([]string, error)
	GetKey(value string) (string, error)
	GetAll() (map[string]string, error)
	Remove(key, value string) error
	Clear(key string) error
	ClearAll() error
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

func (i *identityDBStruct) Add(key, value string) error {
	var counter int = 1

	for {
		exists, _ := i.client.Exists(key + "." + strconv.Itoa(counter)).Result()
		if exists == 0 {
			break
		}
		counter++
	}

	err := i.client.Set(key+"."+strconv.Itoa(counter), value, i.expiration).Err()
	if err != nil {
		return err
	}

	return nil
}

func (i *identityDBStruct) Get(key string) ([]string, error) {
	keys, _, err := i.client.Scan(0, key+".*", 0).Result()
	if err != nil {
		return nil, err
	}

	var values []string
	for _, key := range keys {
		value, err := i.client.Get(key).Result()
		if err != nil {
			return nil, err
		}

		values = append(values, value)
	}

	return values, nil
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

func (i *identityDBStruct) GetAll() (map[string]string, error) {
	keys, _, err := i.client.Scan(0, "*", 0).Result()
	if err != nil {
		return nil, err
	}

	entries := make(map[string]string)
	for _, key := range keys {
		value, err := i.client.Get(key).Result()
		if err != nil {
			return nil, err
		}

		entries[key] = value
	}

	return entries, nil
}

func (i *identityDBStruct) Remove(key, value string) error {
	keys, _, err := i.client.Scan(0, key+".*", 0).Result()
	if err != nil {
		return err
	}

	for _, key := range keys {
		dbValue, err := i.client.Get(key).Result()
		if err != nil {
			return err
		}

		if dbValue == value {
			err := i.client.Del(key).Err()
			if err != nil {
				return err
			}

			break
		}
	}

	return nil
}

func (i *identityDBStruct) Clear(key string) error {
	keys, _, err := i.client.Scan(0, key+".*", 0).Result()
	if err != nil {
		return err
	}

	for _, key := range keys {
		err := i.client.Del(key).Err()
		if err != nil {
			return err
		}
	}

	return nil
}

func (i *identityDBStruct) ClearAll() error {
	err := i.client.FlushDB().Err()
	if err != nil {
		return err
	}

	return nil
}

package mainDB_test

import (
	"context"
	"os"
	"runtime"
	"services/authenticator/log"
	"services/authenticator/mainDB"
	"strings"
	"testing"

	"github.com/joho/godotenv"
	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(m *testing.M) {
	_, testFile, _, _ := runtime.Caller(0)
	configFile := strings.Join(strings.Split(testFile, "/")[:len(strings.Split(testFile, "/"))-3], "/") + "/config.env"
	godotenv.Load(configFile)

	os.Setenv("MONGO_DATABASE", "database")
	os.Setenv("MONGO_COLLECTION", "users")

	os.Exit(m.Run())
}

func TestMainDB(t *testing.T) {
	var err error
	var mdb mainDB.MainDB
	ctx := context.Background()
	log := log.Initialize()

	Convey("Test MainDB", t, func() {
		Convey("Initialize IdentityDB connection\n", func() {
			mdb, err = mainDB.Initialize(ctx, log)
			So(err, ShouldEqual, nil)
		})

		Convey("Add entry\n", func() {
			err = mdb.Add("test-username", "test-name", 23)
			So(err, ShouldEqual, nil)
		})

		Convey("Get entry\n", func() {
			resp, err := mdb.Get("test-username")
			So(err, ShouldEqual, nil)
			So(resp, ShouldNotEqual, nil)
			So(*resp.Name, ShouldEqual, "test-name")
			So(*resp.Age, ShouldEqual, float64(23))

		})

		Convey("Remove entry\n", func() {
			err = mdb.Remove("test-username")
			So(err, ShouldEqual, nil)
		})
	})
}

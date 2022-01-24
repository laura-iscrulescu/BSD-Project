package mainDB_test

import (
	"context"
	"os"
	"services/authenticator/log"
	"services/authenticator/mainDB"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(m *testing.M) {
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
			err = mdb.Add("test-email", "test-password", "test-name")
			So(err, ShouldEqual, nil)
		})

		Convey("Get existent entry\n", func() {
			resp, err := mdb.Get("test-email")
			So(err, ShouldEqual, nil)
			So(resp, ShouldNotEqual, nil)
			log.Info(*resp.Name)
		})

		Convey("Get missing entry\n", func() {
			_, err := mdb.Get("test-email-2")
			So(err, ShouldNotEqual, nil)
		})

		Convey("Remove entry\n", func() {
			err = mdb.Remove("test-email")
			So(err, ShouldEqual, nil)
		})
	})
}

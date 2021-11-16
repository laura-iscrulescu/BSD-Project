package identityDB_test

import (
	"context"
	"os"
	"services/authenticator/identityDB"
	"services/authenticator/log"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(m *testing.M) {
	os.Setenv("REDIS_ADDR", "127.0.0.1")
	os.Setenv("REDIS_PORT", "6379")
	os.Setenv("REDIS_ENTRY_EXPIRATION", "12")

	os.Exit(m.Run())
}

func TestIdentityDB(t *testing.T) {
	var err error
	var idb identityDB.IdentityDB
	ctx := context.Background()
	log := log.Initialize()

	Convey("Test IdentityDB", t, func() {
		Convey("Initialize IdentityDB connection\n", func() {
			idb, err = identityDB.Initialize(ctx, log)
			So(err, ShouldEqual, nil)
		})

		Convey("Clear IdentityDB entries\n", func() {
			err = idb.ClearAll()
			So(err, ShouldEqual, nil)

			entries, err := idb.GetAll()
			So(err, ShouldEqual, nil)
			So(len(entries), ShouldEqual, 0)
		})

		Convey("Add multiple entries\n", func() {
			err = idb.Add("test1", "1234")
			So(err, ShouldEqual, nil)

			err = idb.Add("test1", "5678")
			So(err, ShouldEqual, nil)

			err = idb.Add("test1", "9012")
			So(err, ShouldEqual, nil)

			err = idb.Add("test2", "1234")
			So(err, ShouldEqual, nil)
		})

		Convey("Check entries entry\n", func() {
			values, err := idb.Get("test1")
			So(err, ShouldEqual, nil)
			So(len(values), ShouldEqual, 3)

			values, err = idb.Get("test2")
			So(err, ShouldEqual, nil)
			So(len(values), ShouldEqual, 1)
		})

		Convey("Remove some entries and check\n", func() {
			err = idb.Remove("test1", "1234")
			So(err, ShouldEqual, nil)

			values, err := idb.Get("test1")
			So(err, ShouldEqual, nil)
			So(len(values), ShouldEqual, 2)

			values, err = idb.Get("test2")
			So(err, ShouldEqual, nil)
			So(len(values), ShouldEqual, 1)
		})

		Convey("Remove all entries from a epcific key and check\n", func() {
			err = idb.Clear("test1")
			So(err, ShouldEqual, nil)

			values, err := idb.Get("test1")
			So(err, ShouldEqual, nil)
			So(len(values), ShouldEqual, 0)

			values, err = idb.Get("test2")
			So(err, ShouldEqual, nil)
			So(len(values), ShouldEqual, 1)
		})

		Convey("Clean remaining entries", func() {
			err = idb.ClearAll()
			So(err, ShouldEqual, nil)
		})
	})
}

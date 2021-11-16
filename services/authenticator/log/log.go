package log

import (
	logger "log"
)

type Log interface {
	Info(message string)
	DB(message string, opts ...string)
	Error(err error)
	Fatal(err error)
}

type logStruct struct {
}

func Initialize() Log {
	return &logStruct{}
}

func (l *logStruct) Info(message string) {
	logger.Println(message)
}

func (l *logStruct) DB(message string, opts ...string) {
	final := ""
	final += message
	for _, opt := range opts {
		final += opt
		if opt != opts[len(opts)-1] {
			final += ":"
		}
	}
	logger.Println(final)
}

func (l *logStruct) Error(err error) {
	logger.Println("ERROR: " + err.Error())
}

func (l *logStruct) Fatal(err error) {
	logger.Fatal(err)
}

package log

import (
	logger "log"
)

type Log interface {
	Info(message string)
	Error(message string)
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

func (l *logStruct) Error(message string) {
	logger.Println("ERROR: " + message)
}

func (l *logStruct) Fatal(err error) {
	logger.Fatal(err)
}

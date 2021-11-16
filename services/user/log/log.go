package log

import (
	logger "log"
)

type ILog interface {
	Info(message string)
	Fatal(err error)
}

type logStruct struct {
}

func Initialize() ILog {
	return &logStruct{}
}

func (l *logStruct) Info(message string) {
	logger.Println(message)
}

func (l *logStruct) Fatal(err error) {
	logger.Fatal(err)
}

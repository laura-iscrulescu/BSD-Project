package utils

func Contains(list []string, value string) bool {
	for _, valueInList := range list {
		if valueInList == value {
			return true
		}
	}

	return false
}

func Remove(list []string, value string) []string {
	for index, val := range list {
		if value == val {
			return append(list[:index], list[index+1:]...)
		}
	}

	return list
}

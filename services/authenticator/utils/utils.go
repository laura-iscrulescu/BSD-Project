package utils

func Contains(list []string, value string) bool {
	for _, valueInList := range list {
		if valueInList == value {
			return true
		}
	}

	return false
}

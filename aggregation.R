ontime <- read.csv('ontime.csv')

ontime_by_airport_and_carrier <- aggregate(cbind(CarrierDelay, WeatherDelay, NASDelay,  SecurityDelay, LateAircraftDelay) ~ Origin + Carrier, FUN=sum, data=ontime)

ontime_by_airport_and_carrier$Origin <- as.character(ontime_by_airport_and_carrier$Origin)
ontime_by_airport_and_carrier$Carrier <- as.character(ontime_by_airport_and_carrier$Carrier)
ontime_by_airport_and_carrier[with(ontime_by_airport_and_carrier, order(Origin, Carrier)), ]

ontime_by_airport_and_carrier <- ontime_by_airport_and_carrier[with(ontime_by_airport_and_carrier, order(Origin, Carrier)), ]
ontime_by_airport_and_carrier$TotalDelay <- ontime_by_airport_and_carrier$CarrierDelay + ontime_by_airport_and_carrier$WeatherDelay + ontime_by_airport_and_carrier$NASDelay + ontime_by_airport_and_carrier$SecurityDelay + ontime_by_airport_and_carrier$LateAircraftDelay

ontime_by_airport_and_carrier$DLdelay <- ifelse(grepl("DL", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$EVdelay <- ifelse(grepl("EV", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$OOdelay <- ifelse(grepl("OO", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$AAdelay <- ifelse(grepl("AA", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$ASdelay <- ifelse(grepl("AS", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$ASdelay <- ifelse(grepl("AS", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$B6delay <- ifelse(grepl("B6", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$F9delay <- ifelse(grepl("F9", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$HAdelay <- ifelse(grepl("HA", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$NKdelay <- ifelse(grepl("NK", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$OOdelay <- ifelse(grepl("OO", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$UAdelay <- ifelse(grepl("UA", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$VXdelay <- ifelse(grepl("VX", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)
ontime_by_airport_and_carrier$WNdelay <- ifelse(grepl("WN", ontime_by_airport_and_carrier$Carrier), ontime_by_airport_and_carrier$TotalDelay, 0)

aggregated <- aggregate(cbind(CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay, TotalDelay, DLdelay, EVdelay, OOdelay, AAdelay, ASdelay, B6delay, F9delay, HAdelay, NKdelay, UAdelay, VXdelay, WNdelay) ~ Origin, ontime_by_airport_and_carrier, sum)
write.csv(aggregated, file='total_aggregation.csv')

ontime <- read.csv('/Users/simonbr/Desktop/cs314/a3/ontime.csv')

airport_delays2 <- aggregate(cbind(CarrierDelay, WeatherDelay, NASDelay,  SecurityDelay, LateAircraftDelay) ~ Origin + Carrier, FUN=sum, data=ontime)

airport_delays2$Origin <- as.character(airport_delays2$Origin)
airport_delays2$Carrier <- as.character(airport_delays2$Carrier)
airport_delays2[with(airport_delays2, order(Origin, Carrier)), ]

airport_delays2 <- airport_delays2[with(airport_delays2, order(Origin, Carrier)), ]
airport_delays2$TotalDelay <- airport_delays2$CarrierDelay + airport_delays2$WeatherDelay + airport_delays2$NASDelay + airport_delays2$SecurityDelay + airport_delays2$LateAircraftDelay
write.csv(airport_delays2, '/Users/simonbr/Desktop/cs314/a3/ontime_by_airport_and_carrier.csv', row.names=FALSE)


ontime_by_airport_and_carrier <- read_csv("C:/Users/barri/Desktop/cs314-assignment3/ontime_by_airport_and_carrier.csv")
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
View(ontime_by_airport_and_carrier)
tmp = ontime_by_airport_and_carrier
write.csv(tmp, file='tmp.csv')
aggregated <- aggregate(cbind(CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay, TotalDelay, DLdelay, EVdelay, OOdelay, AAdelay, ASdelay, B6delay, F9delay, HAdelay, NKdelay, UAdelay, VXdelay, WNdelay)~Origin, ontime_by_airport_and_carrier, sum)
write.csv(aggregated, file='total_aggregation.csv')
